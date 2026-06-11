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

export const registerAction = async (
  payload: IRegisterPayload
): Promise<ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  const { confirmPassword: _confirm, ...apiPayload } = parsedPayload.data;
  void _confirm;

  try {
    const response = await httpClient.post<IRegisterResponse["data"]>(
      "/auth/register",
      apiPayload
    );

    const email = response.data?.user?.email;

    // ✅ Do NOT set any auth cookies here.
    // The user is not considered logged in until they verify their email
    // and explicitly log in. Setting cookies here causes a redirect loop
    // because middleware sees a valid token but emailVerified=false and
    // bounces between /verify-email and the dashboard infinitely.

    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  } catch (error: unknown) {
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
      "Registration failed";

    return { success: false, message };
  }
};