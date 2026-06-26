"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Clock, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface FeaturedDoctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  initials: string;
  license: string;
  bgClass: string;
}

const mockDoctors: FeaturedDoctor[] = [
  {
    id: "doc-1",
    name: "Dr. Ananya Sharma",
    specialty: "Cardiology",
    experience: 12,
    rating: 4.9,
    reviews: 186,
    fee: 800,
    initials: "AS",
    license: "MCI-90518",
    bgClass: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    id: "doc-2",
    name: "Dr. Vivek Nair",
    specialty: "General Medicine",
    experience: 10,
    rating: 4.8,
    reviews: 142,
    fee: 600,
    initials: "VN",
    license: "MCI-84271",
    bgClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    id: "doc-3",
    name: "Dr. Priya Das",
    specialty: "Pediatrics",
    experience: 8,
    rating: 4.7,
    reviews: 98,
    fee: 500,
    initials: "PD",
    license: "MCI-72109",
    bgClass: "bg-blue-50 text-blue-700 border-blue-100",
  },
];

export default function FeaturedDoctors() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background radial visual */}
      <div className="absolute right-0 bottom-1/3 -mr-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-50 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Specialist Roster
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Consult with verified, experienced doctors.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every medical specialist has completed rigorous qualification screening and board certification verification before consulting on our network.
            </p>
          </div>

          <Button 
            variant="outline" 
            className="border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
            asChild
          >
            <Link href="/consultation">
              <span>View All Doctors</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Doctor Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {mockDoctors.map((doc) => (
            <motion.div key={doc.id} variants={cardVariants}>
              <Card className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg hover:border-emerald-500/30 hover:bg-white transition-all duration-300 h-full relative group">
                <div>
                  
                  {/* Doctor Profile Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {/* Initials Avatar */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg border ${doc.bgClass} shadow-xs`}>
                        {doc.initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors truncate">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{doc.specialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rating Block */}
                  <div className="flex items-center gap-1 mt-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 ml-1">
                      {doc.rating}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({doc.reviews} reviews)
                    </span>
                  </div>

                  {/* Verified License details */}
                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                      <ShieldCheck className="h-4.5 w-4.5 text-[#047857] shrink-0" />
                      <span className="font-medium">License: {doc.license} (Verified)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                      <Clock className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                      <span>{doc.experience} Years Experience</span>
                    </div>
                  </div>

                </div>

                {/* Consultation details & Book */}
                <div className="mt-6 pt-5 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Fee per consult</span>
                    <span className="text-lg font-extrabold text-slate-900">₹{doc.fee}</span>
                  </div>
                  <Button 
                    className="bg-[#047857] hover:bg-[#035f43] text-white text-xs font-semibold px-4 py-2 h-9 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm border-0"
                    asChild
                  >
                    <Link href={`/consultation?searchTerm=${encodeURIComponent(doc.name)}`}>
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Book Slot</span>
                    </Link>
                  </Button>
                </div>

              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}