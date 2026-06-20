"use client";

import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/register/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IRegisterPayload, registerZodSchema } from "@/zod/register.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AuthLayout from "./AuthLayout";
import AuthCard from "./AuthCard";
import SocialLogin from "./SocialLogin";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return String(error);
};

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);
        if (result && !result.success) {
          setServerError(result.message || "Registration failed");
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        setServerError(err?.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <AuthLayout activeStep={0}>
      <AuthCard
        title="Create an Account"
        description="Sign up to book consultations and manage your health."
      >
        {/* Social Authentication Row */}
        <SocialLogin />

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
          {/* Full Name */}
          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
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
                    Full Name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    placeholder="Enter your full name"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={cn(
                      "h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-blue-500/10 focus-visible:border-blue-500/80",
                      hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                    )}
                  />
                  {hasError && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {firstError}
                    </p>
                  )}
                </motion.div>
              );
            }}
          </form.Field>

          {/* Email Address */}
          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
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
                    Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    placeholder="Enter your email"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={cn(
                      "h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-blue-500/10 focus-visible:border-blue-500/80",
                      hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                    )}
                  />
                  {hasError && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {firstError}
                    </p>
                  )}
                </motion.div>
              );
            }}
          </form.Field>

          {/* Password */}
          <form.Field
            name="password"
            validators={{ onChange: registerZodSchema.shape.password }}
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
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      placeholder="Enter your password"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-blue-500/10 focus-visible:border-blue-500/80",
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

          {/* Confirm Password */}
          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue("password");
                if (!value) return "Please confirm your password";
                if (value !== password) return "Passwords do not match";
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
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showConfirm ? "text" : "password"}
                      value={field.state.value}
                      placeholder="Confirm password"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        "pr-10 h-11 rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-blue-500/10 focus-visible:border-blue-500/80",
                        hasError && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-1 z-20 h-full hover:bg-transparent text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
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
                    className="w-full h-11 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin size-4 mr-2" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </Button>
                </motion.div>
              );
            }}
          </form.Subscribe>
        </form>

        {/* Bottom Log-In Link */}
        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default RegisterForm;