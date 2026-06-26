"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I schedule a virtual consultation on Healix?",
    answer: "You can book a consultation by navigating to the Consultation page, searching for a specialist by name or specialty (e.g. Cardiology, Pediatrics), selecting an available slot from the doctor's calendar, and confirming the booking. Once confirmed, the video link will appear on your Patient Dashboard.",
  },
  {
    question: "Are all doctors on the platform certified?",
    answer: "Yes, 100% of our clinical consultants are verified. Every doctor goes through a multi-stage background check where our team validates their medical board licenses (MCI/NMC), specialization certifications, clinical experience records, and professional standing.",
  },
  {
    question: "How do I access my digital prescriptions?",
    answer: "After your consultation, the doctor will write and sign a secure digital prescription. You will receive an email notification immediately, and the full PDF copy will be stored securely inside your Patient Dashboard under 'My Prescriptions'.",
  },
  {
    question: "What is your cancellation and rescheduling policy?",
    answer: "You can cancel or reschedule any appointment up to 4 hours before the scheduled start time directly from your dashboard. Cancelled appointments within this window are eligible for a full refund back to your original payment method.",
  },
  {
    question: "Is my personal health data secure on Healix?",
    answer: "Absolutely. Healix is built on industry-standard secure architecture. All medical records, video consultations, and messaging logs are protected with end-to-end 256-bit AES encryption. Our storage systems comply strictly with HIPAA regulations to ensure absolute patient confidentiality.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute right-1/4 bottom-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heading + Support Card */}
          <div className="lg:col-span-5 space-y-6">
            <Badge className="bg-emerald-100/80 text-emerald-800 border-emerald-200/50 hover:bg-emerald-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Answering your clinical & platform questions.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Find instant answers to details regarding digital appointments, physician verification, health data security, and consulting services.
            </p>

            {/* Premium Support Card */}
            <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Still have questions?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our patient support team is available 24/7. Reach out and we will help you resolve your query.
                  </p>
                  <div className="pt-2">
                    <Button variant="link" className="text-emerald-700 hover:text-emerald-800 p-0 text-xs font-bold gap-1 group/btn cursor-pointer">
                      Contact Support
                      <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Interactive Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-slate-800 hover:text-slate-900 text-sm sm:text-base cursor-pointer focus:outline-none transition-colors"
                  >
                    <span className="pr-4 leading-snug">{faq.question}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-slate-50">
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
