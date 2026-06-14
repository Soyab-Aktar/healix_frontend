"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import Link from "next/link";
import { Mail, KeyRound } from "lucide-react";
import { forgotPasswordAction } from "./_action";
import { forgotPasswordZodSchema, IForgotPasswordPayload } from "@/zod/auth.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ForgotPasswordPage = () => {
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
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold font-sans">Forgot Password</CardTitle>
        <CardDescription className="mt-1">
          Enter your email address and we will send you a 6-digit OTP code to reset your password.
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
          className="space-y-5"
        >
          <form.Field
            name="email"
            validators={{ onChange: forgotPasswordZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="Enter your registered email"
                append={<Mail className="h-4 w-4 text-muted-foreground mr-3" />}
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
                pendingLabel="Sending OTP..."
                disabled={!canSubmit}
              >
                Send Reset Code
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
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

export default ForgotPasswordPage;