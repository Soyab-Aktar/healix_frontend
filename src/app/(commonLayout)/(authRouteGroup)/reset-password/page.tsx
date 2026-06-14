"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { resetPasswordAction } from "./_action";
import { resetPasswordZodSchema, IResetPasswordPayload } from "@/zod/auth.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") ?? "";

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
      } catch (error: unknown) {
        const err = error as { message?: string };
        setServerError(err?.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold font-sans">Reset Password</CardTitle>
        <CardDescription className="mt-1">
          Enter the 6-digit OTP code sent to your email, and choose a new password.
        </CardDescription>
      </CardHeader>

      <CardContent>
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
          {/* Email */}
          <form.Field
            name="email"
            validators={{ onChange: resetPasswordZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                disabled={!!emailFromUrl}
              />
            )}
          </form.Field>

          {/* OTP Code */}
          <form.Field
            name="otp"
            validators={{ onChange: resetPasswordZodSchema.shape.otp }}
          >
            {(field) => (
              <AppField
                field={field}
                label="6-Digit Verification Code"
                type="text"
                placeholder="Enter 6-digit code"
                append={<KeyRound className="h-4 w-4 text-muted-foreground mr-3" />}
              />
            )}
          </form.Field>

          {/* New Password */}
          <form.Field
            name="newPassword"
            validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    variant="ghost"
                    size="icon"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Resetting Password..."
                disabled={!canSubmit}
              >
                Reset Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Back to login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;