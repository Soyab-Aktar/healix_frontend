"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  Shield, 
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle2,
  Lock,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function PlatformBenefits() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute right-0 top-1/3 -mr-32 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 -ml-32 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="max-w-3xl mb-16">
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-50 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Clinical Infrastructure
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Integrated health tools built for human outcomes.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Move past fragmented messaging apps and paper folders. Healix unifies your consultations, records, and treatments in a clinical-grade dashboard.
          </p>
        </div>

        {/* Asymmetrical Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left: Large Highlight Card (Unified Health Records Timeline UI) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 flex"
          >
            <Card className="w-full bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-all duration-300">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-6 shadow-xs text-emerald-700">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Unified Patient Health Records
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                  A centralized, secure chronological timeline of your diagnoses, prescriptions, lab results, and clinician summaries. Share selected fields with any physician instantly.
                </p>
              </div>

              {/* Mock Timeline UI */}
              <div className="relative z-10 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs max-w-md self-center lg:self-start w-full">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Health Journal</span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-100/60">
                    <Lock className="h-2.5 w-2.5" /> HIPAA Encrypted
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Timeline Item 1 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-700">1</div>
                      <div className="w-0.5 h-8 bg-slate-100 mt-1" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Dr. Vivek Nair · Cardiology</h4>
                      <p className="text-[11px] text-slate-500">ECG Report & Diagnostic Note added</p>
                      <span className="text-[9px] text-slate-400">June 24, 2026</span>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-700">2</div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Smart Prescription Refill</h4>
                      <p className="text-[11px] text-slate-500">Amlodipine (5mg) Refilled · 30 Days</p>
                      <span className="text-[9px] text-slate-400">June 20, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right: Stack of Two Feature Panels */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col gap-8 justify-between"
          >
            {/* Feature Panel 1: Secure Clinic Chat */}
            <Card className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:shadow-md transition-all duration-300 flex-1">
              <div>
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-6 shadow-xs text-emerald-700">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Direct Doctor Messenger
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Follow up with your consulting specialists directly after your appointment. Ask questions, log side effects, or adjust dosages without scheduling a new visit.
                </p>
              </div>

              {/* Chat bubble mock UI */}
              <div className="space-y-2 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">Dr</div>
                  <div className="bg-slate-100 text-slate-800 text-[11px] p-2.5 rounded-2xl rounded-tl-none leading-normal">
                    How is your heart rate tracking after the revised dose?
                  </div>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <div className="bg-emerald-600 text-white text-[11px] p-2.5 rounded-2xl rounded-tr-none leading-normal max-w-[80%]">
                    Steady at 72 bpm, feeling much better today. Thank you!
                  </div>
                </div>
              </div>
            </Card>

            {/* Feature Panel 2: Verified Physicians & Assurance */}
            <Card className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:shadow-md transition-all duration-300 flex-1">
              <div>
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-6 shadow-xs text-emerald-700">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  100% Verified Specialists
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Every doctor on Healix undergoes rigorous multi-layer verification of license credentials, specialization history, and clinical experience.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">MCI & Board Certified</h4>
                  <p className="text-[10px] text-slate-400">Credential checks verified by Healix Compliance</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Dynamic bottom row with stats/trust */}
        <div className="mt-16 pt-12 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { metric: "100%", label: "Verified Physicians", icon: UserCheck },
            { metric: "15 min", label: "Average Queue Time", icon: Activity },
            { metric: "256-bit", label: "Data Encryption", icon: Lock },
            { metric: "4.9/5", label: "Patient Care Rating", icon: Sparkles }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900 tracking-tight">{item.metric}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
