import Link from "next/link";
import Image from "next/image";
import { IDoctor } from "@/types/doctor.types";
import {
  Star,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  GraduationCap,
  Stethoscope,
  Heart,
  ArrowRight,
} from "lucide-react";

interface DoctorCardProps {
  doctor: IDoctor;
  isAuthenticated?: boolean;
}



export default function DoctorCard({ doctor, isAuthenticated }: DoctorCardProps) {
  const specialties = doctor.specialties
    ?.slice(0, 2)
    .map((s) => s.specialty?.title)
    .filter(Boolean);

  const href = isAuthenticated
    ? `/dashboard/book-appointments/doctor/${doctor.id}`
    : `/consultation/doctor/${doctor.id}`;

  const hasAvailableSlots = (doctor.doctorSchedules?.length ?? 0) > 0;

  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-[24px] border border-slate-300/70 hover:shadow-xl hover:border-emerald-100/90 transition-all duration-300 group h-full flex flex-col overflow-hidden shadow-xs">
        {/* Top details section */}
        <div className="p-6 flex flex-col flex-1">
          {/* Avatar + Info Row */}
          <div className="flex items-start gap-4 mb-5">
            {/* Avatar container */}
            <div className="relative shrink-0">
              <div className="relative w-20 h-20 rounded-[20px] overflow-hidden bg-emerald-50 border border-slate-100 shadow-xs">
                {doctor.profilePhoto ? (
                  <Image
                    src={doctor.profilePhoto}
                    alt={doctor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-600 font-extrabold text-2xl bg-emerald-50">
                    {doctor.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Verified Shield Badge */}
              <div className="absolute -bottom-1 -left-1 w-6.5 h-6.5 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-50">
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#047857] fill-[#047857]/10" />
                </div>
              </div>
            </div>

            {/* Name + Designation + Rating */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors truncate mb-0.5">
                {doctor.name}
              </h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 truncate">
                {doctor.designation}
              </p>
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                <span className="text-sm font-bold text-slate-700">
                  {doctor.averageRating?.toFixed(1) ?? "0.0"}
                </span>
              </div>
            </div>
          </div>

          {/* Specialties pills */}
          {specialties && specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 pt-0.5">
              {specialties.map((title, idx) => (
                <span
                  key={title}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#eefcf7] text-[#047857] px-3 py-1.5 rounded-full font-semibold border border-emerald-100/30"
                >
                  {idx === 0 ? (
                    <Stethoscope className="h-3.5 w-3.5 text-[#047857]" />
                  ) : (
                    <Heart className="h-3.5 w-3.5 text-[#047857]" />
                  )}
                  {title}
                </span>
              ))}
              {(doctor.specialties?.length ?? 0) > 2 && (
                <span className="text-xs bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full font-semibold border border-slate-100">
                  +{doctor.specialties!.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Next Available Slot */}
          {hasAvailableSlots && (
            <div className="flex flex-wrap mt-1.5">
              <span className="inline-flex items-center text-xs bg-[#047857] text-white px-2 py-1 rounded-full font-bold">
                Slots Available
              </span>
            </div>
          )}

          {/* Faint divider */}
          <div className="h-px bg-slate-100 my-4" />

          {/* Info rows */}
          <div className="space-y-3 mt-auto">
            {doctor.currentWorkingPlace && (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <GraduationCap className="h-4.5 w-4.5 text-[#047857] shrink-0" />
                <span className="truncate font-medium text-slate-600">
                  {doctor.currentWorkingPlace}
                </span>
              </div>
            )}
            {doctor.experience !== undefined && (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Briefcase className="h-4.5 w-4.5 text-[#047857] shrink-0" />
                <span className="font-medium text-slate-600">
                  {doctor.experience} yr{doctor.experience !== 1 ? "s" : ""} experience
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom footer section */}
        <div className="px-6 py-5 bg-[#f8faf9] border-t border-slate-100 flex items-center justify-between gap-4">
          {/* Fee details */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-xs shrink-0">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 leading-none">
                {doctor.appointmentFee}
              </span>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">/ session</span>
            </div>
          </div>

          {/* Divider line */}
          <div className="w-px h-10 bg-slate-200/60" />

          {/* CTA Button */}
          <Link
            href={href}
            className="bg-[#047857] hover:bg-[#035f43] text-white text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>View Profile</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}