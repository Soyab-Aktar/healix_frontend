"use client";

import { forgotPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/forgot-password/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Loader2, Mail } from "lucide-react";
import Link from "next/link";
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

const ForgotPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (email: string) => forgotPasswordAction(email),
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value.email);
        if (result && !result.success) {
          setServerError(result.message || "Failed to request password reset");
        }
      } catch (error: any) {
        console.log(`Password reset request failed: ${error.message}`);
        setServerError(`Request failed: ${error.message}`);
      }
    },
  });

  return (
    <AuthLayout activeStep={1}>
      <AuthCard
        title="Forgot Password?"
        description="No worries! Enter your email address to receive a 6-digit verification code."
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <KeyRound className="h-6 w-6 text-[#047857]" />
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
          className="space-y-5"
        >
          {/* Email Field */}
          <form.Field
            name="email"
            validators={{ onChange: forgotPasswordZodSchema.shape.email }}
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
                      placeholder="Enter your registered email"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600/80",
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
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <span>Send Reset Code</span>
                    )}
                  </Button>
                </motion.div>
              );
            }}
          </form.Subscribe>
        </form>

        {/* Back to Login Link */}
        <p className="text-sm text-slate-500 text-center mt-6">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:text-[#047857] font-semibold transition-colors hover:underline underline-offset-2"
          >
            Back to login
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
