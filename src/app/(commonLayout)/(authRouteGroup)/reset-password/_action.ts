"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (
  payload: IResetPasswordPayload
): Promise<ApiErrorResponse> => {
  const parsed = resetPasswordZodSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message || "Invalid input parameters",
    };
  }

  try {
    await httpClient.post("/auth/reset-password", parsed.data);
    // Redirect user to login page after successful password reset
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
      "Failed to reset password. Please verify the code and try again.";

    return { success: false, message };
  }
};
