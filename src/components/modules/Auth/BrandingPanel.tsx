"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const onboardingSteps = [
  {
    id: 0,
    number: "1",
    title: "Sign up your account",
  },
  {
    id: 1,
    number: "2",
    title: "Book Appointment",
  },
  {
    id: 2,
    number: "3",
    title: "Get Healthcare",
  },
];

interface BrandingPanelProps {
  initialStep?: number;
}

const BrandingPanel = ({ initialStep = 0 }: BrandingPanelProps) => {
  const activeIndex = initialStep;

  return (
    <div className="relative flex flex-col justify-between w-full h-full p-8 lg:p-10 overflow-hidden bg-gradient-to-br from-[#0d9488] to-[#047857] text-white rounded-[20px] shadow-lg">
      {/* Top Section: Logo */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-md shadow-teal-700/20">
          <ShieldCheck className="w-5 h-5 text-[#047857]" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Healix
        </span>
      </div>

      {/* Middle/Bottom Text & Cards */}
      <div className="relative z-10 mt-auto flex flex-col">
        {/* Title and Description Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white max-w-[240px] leading-tight">
            {activeIndex === 0 ? "Get Started with Us" : "Welcome Back"}
          </h2>
          <p className="text-xs text-teal-100/80 max-w-[220px] leading-relaxed pb-0.5">
            {activeIndex === 0
              ? "Complete these easy steps to register your account."
              : "Sign in to access your appointments and care options."}
          </p>
        </div>

        {/* 3 Onboarding Cards Row */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {onboardingSteps.map((step) => {
            const isActive = step.id === activeIndex;

            return (
              <div
                key={step.id}
                className={cn(
                  "p-4 aspect-square flex flex-col justify-between rounded-2xl transition-all duration-300 select-none border",
                  isActive
                    ? "bg-white text-[#047857] border-white shadow-lg"
                    : "bg-white/10 text-white border-white/5 hover:bg-white/15"
                )}
              >
                {/* Step Badge */}
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                    isActive ? "bg-[#047857] text-white" : "bg-white/10 text-white"
                  )}
                >
                  {step.number}
                </div>
                
                {/* Step Title */}
                <h4 className="text-[11px] lg:text-xs font-medium leading-tight">
                  {step.title}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandingPanel;
