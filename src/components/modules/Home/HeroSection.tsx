"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Star, 
  Video, 
  Calendar,
  Sparkles,
  HeartPulse,
  Activity
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { NumberTicker } from "@/components/ui/number-ticker";

const specialtiesList = [
  { id: "Cardiology", title: "Cardiology" },
  { id: "Dermatology", title: "Dermatology" },
  { id: "Pediatrics", title: "Pediatrics" },
  { id: "Neurology", title: "Neurology" },
  { id: "Psychiatry", title: "Psychiatry" },
  { id: "General Medicine", title: "General Medicine" },
];

export default function HeroSection() {
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSpecialty && selectedSpecialty !== "all") {
      params.set("searchTerm", selectedSpecialty);
    }
    if (searchVal.trim()) {
      params.set("searchTerm", searchVal.trim());
    }
    router.push(`/consultation?${params.toString()}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const widgetVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 80, damping: 12 },
    },
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center overflow-hidden pt-28 pb-16 transition-colors duration-300">
      {/* Background visual textures */}
      <div className="absolute inset-0 bg-[radial-gradient(#047857_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />
      
      {/* Soft light blurs */}
      <div className="absolute top-1/4 left-10 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 bottom-1/4 w-[450px] h-[450px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Headline & Interactive Search Selector */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            <motion.div variants={textVariants}>
              <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Next-Gen Telehealth System
              </Badge>
            </motion.div>

            <motion.h1 
              variants={textVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08] lg:max-w-xl transition-colors"
            >
              Modern Healthcare, <br className="hidden sm:inline" />
              <span className="text-[#047857]">Re-Imagined</span> for Human Lives.
            </motion.h1>

            <motion.p 
              variants={textVariants}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl transition-colors"
            >
              Connect with board-certified doctors in minutes. Book online consultations, securely access your medical records, manage prescriptions, and track your healthcare—all from one unified platform.
            </motion.p>

            {/* Interactive Search Box */}
            <motion.div 
              variants={textVariants}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md shadow-slate-100 dark:shadow-none rounded-2xl p-3 sm:p-4 transition-colors"
            >
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Select
                    value={selectedSpecialty}
                    onValueChange={setSelectedSpecialty}
                    modal={false}
                  >
                    <SelectTrigger className="w-full h-11 border-slate-200 dark:border-slate-800 rounded-xl text-slate-650 dark:text-slate-300 bg-white dark:bg-slate-900 focus:ring-emerald-500/20 focus:border-emerald-600">
                      <SelectValue placeholder="Select Specialty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg p-1 z-50">
                      <SelectItem value="all" className="rounded-lg cursor-pointer px-3 py-2">All Specialties</SelectItem>
                      {specialtiesList.map((spec) => (
                        <SelectItem key={spec.id} value={spec.id} className="rounded-lg cursor-pointer px-3 py-2">
                          {spec.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                  <Input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search doctor or keyword..."
                    className="w-full pl-10 pr-4 h-11 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 placeholder-slate-400"
                  />
                </div>

                <Button 
                  type="submit"
                  className="bg-[#047857] hover:bg-[#035f43] text-white text-sm font-semibold h-11 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm border-0 transition-colors"
                >
                  <span>Search</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </form>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              variants={textVariants}
              className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 transition-colors"
            >
              {[
                { label: "Active Patients", value: 500, suffix: "+" },
                { label: "Medical Specialists", value: 100, suffix: "+" },
                { label: "Consultation Rating", value: 4.5, suffix: "/5 ★", decimalPlaces: 1 },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    <NumberTicker value={stat.value} decimalPlaces={stat.decimalPlaces ?? 0} />
                    <span>{stat.suffix}</span>
                  </p>
                  <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Mock Mockup Widget Assembly */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-5 relative flex flex-col gap-6"
          >
            {/* Primary Interactive Doctor Card */}
            <motion.div variants={widgetVariants} className="w-full">
              <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-lg shadow-slate-100 dark:shadow-none hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-start gap-4">
                  {/* Mock Photo */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-[#047857] dark:text-emerald-400 font-bold text-xl shadow-xs">
                      Dr
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 ring-2 ring-emerald-500/20" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">Dr. Ananya Sharma</h3>
                      <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 font-bold text-[9px] px-2 py-0.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shrink-0">
                        Top Rated
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Cardiologist · 12 yrs exp</p>
                    
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] text-slate-500 dark:text-slate-450 font-semibold ml-1">4.9 (186 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold block uppercase">Next slot</span>
                    <span className="text-xs font-bold text-slate-855 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-[#047857] dark:text-emerald-450" /> Today, 3:30 PM
                    </span>
                  </div>
                  <Button 
                    className="bg-[#047857] hover:bg-[#035f43] text-white text-xs font-semibold px-4 h-8 rounded-lg cursor-pointer border-0"
                    asChild
                  >
                    <Link href="/consultation">
                      <span>Book Consultation</span>
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Bottom Row: Video Match Status & Vitals Chart Widget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              
              {/* Telehealth Status Widget */}
              <motion.div variants={widgetVariants} className="flex">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-md shadow-slate-100 dark:shadow-none flex flex-col justify-between flex-1">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                      <Video className="h-4.5 w-4.5" />
                    </span>
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-0 text-[9px] px-2 py-0.5 rounded-full font-bold">
                      Connected
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Virtual Clinic Room</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Secure consultation channel open</p>
                  </div>
                </Card>
              </motion.div>

              {/* Vitals Health Widget */}
              <motion.div variants={widgetVariants} className="flex">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-md shadow-slate-100 dark:shadow-none flex flex-col justify-between flex-1">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-450">
                      <HeartPulse className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                      <Activity className="h-3 w-3 text-emerald-500 dark:text-emerald-400 animate-pulse" /> Live Vitals
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Heart Rate: 72 BPM</h4>
                    {/* SVG Sparkline */}
                    <div className="h-5 w-full mt-2 flex items-end">
                      <svg className="w-full h-full text-emerald-500 dark:text-emerald-400" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path
                          d="M0,15 L10,15 L15,5 L20,18 L25,12 L30,15 L50,15 L55,2 L60,19 L65,11 L70,15 L100,15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>
              </motion.div>

            </div>

            {/* floating badge */}
            <motion.div 
              variants={widgetVariants}
              className="absolute -top-6 -left-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2.5 flex items-center gap-2 hidden lg:flex pointer-events-none dark:shadow-none"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">ISO 27001 Certified Security</span>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}