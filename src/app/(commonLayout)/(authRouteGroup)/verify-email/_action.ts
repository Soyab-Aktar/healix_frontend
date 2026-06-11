"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { redirect } from "next/navigation";

export const verifyEmailAction = async (
  email: string,
  otp: string
): Promise<ApiErrorResponse> => {
  if (!email || !otp) {
    return { success: false, message: "Email and OTP are required" };
  }
  if (otp.length !== 6) {
    return { success: false, message: "OTP must be 6 digits" };
  }

  try {
    await httpClient.post("/auth/verify-email", { email, otp });
    // After verification user must log in — redirect to login
    redirect("/login");
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
      "Verification failed. Please check your OTP and try again.";

    return { success: false, message };
  }
};

export const resendVerificationEmailAction = async (
  email: string
): Promise<ApiErrorResponse> => {
  if (!email) {
    return { success: false, message: "Email is required" };
  }

  try {
    await httpClient.post("/auth/resend-verification-email", { email });
    return { success: true, message: "Verification email resent successfully" };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const message =
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Failed to resend verification email";
    return { success: false, message };
  }
};