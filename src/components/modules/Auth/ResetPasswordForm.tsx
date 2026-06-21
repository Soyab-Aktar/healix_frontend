"use client";

import { resetPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/reset-password/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AuthLayout from "./AuthLayout";
import AuthCard from "./AuthCard";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return String(error);
};

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") ?? "";
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IResetPasswordPayload) => resetPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: emailFromUrl,
      otp: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);
        if (result && !result.success) {
          setServerError(result.message || "Failed to reset password");
        }
      } catch (error: any) {
        console.log(`Password reset failed: ${error.message}`);
        setServerError(`Reset failed: ${error.message}`);
      }
    },
  });

  return (
    <AuthLayout activeStep={1}>
      <AuthCard
        title="Reset Password"
        description="Enter the 6-digit OTP code sent to your email and choose a secure new password."
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Lock className="h-6 w-6 text-[#047857]" />
          </div>
        </div>

        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Email Field */}
          <form.Field
            name="email"
            validators={{ onChange: resetPasswordZodSchema.shape.email }}
          >
            {(field) => {
              const firstError =
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? getErrorMessage(field.state.meta.errors[0])
                  : null;
              const hasError = firstError !== null;

              return (
                <motion.div
                  className="space-y-1.5"
                  animate={hasError ? "shake" : "idle"}
                  variants={{
                    shake: { x: [0, -6, 6, -6, 6, -3, 3, 0], transition: { duration: 0.35 } },
                    idle: { x: 0 },
                  }}
                >
                  <Label
                    htmlFor={field.name}
                    className={cn(
                      "text-xs font-semibold text-slate-500 uppercase tracking-wider",
                      hasError && "text-destructive"
                    )}
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      placeholder="Enter your email"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={!!emailFromUrl}
                      className={cn(
                        "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600/80 disabled:opacity-70 disabled:bg-slate-50",
                        hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                      )}
                    />
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {hasError && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {firstError}
                    </p>
                  )}
                </motion.div>
              );
            }}
          </form.Field>

          {/* OTP Field */}
          <form.Field
            name="otp"
            validators={{ onChange: resetPasswordZodSchema.shape.otp }}
          >
            {(field) => {
              const firstError =
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? getErrorMessage(field.state.meta.errors[0])
                  : null;
              const hasError = firstError !== null;

              return (
                <motion.div
                  className="space-y-1.5"
                  animate={hasError ? "shake" : "idle"}
                  variants={{
                    shake: { x: [0, -6, 6, -6, 6, -3, 3, 0], transition: { duration: 0.35 } },
                    idle: { x: 0 },
                  }}
                >
                  <Label
                    htmlFor={field.name}
                    className={cn(
                      "text-xs font-semibold text-slate-500 uppercase tracking-wider",
                      hasError && "text-destructive"
                    )}
                  >
                    6-Digit Verification Code
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      maxLength={6}
                      value={field.state.value}
                      placeholder="Enter 6-digit code"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ""))}
                      className={cn(
                        "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600/80 tracking-[0.2em] font-semibold text-sm",
                        hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                      )}
                    />
                    <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {hasError && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {firstError}
                    </p>
                  )}
                </motion.div>
              );
            }}
          </form.Field>

          {/* New Password Field */}
          <form.Field
            name="newPassword"
            validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
          >
            {(field) => {
              const firstError =
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? getErrorMessage(field.state.meta.errors[0])
                  : null;
              const hasError = firstError !== null;

              return (
                <motion.div
                  className="space-y-1.5"
                  animate={hasError ? "shake" : "idle"}
                  variants={{
                    shake: { x: [0, -6, 6, -6, 6, -3, 3, 0], transition: { duration: 0.35 } },
                    idle: { x: 0 },
                  }}
                >
                  <Label
                    htmlFor={field.name}
                    className={cn(
                      "text-xs font-semibold text-slate-500 uppercase tracking-wider",
                      hasError && "text-destructive"
                    )}
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      placeholder="Minimum 8 characters"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600/80",
                        hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-1 z-20 h-full hover:bg-transparent text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  {hasError && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {firstError}
                    </p>
                  )}
                </motion.div>
              );
            }}
          </form.Field>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2"
            >
              <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5 text-destructive p-3">
                <AlertDescription className="text-xs font-medium leading-relaxed">
                  {serverError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Submit Button */}
          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => {
              const loading = isSubmitting || isPending;
              return (
                <motion.div
                  whileHover={{ scale: loading ? 1 : 1.012 }}
                  whileTap={{ scale: loading ? 1 : 0.988 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="w-full h-11 rounded-xl text-white font-semibold bg-[#047857] hover:bg-[#035f43] shadow-md shadow-emerald-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin size-4 mr-2" />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </Button>
                </motion.div>
              );
            }}
          </form.Subscribe>
        </form>

        {/* Back to Login Link */}
        <div className="text-center text-sm border-t border-slate-100 mt-6 pt-4">
          <Link
            href="/login"
            className="text-slate-500 hover:text-slate-900 font-medium transition-colors hover:underline underline-offset-2"
          >
            ← Back to login
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPasswordForm;
