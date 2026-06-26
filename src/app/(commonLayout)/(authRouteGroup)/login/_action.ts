"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

/** Maps raw backend error messages to user-friendly strings */
const mapLoginError = (raw: string, email: string): { message: string; redirect?: string } => {
  const lower = raw.toLowerCase();

  if (
    lower.includes("invalid password") ||
    lower.includes("incorrect password") ||
    lower.includes("wrong password") ||
    lower.includes("password") ||
    lower.includes("credentials")
  ) {
    return { message: "Incorrect password. Please try again." };
  }

  if (
    lower.includes("user not found") ||
    lower.includes("no user") ||
    lower.includes("not found") ||
    lower.includes("does not exist")
  ) {
    return {
      message: "No account found with this email. Please register first.",
    };
  }

  if (lower.includes("email not verified")) {
    return {
      message: "Please verify your email before logging in.",
      redirect: `/verify-email?email=${encodeURIComponent(email)}`,
    };
  }

  if (lower.includes("account") && lower.includes("disabled")) {
    return { message: "Your account has been disabled. Please contact support." };
  }

  if (lower.includes("network") || lower.includes("econnrefused")) {
    return { message: "Unable to reach the server. Please try again later." };
  }

  return { message: raw || "Login failed. Please check your credentials." };
};

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>("/auth/login", payload);
    const { accessToken, refreshToken, token, user } = response.data;
    const { role, needPasswordChange, email } = user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token);

    const targetPath =
      redirectPath && isValidRedirectRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);
    redirect(targetPath as string);
  } catch (error: unknown) {
    // Re-throw ALL Next.js redirects
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    const rawMessage =
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Login failed";

    const mapped = mapLoginError(rawMessage, payload.email);

    // Email not verified → redirect to verify page
    if (mapped.redirect) {
      redirect(mapped.redirect);
    }

    return {
      success: false,
      message: mapped.message,
    };
  }
};