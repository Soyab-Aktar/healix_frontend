"use client";

import {
  resendVerificationEmailAction,
  verifyEmailAction,
} from "@/app/(commonLayout)/(authRouteGroup)/verify-email/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Mail, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AuthLayout from "./AuthLayout";
import AuthCard from "./AuthCard";

const OTP_LENGTH = 6;

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  
  // Directly initialize to 60 to avoid synchronous setState inside on-mount useEffect
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const otpString = otp.join("");

  const { mutate: submitOtp, isPending: isVerifying } = useMutation({
    mutationFn: () => verifyEmailAction(emailFromQuery, otpString),
    onSuccess: (result) => {
      if (result && !result.success) {
        setServerError(result.message || "Verification failed");
      }
    },
    onError: (err: unknown) => {
      const e = err as { message?: string };
      setServerError(e?.message || "Something went wrong");
    },
  });

  const { mutate: resendEmail, isPending: isResending } = useMutation({
    mutationFn: () => resendVerificationEmailAction(emailFromQuery),
    onSuccess: (result) => {
      if (result.success) {
        setResendMessage("A new code has been sent to your email.");
        setResendCooldown(60);
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        setServerError(null);
      } else {
        setServerError(result.message);
      }
    },
  });

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setResendMessage(null);
    if (otpString.length < OTP_LENGTH) {
      setServerError("Please enter the complete 6-digit code.");
      return;
    }
    submitOtp();
  };

  const isComplete = otpString.length === OTP_LENGTH;

  return (
    <AuthLayout activeStep={0}>
      <AuthCard
        title="Check your email"
        description={
          emailFromQuery
            ? `We sent a 6-digit verification code to ${emailFromQuery}. Enter it below to verify your account.`
            : "We sent a 6-digit verification code to your email address. Enter it below to verify your account."
        }
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Mail className="h-6 w-6 text-[#047857]" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`OTP digit ${index + 1}`}
                className={cn(
                  "w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold border rounded-xl outline-none transition-all duration-150",
                  digit
                    ? "border-[#047857] bg-emerald-50/20 text-emerald-900"
                    : "border-slate-300 bg-white text-slate-900 focus-visible:ring-3 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600/80",
                  serverError && "border-destructive text-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive/80"
                )}
              />
            ))}
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5 text-destructive p-3">
                <AlertDescription className="text-xs font-medium leading-relaxed">
                  {serverError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {resendMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert className="border-green-200 bg-green-50 text-green-800 rounded-xl p-3">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs font-medium leading-relaxed">{resendMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Verify button */}
          <motion.div
            whileHover={{ scale: !isComplete || isVerifying ? 1 : 1.012 }}
            whileTap={{ scale: !isComplete || isVerifying ? 1 : 0.988 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              type="submit"
              disabled={!isComplete || isVerifying}
              className="w-full h-11 rounded-xl text-white font-semibold bg-[#047857] hover:bg-[#035f43] shadow-md shadow-emerald-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </motion.div>

          {/* Resend Code Section */}
          <div className="text-center text-sm text-slate-500">
            Didn&apos;t receive the code?{" "}
            {resendCooldown > 0 ? (
              <span className="text-slate-400">
                Resend in{" "}
                <span className="font-semibold text-slate-600 tabular-nums">
                  {resendCooldown}s
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => resendEmail()}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:underline underline-offset-4 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isResending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
                Resend code
              </button>
            )}
          </div>

          {/* Back to login */}
          <div className="text-center text-sm border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-slate-500 hover:text-slate-900 font-medium transition-colors cursor-pointer hover:underline underline-offset-2"
            >
              ← Back to login
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default VerifyEmailForm;