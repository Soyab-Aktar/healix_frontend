"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    window.location.href = `${baseUrl}/auth/login/google`;
  };

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: 1.012 }}
        whileTap={{ scale: 0.988 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-11 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl shadow-xs transition-all duration-200 gap-2.5 flex items-center justify-center cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.76 14.97.67 12 .67c-4.3 0-8.01 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z"
            />
            <path
              fill="#4285F4"
              d="M22.56 11.92c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 13.76c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V6.74H2.18C1.43 8.22 1 9.89 1 11.67s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#34A853"
              d="M12 22.67c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84c1.81 3.59 5.52 6.06 9.82 6.06z"
            />
          </svg>
          <span className="text-sm font-medium">Continue with Google</span>
        </Button>
      </motion.div>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="px-3 bg-white text-slate-400 font-medium text-[10px]">
            Or continue with
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
