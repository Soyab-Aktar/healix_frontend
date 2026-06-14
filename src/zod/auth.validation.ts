import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
})

export const forgotPasswordZodSchema = z.object({
  email: z.email("Invalid email address"),
})

export const resetPasswordZodSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
})

export const changePasswordZodSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters long"),
})

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>;