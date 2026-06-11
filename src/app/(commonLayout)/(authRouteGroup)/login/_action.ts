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

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  try {
    const response = await httpClient.post<ILoginResponse>("/auth/login", payload);
    const { accessToken, refreshToken, token, user } = response.data;
    const { role, needPasswordChange, email } = user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token);

    if (needPasswordChange) {
      redirect(`/reset-password?email=${encodeURIComponent(email)}`);
    } else {
      const targetPath =
        redirectPath && isValidRedirectRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);
      redirect(targetPath as string);
    }
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

    // Email not verified — redirect with email so verify page shows it
    if (axiosError?.response?.data?.message === "Email not verified") {
      // We need the email from the original payload
      redirect(
        `/verify-email?email=${encodeURIComponent(payload.email)}`
      );
    }

    return {
      success: false,
      message: `Login failed: ${axiosError?.message}`,
    };
  }
};