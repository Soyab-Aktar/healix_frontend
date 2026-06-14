"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { changePasswordAction } from "./_action";
import { changePasswordZodSchema, IChangePasswordPayload } from "@/zod/auth.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ChangePasswordPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IChangePasswordPayload) => changePasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      
      if (value.newPassword !== value.confirmPassword) {
        setServerError("New passwords do not match");
        return;
      }

      try {
        const result = await mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });

        if (result.success) {
          toast.success("Password updated successfully!");
          form.reset();
        } else {
          setServerError(result.message || "Failed to update password");
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        setServerError(err?.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto space-y-6 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account credentials and security settings.
        </p>
      </div>

      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-bold">Update Password</CardTitle>
          </div>
          <CardDescription>
            Change your account password regularly to keep your credentials secure.
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
            {/* Current Password */}
            <form.Field
              name="currentPassword"
              validators={{ onChange: changePasswordZodSchema.shape.currentPassword }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      variant="ghost"
                      size="icon"
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {/* New Password */}
            <form.Field
              name="newPassword"
              validators={{ onChange: changePasswordZodSchema.shape.newPassword }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      variant="ghost"
                      size="icon"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {/* Confirm Password */}
            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value, fieldApi }) => {
                  const newPass = fieldApi.form.getFieldValue("newPassword");
                  if (!value) return "Please confirm your new password";
                  if (value !== newPass) return "Passwords do not match";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      variant="ghost"
                      size="icon"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
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
                  pendingLabel="Saving Password..."
                  disabled={!canSubmit}
                >
                  Save Changes
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;