"use client";

import { motion } from "framer-motion";
import { Star, Quote, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  feedback: string;
  rating: number;
  initials: string;
  badgeText: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Amit Sharma",
    location: "New Delhi",
    role: "Patient (Cardiology Follow-up)",
    feedback: "I was highly skeptical about virtual cardiology consultations, but Dr. Ananya was incredibly thorough. The digital prescription and consultation notes were available in my portal instantly. Healix has saved me hours of clinic travel.",
    rating: 5,
    initials: "AS",
    badgeText: "Verified Consultation",
  },
  {
    id: "test-2",
    name: "Sneha Patel",
    location: "Mumbai",
    role: "Parent (Pediatrics consultation)",
    feedback: "Finding a reliable pediatrician late in the evening is usually stressful. Through Healix, we booked an appointment within 15 minutes. The doctor listened patiently, explained the dosage clearly, and followed up the next morning.",
    rating: 5,
    initials: "SP",
    badgeText: "Verified Care",
  },
  {
    id: "test-3",
    name: "Dr. Sanjay Gupta",
    location: "Bengaluru",
    role: "Consultant Physician",
    feedback: "The clinical dashboard is what sets Healix apart. It compiles structured patient records, chronological vitals logs, and previous diagnostics into a clean timeline. It allows me to make safer, better-informed clinical assessments.",
    rating: 5,
    initials: "SG",
    badgeText: "Verified Clinician",
  },
];

export default function TestimonialsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-0 bottom-1/4 -ml-32 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-emerald-100/80 text-emerald-800 border-emerald-200/50 hover:bg-emerald-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Loved by patients. Trusted by doctors.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Read authentic feedback from individuals, families, and healthcare providers who have transformed their clinical experience through Healix.
          </p>
        </div>

        {/* Testimonial Cards Layout - Asymmetric staggered height columns */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {mockTestimonials.map((t, idx) => (
            <motion.div 
              key={t.id} 
              variants={itemVariants}
              className={idx === 1 ? "md:translate-y-4" : ""}
            >
              <Card className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all duration-300 h-full relative overflow-hidden">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-slate-100/80" />
                
                <div className="space-y-4">
                  {/* Badge & Stars */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-100">
                      <ShieldCheck className="h-3 w-3" /> {t.badgeText}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Feedback text */}
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    &ldquo;{t.feedback}&rdquo;
                  </p>
                </div>

                {/* Profile info */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-200 shadow-2xs rounded-full">
                    <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-xs">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </div>

              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}