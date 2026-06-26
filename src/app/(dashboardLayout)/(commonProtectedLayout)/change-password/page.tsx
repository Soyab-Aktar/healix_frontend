"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck, Check } from "lucide-react";
import { changePasswordAction } from "./_action";
import { changePasswordZodSchema, IChangePasswordPayload } from "@/zod/auth.validation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return String(error);
};

const securityTips = [
  {
    id: 0,
    number: "1",
    title: "Min 8 characters length",
  },
  {
    id: 1,
    number: "2",
    title: "Include letters & numbers",
  },
  {
    id: 2,
    number: "3",
    title: "Never reuse old passwords",
  },
];

const ChangePasswordPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTip, setActiveTip] = useState(0);

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
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Page Header */}
      <div className="space-y-1 mb-8 text-left">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Security Settings</h1>
        <p className="text-sm text-slate-400 font-medium">
          Manage your account credentials and security settings.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-white border border-slate-300 rounded-[24px] p-2 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-stretch shadow-xl shadow-slate-100/50"
      >
        {/* Left Column: Security Branding Panel with teal/emerald gradient */}
        <div className="hidden lg:flex lg:col-span-6 min-h-[500px] relative flex-col justify-between w-full h-full p-8 lg:p-10 overflow-hidden bg-gradient-to-br from-[#0d9488] to-[#047857] text-white rounded-[20px] shadow-lg">
          {/* Logo Section */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-md shadow-teal-700/20">
              <ShieldCheck className="w-5 h-5 text-[#047857]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Healix
            </span>
          </div>

          {/* Icon & Title */}
          <div className="relative z-10 my-auto flex flex-col justify-center py-6">
            <div className="w-12 h-12 rounded-[14px] bg-white/10 flex items-center justify-center mb-4">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
              Protect Your Account
            </h2>
            <p className="text-sm text-teal-100/80 max-w-[340px] leading-relaxed">
              We recommend changing your password regularly to prevent unauthorized access and keep your medical records secure.
            </p>
          </div>

          {/* Security tips grid row */}
          <div className="relative z-10 mt-auto flex flex-col">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-200/70 mb-3">
              Password Guidelines
            </h4>
            <div className="grid grid-cols-3 gap-3 w-full">
              {securityTips.map((step) => {
                const isActive = step.id === activeTip;

                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveTip(step.id)}
                    className={cn(
                      "p-3.5 flex flex-col justify-between rounded-2xl transition-all duration-300 select-none border cursor-pointer aspect-square",
                      isActive
                        ? "bg-white text-[#047857] border-white shadow-lg"
                        : "bg-white/10 text-white border-white/5 hover:bg-white/15"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold",
                        isActive ? "bg-[#047857] text-white" : "bg-white/10 text-white"
                      )}
                    >
                      {isActive ? <Check className="w-3 h-3" /> : step.number}
                    </div>

                    <h4 className="text-[10px] lg:text-[11px] font-medium leading-tight">
                      {step.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Change Password Form */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center py-6 px-4 sm:px-8 lg:px-10">
          <div className="w-full max-w-[380px] mx-auto flex flex-col">

            {/* Header info */}
            <div className="space-y-1.5 text-left pb-6">
              <h3 className="text-xl font-bold tracking-tight text-slate-800">
                Update Password
              </h3>
              <p className="text-sm text-slate-400">
                Ensure your account is protected with a secure password.
              </p>
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
              {/* Current Password */}
              <form.Field
                name="currentPassword"
                validators={{ onChange: changePasswordZodSchema.shape.currentPassword }}
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
                        className={cn("text-xs font-semibold text-slate-500 uppercase tracking-wider", hasError && "text-destructive")}
                      >
                        Current Password
                      </Label>
                      <div className="relative group">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showCurrentPassword ? "text" : "password"}
                          value={field.state.value}
                          placeholder="Enter your current password"
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={cn(
                            "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/80",
                            hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                          )}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowCurrentPassword((v) => !v)}
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-1 z-20 h-full hover:bg-transparent text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        >
                          {showCurrentPassword ? (
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

              {/* New Password */}
              <form.Field
                name="newPassword"
                validators={{ onChange: changePasswordZodSchema.shape.newPassword }}
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
                        className={cn("text-xs font-semibold text-slate-500 uppercase tracking-wider", hasError && "text-destructive")}
                      >
                        New Password
                      </Label>
                      <div className="relative group">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showNewPassword ? "text" : "password"}
                          value={field.state.value}
                          placeholder="Minimum 8 characters"
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={cn(
                            "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/80",
                            hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                          )}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowNewPassword((v) => !v)}
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-1 z-20 h-full hover:bg-transparent text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? (
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
                        className={cn("text-xs font-semibold text-slate-500 uppercase tracking-wider", hasError && "text-destructive")}
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative group">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showConfirmPassword ? "text" : "password"}
                          value={field.state.value}
                          placeholder="Re-enter new password"
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={cn(
                            "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/80",
                            hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                          )}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-1 z-20 h-full hover:bg-transparent text-slate-400 hover:text-slate-600 cursor-pointer"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? (
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
                        className="w-full h-11 rounded-xl text-white font-semibold bg-[#047857] hover:bg-[#035f43] shadow-md shadow-emerald-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none animate-none"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin size-4 mr-2" />
                            <span>Saving Password...</span>
                          </>
                        ) : (
                          <span>Save Password</span>
                        )}
                      </Button>
                    </motion.div>
                  );
                }}
              </form.Subscribe>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePasswordPage;