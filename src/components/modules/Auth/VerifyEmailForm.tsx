"use client";

import {
  resendVerificationEmailAction,
  verifyEmailAction,
} from "@/app/(commonLayout)/(authRouteGroup)/verify-email/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Mail, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = 6;

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  // email can come from ?email=... query param (set by register redirect)
  const emailFromQuery = searchParams.get("email") ?? "";

  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start a 60s cooldown on mount so user can't spam resend immediately
  useEffect(() => {
    setResendCooldown(60);
  }, []);

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
      // On success Next.js redirect fires — no further handling needed
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

  // --- OTP input handlers ---
  const handleChange = (index: number, value: string) => {
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    // Auto-advance
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
    // Focus the last filled input or the next empty one
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
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Mail className="h-7 w-7 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription className="mt-1">
          We sent a 6-digit verification code to{" "}
          {emailFromQuery ? (
            <span className="font-medium text-gray-700">{emailFromQuery}</span>
          ) : (
            "your email address"
          )}
          . Enter it below to verify your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
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
                className={`
                  w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold
                  border-2 rounded-lg outline-none transition-all duration-150
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  ${digit ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}
                  ${serverError ? "border-destructive" : ""}
                `}
              />
            ))}
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {resendMessage && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{resendMessage}</AlertDescription>
            </Alert>
          )}

          {/* Verify button */}
          <Button
            type="submit"
            disabled={!isComplete || isVerifying}
            className="w-full"
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

          {/* Resend */}
          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            {resendCooldown > 0 ? (
              <span className="text-gray-400">
                Resend in{" "}
                <span className="font-medium text-gray-600 tabular-nums">
                  {resendCooldown}s
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => resendEmail()}
                disabled={isResending}
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline underline-offset-4 disabled:opacity-50"
              >
                {isResending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RotateCcw className="h-3 w-3" />
                )}
                Resend code
              </button>
            )}
          </div>

          {/* Back to login */}
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-muted-foreground hover:text-gray-800 transition-colors"
            >
              ← Back to login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerifyEmailForm;