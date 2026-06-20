"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
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

interface LoginParams {
  redirectPath?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return String(error);
};

const LoginForm = ({ redirectPath }: LoginParams) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value) as any;
        if (!result.success) {
          setServerError(result.message || "Login failed");
          return;
        }
      } catch (error: any) {
        console.log(`Login failed: ${error.message}`);
        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

  return (
    <AuthLayout activeStep={1}>
      <AuthCard
        title="Welcome Back!"
        description="Please enter your credentials to log in."
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
          {/* Email Field */}
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
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

          {/* Password Field */}
          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
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
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor={field.name}
                      className={cn("text-xs font-semibold text-slate-500 uppercase tracking-wider", hasError && "text-destructive")}
                    >
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline underline-offset-2"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                        <span>Logging In...</span>
                      </>
                    ) : (
                      <span>Log In</span>
                    )}
                  </Button>
                </motion.div>
              );
            }}
          </form.Subscribe>
        </form>

        {/* Bottom Sign-Up Link */}
        <p className="text-sm text-slate-500 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline underline-offset-2"
          >
            Sign Up
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginForm;