"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  UserCheck, 
  Video, 
  ArrowRight,
  SlidersHorizontal,
  Calendar,
  CheckCircle,
  PhoneCall,
  Mic,
  Camera,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Filter by Specialization",
    subtitle: "Define symptoms & parameters",
    description: "Search by physician designation or select key specialties. Apply granular filters for consultation fees, clinical experience, gender, and rating metrics.",
    icon: Search,
  },
  {
    id: 2,
    title: "Select Certified Specialist",
    subtitle: "Compare profiles & schedules",
    description: "Review comprehensive doctor backgrounds, licensing credentials, patient feedback ratings, and appointment rates. Pick a date and time slot that fits your schedule.",
    icon: UserCheck,
  },
  {
    id: 3,
    title: "Attend Virtual Consult",
    subtitle: "High-definition secure video",
    description: "Connect instantly inside our encrypted peer-to-peer clinical room. Discuss symptoms, review diagnostic reports, and receive digital prescriptions immediately.",
    icon: Video,
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Mini mockup component rendering based on active step
  const renderMockup = () => {
    switch (activeStep) {
      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full space-y-4"
          >
            {/* Filter mockup panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" /> Filter Criteria
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  Active
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Medical Specialization</div>
                <div className="p-2 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700">
                  Cardiology
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Min Fee</div>
                  <div className="p-2 border border-slate-200 bg-white rounded-lg text-xs text-slate-700">₹300</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Max Fee</div>
                  <div className="p-2 border border-slate-200 bg-white rounded-lg text-xs text-slate-700">₹1500</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="w-full bg-emerald-600 text-white font-semibold text-center text-xs py-2 rounded-lg shadow-xs">
                  Apply Search filters
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full space-y-4"
          >
            {/* Slot selection card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                  Dr
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dr. Vivek Nair</h4>
                  <p className="text-[10px] text-slate-500">General Physician · 10 yrs exp</p>
                </div>
              </div>

              <div className="border-t border-slate-200/60 pt-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase mb-2">Available Slots (Today)</p>
                <div className="grid grid-cols-3 gap-2">
                  {["10:00 AM", "11:30 AM", "03:00 PM"].map((slot, i) => (
                    <div 
                      key={slot} 
                      className={cn(
                        "text-[10px] py-1.5 text-center font-semibold rounded-lg border transition-colors cursor-pointer",
                        i === 1 
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-2">
                <span>Fee: ₹600</span>
                <span className="flex items-center gap-0.5 text-amber-500">
                  <Star className="h-3 w-3 fill-amber-400" /> 4.8 (84)
                </span>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full space-y-4"
          >
            {/* Consultation screen mock */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xs relative aspect-video flex items-center justify-center">
              
              {/* Patient thumbnail */}
              <div className="absolute right-3 top-3 w-16 h-12 bg-slate-800 border border-slate-700 rounded-md overflow-hidden flex items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium">You</span>
              </div>

              {/* Doctor consulting video placeholder */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dr. Ananya Sharma</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Consulting (08:42)
                  </p>
                </div>
              </div>

              {/* Call control overlay */}
              <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <Mic className="h-3.5 w-3.5" />
                </span>
                <span className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-white">
                  <PhoneCall className="h-3.5 w-3.5" />
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <Camera className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="how-it-works">
      {/* Visual background lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-50 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Patient Journey
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Consultations that work on your own terms.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Skip the clinical waiting rooms. Healix simplifies booking, medical search, and video care into a seamless 3-step digital flow.
          </p>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Stepper Controls */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;
              
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    "flex gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left items-start",
                    isActive 
                      ? "bg-slate-50 border-slate-200 shadow-xs" 
                      : "bg-white border-transparent hover:bg-slate-50/50"
                  )}
                >
                  {/* Step Icon Indicator */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                    isActive 
                      ? "bg-emerald-600 border-emerald-600 text-white" 
                      : "bg-slate-100 border-slate-200 text-slate-500"
                  )}>
                    <StepIcon className="h-5 w-5" />
                  </div>

                  {/* Step Description */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-1.5 py-0.5 rounded">
                        Step 0{step.id}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {step.subtitle}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Visual Mock Preview */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Card className="w-full max-w-sm bg-white border border-slate-200 p-5 rounded-3xl shadow-lg relative overflow-hidden flex items-center justify-center min-h-[220px]">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {renderMockup()}
              </AnimatePresence>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
}