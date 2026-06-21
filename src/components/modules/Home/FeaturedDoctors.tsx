import { getDoctors } from '@/services/doctor.services';
import { IDoctor } from '@/types/doctor.types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, IndianRupee, ArrowRight } from 'lucide-react';

export default async function FeaturedDoctors() {
  let doctors: IDoctor[] = [];

  try {
    const response = await getDoctors('limit=4&sortBy=averageRating&sortOrder=desc');
    doctors = (response?.data as IDoctor[]) ?? [];
  } catch {
    // Silently fail — section just won't render
  }

  if (doctors.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Our doctors</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Top-rated specialists
            </h2>
            <p className="text-slate-500 mt-3 max-w-md">
              Every doctor on our platform is verified, credentialed, and reviewed by real patients.
            </p>
          </div>
          <Link href="/consultation">
            <Button variant="outline" className="shrink-0 border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-600">
              View all doctors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorCard({ doctor }: { doctor: IDoctor }) {
  const specialties = doctor.specialties
    ?.slice(0, 2)
    .map((s) => s.specialty?.title)
    .filter(Boolean);

  return (
    <Link href={`/consultation/doctor/${doctor.id}`}>
      <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-200 h-full flex flex-col">
        {/* Top emerald band */}
        <div className="h-14 bg-gradient-to-r from-emerald-500 to-emerald-700 shrink-0" />

        <div className="px-4 pb-4 flex flex-col flex-1 -mt-7">
          {/* Avatar */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-[3px] border-white bg-emerald-50 shadow mb-3 shrink-0">
            {doctor.profilePhoto ? (
              <Image src={doctor.profilePhoto} alt={doctor.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                {doctor.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Name & designation */}
          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm leading-tight mb-0.5 truncate">
            {doctor.name}
          </h3>
          <p className="text-xs text-slate-500 mb-2 truncate">{doctor.designation}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">{doctor.averageRating?.toFixed(1)}</span>
            {doctor.experience !== undefined && (
              <span className="text-xs text-slate-400 ml-1">· {doctor.experience}yr exp</span>
            )}
          </div>

          {/* Specialties */}
          {specialties && specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {specialties.map((title) => (
                <Badge
                  key={title}
                  variant="secondary"
                  className="text-xs bg-emerald-50 text-emerald-700 border-0 px-2 py-0.5 font-medium"
                >
                  {title}
                </Badge>
              ))}
            </div>
          )}

          {/* Workplace */}
          {doctor.currentWorkingPlace && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
              <Briefcase className="h-3 w-3 shrink-0" />
              <span className="truncate">{doctor.currentWorkingPlace}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <div className="flex items-center gap-0.5 font-semibold text-slate-900 text-sm">
              <IndianRupee className="h-3.5 w-3.5" />
              {doctor.appointmentFee}
            </div>
            <span className="text-xs text-emerald-600 font-medium group-hover:underline">Book →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}