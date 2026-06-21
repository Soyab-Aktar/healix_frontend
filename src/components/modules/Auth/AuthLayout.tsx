"use client";

import React from "react";
import BrandingPanel from "./BrandingPanel";

interface AuthLayoutProps {
  activeStep: number;
  children: React.ReactNode;
}

const AuthLayout = ({ activeStep, children }: AuthLayoutProps) => {
  return (
    <div className="w-full min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-3 lg:py-4 bg-slate-50/50">
      <div className="w-full max-w-5xl min-h-[500px] sm:min-h-[530px] lg:min-h-[560px] bg-white border border-slate-300 rounded-[24px] p-2 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-stretch shadow-xl shadow-slate-100/50">
        {/* Left Column: Branding panel with teal gradient */}
        <div className="hidden lg:flex lg:col-span-6">
          <BrandingPanel initialStep={activeStep} />
        </div>

        {/* Right Column: Form content */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center py-5 px-4 sm:px-8 lg:px-10">
          <div className="w-full max-w-[420px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
