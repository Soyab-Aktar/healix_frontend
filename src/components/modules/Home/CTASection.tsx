"use client";

import { motion } from "framer-motion";
import { ArrowRight, UserPlus, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CTASection() {
  return (
    <section className="py-12 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deep Emerald Conversion Panel */}
        <div className="relative bg-gradient-to-br from-[#047857] via-[#035f43] to-[#02402d] rounded-[32px] overflow-hidden p-8 sm:p-12 lg:p-16 border border-emerald-800 dark:border-emerald-950/80 shadow-xl shadow-emerald-950/5">
          
          {/* Background Vector Grids & Blurs */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
          <div className="absolute -right-24 -top-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Grid Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading and copy */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider gap-1.5 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" /> Start Consulting
              </Badge>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Connect with verified clinical specialists today.
              </h2>
              
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl">
                Create a secure patient profile in seconds. Search board-certified specialists, book real-time video consults, and access your encrypted diagnostics in one dashboard.
              </p>
            </div>

            {/* Right Column: Actions */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 justify-start lg:justify-end">
              <Button 
                size="lg"
                className="bg-white hover:bg-emerald-50 text-[#047857] hover:text-[#035f43] font-bold text-sm px-6 h-12 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm border-0 transition-all active:scale-98"
                asChild
              >
                <Link href="/consultation">
                  <Calendar className="h-4.5 w-4.5" />
                  <span>Book Consultation</span>
                </Link>
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-emerald-500/40 hover:bg-white/10 hover:text-white text-white font-semibold text-sm px-6 h-12 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                asChild
              >
                <Link href="/login">
                  <UserPlus className="h-4.5 w-4.5" />
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}