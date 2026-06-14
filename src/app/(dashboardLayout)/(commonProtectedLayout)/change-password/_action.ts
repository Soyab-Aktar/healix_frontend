"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.validation";

export const changePasswordAction = async (
  payload: IChangePasswordPayload
): Promise<ApiErrorResponse> => {
  const parsed = changePasswordZodSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message || "Invalid input parameters",
    };
  }

  try {
    const response = await httpClient.post<any>("/auth/change-password", parsed.data);
    
    // De-structure new tokens generated after password change
    const { accessToken, refreshToken, token } = response.data || {};

    if (accessToken && refreshToken && token) {
      await setTokenInCookies("accessToken", accessToken);
      await setTokenInCookies("refreshToken", refreshToken);
      await setTokenInCookies("better-auth.session_token", token);
    }

    return { success: true, message: "Password updated successfully" };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    const message =
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Failed to change password. Please check your current password and try again.";

    return { success: false, message };
  }
};
