"use client";

import Link from "next/link";
import { 
  HeartPulse, 
  Sparkles, 
  Brain, 
  Baby, 
  Stethoscope, 
  Activity, 
  Smile, 
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const specialties = [
  { name: "Cardiology", icon: HeartPulse, desc: "Heart & blood vessels", color: "text-rose-600 bg-rose-50 border-rose-100" },
  { name: "Dermatology", icon: Sparkles, desc: "Skin, hair & nails", color: "text-amber-600 bg-amber-50 border-amber-100" },
  { name: "Pediatrics", icon: Baby, desc: "Children's health", color: "text-blue-600 bg-blue-50 border-blue-100" },
  { name: "Neurology", icon: Brain, desc: "Brain & nervous system", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  { name: "Gynecology", icon: Activity, desc: "Women's health", color: "text-pink-600 bg-pink-50 border-pink-100" },
  { name: "Psychiatry", icon: Smile, desc: "Mental health care", color: "text-purple-600 bg-purple-50 border-purple-100" },
  { name: "General Medicine", icon: Stethoscope, desc: "Primary clinical care", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { name: "Orthopedics", icon: ShieldAlert, desc: "Bones & joint mobility", color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
];

export default function SpecialtiesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-emerald-100/80 text-emerald-800 border-emerald-200/50 hover:bg-emerald-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Clinical Scope
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Consult doctors across certified medical fields.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Get treatment plans, diagnoses, and immediate prescriptions from verified clinicians specializing in a wide range of fields.
          </p>
        </div>

        {/* Specialties Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {specialties.map((s) => {
            const IconComponent = s.icon;
            return (
              <motion.div key={s.name} variants={itemVariants}>
                <Link href={`/consultation?searchTerm=${encodeURIComponent(s.name)}`}>
                  <Card className="group bg-white border border-slate-200/60 rounded-2xl p-5 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between cursor-pointer relative overflow-hidden">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-emerald-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    
                    <div className="space-y-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.color} transition-transform group-hover:scale-105`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                          {s.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-normal">
                          {s.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center text-[10px] sm:text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View specialists →
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}