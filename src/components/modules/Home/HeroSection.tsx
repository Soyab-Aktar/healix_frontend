"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  Star,
  Video,
  Check,
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
      // Find matching specialty title or ID
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
    <section className="relative min-h-[90vh] lg:min-h-screen bg-slate-50 flex items-center overflow-hidden pt-28 pb-16">
      {/* Background visual textures */}
      <div className="absolute inset-0 bg-[radial-gradient(#047857_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none" />

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
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-50 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Next-Gen Telehealth System
              </Badge>
            </motion.div>

            <motion.h1
              variants={textVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] lg:max-w-xl"
            >
              Modern Healthcare, <br className="hidden sm:inline" />
              <span className="text-[#047857]">Re-Imagined</span> for Human Lives.
            </motion.h1>

            <motion.p
              variants={textVariants}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
            >
              Connect with board-certified doctors in minutes. Book online consultations, securely access your medical records, manage prescriptions, and track your healthcare—all from one unified platform.
            </motion.p>

            {/* Interactive Search Box */}
            <motion.div
              variants={textVariants}
              className="w-full max-w-2xl bg-white border border-slate-200 shadow-md shadow-slate-100 rounded-2xl p-3 sm:p-4"
            >
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Select
                    value={selectedSpecialty}
                    onValueChange={setSelectedSpecialty}
                    modal={false}
                  >
                    <SelectTrigger className="w-full h-11 border-slate-200 rounded-xl text-slate-600 bg-white focus:ring-emerald-500/20 focus:border-emerald-600">
                      <SelectValue placeholder="Select Specialty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl border border-slate-200 shadow-lg p-1 z-50">
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
                    className="w-full pl-10 pr-4 h-11 border-slate-200 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-700 placeholder-slate-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-[#047857] hover:bg-[#035f43] text-white text-sm font-semibold h-11 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm border-0"
                >
                  <span>Search</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </form>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              variants={textVariants}
              className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-slate-200/50"
            >
              {[
                { label: "Active Patients", value: "50,000+" },
                { label: "Medical Specialists", value: "200+" },
                { label: "Consultation Rating", value: "4.9/5 ★" },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</p>
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
              <Card className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-start gap-4">
                  {/* Mock Photo */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#047857] font-bold text-xl shadow-xs">
                      Dr
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 truncate">Dr. Ananya Sharma</h3>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-[9px] px-2 py-0.5 rounded-md hover:bg-emerald-50 shrink-0">
                        Top Rated
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Cardiologist · 12 yrs exp</p>

                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] text-slate-500 font-semibold ml-1">4.9 (186 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Next slot</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-[#047857]" /> Today, 3:30 PM
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
                <Card className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-md shadow-slate-100 flex flex-col justify-between flex-1">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                      <Video className="h-4.5 w-4.5" />
                    </span>
                    <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[9px] px-2 py-0.5 rounded-full font-bold">
                      Connected
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-900">Virtual Clinic Room</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Secure consultation channel open</p>
                  </div>
                </Card>
              </motion.div>

              {/* Vitals Health Widget */}
              <motion.div variants={widgetVariants} className="flex">
                <Card className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-md shadow-slate-100 flex flex-col justify-between flex-1">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                      <HeartPulse className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                      <Activity className="h-3 w-3 text-emerald-500 animate-pulse" /> Live Vitals
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-900">Heart Rate: 72 BPM</h4>
                    {/* SVG Sparkline */}
                    <div className="h-5 w-full mt-2 flex items-end">
                      <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 20" preserveAspectRatio="none">
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
              className="absolute -top-6 -left-6 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 flex items-center gap-2 hidden lg:flex pointer-events-none"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800">ISO 27001 Certified Security</span>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}