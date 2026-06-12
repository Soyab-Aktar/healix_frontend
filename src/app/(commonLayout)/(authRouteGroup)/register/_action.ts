"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/register.validation";
import { redirect } from "next/navigation";

export interface IRegisterResponse {
  success: boolean;
  message: string;
  data: {
    token: string | null;
    accessToken: string;
    refreshToken: string;
    user: ILoginResponse["user"];
    patient: {
      id: string;
      name: string;
      email: string;
      profilePhoto: string | null;
      contactNumber: string | null;
      address: string | null;
    };
  };
}

/** Maps raw backend/Prisma error messages to user-friendly strings */
const mapRegisterError = (raw: string): string => {
  const lower = raw.toLowerCase();

  if (
    lower.includes("unique constraint") ||
    lower.includes("already exists") ||
    lower.includes("duplicate") ||
    lower.includes("prisma client known request error") // backend rollback bug on duplicate email
  ) {
    return "An account with this email already exists. Please log in or use a different email.";
  }

  if (lower.includes("invalid email")) return "Please enter a valid email address.";
  if (lower.includes("password")) return "Password does not meet requirements.";
  if (lower.includes("network") || lower.includes("econnrefused")) {
    return "Unable to reach the server. Please try again later.";
  }

  return raw || "Registration failed. Please try again.";
};

export const registerAction = async (
  payload: IRegisterPayload
): Promise<ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  const { confirmPassword: _confirm, ...apiPayload } = parsedPayload.data;
  void _confirm;

  try {
    const response = await httpClient.post<IRegisterResponse["data"]>(
      "/auth/register",
      apiPayload
    );

    const email = response.data?.user?.email;

    // Do NOT set auth cookies — user must verify email then log in explicitly.
    // Setting cookies here causes middleware redirect loops.
    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  } catch (error: unknown) {
    // Re-throw Next.js redirects
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
      response?: { data?: { message?: string; success?: boolean } };
      message?: string;
    };

    const rawMessage =
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Registration failed";

    return {
      success: false,
      message: mapRegisterError(rawMessage),
    };
  }
};