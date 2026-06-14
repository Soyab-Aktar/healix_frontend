"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { redirect } from "next/navigation";

export const forgotPasswordAction = async (
  email: string
): Promise<ApiErrorResponse> => {
  if (!email) {
    return { success: false, message: "Email is required" };
  }

  try {
    await httpClient.post("/auth/forgot-password", { email });
    // Redirect to reset password page to enter OTP
    redirect(`/reset-password?email=${encodeURIComponent(email)}`);
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
      response?: { data?: { message?: string } };
      message?: string;
    };

    const message =
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Failed to request password reset.";

    return { success: false, message };
  }
};
