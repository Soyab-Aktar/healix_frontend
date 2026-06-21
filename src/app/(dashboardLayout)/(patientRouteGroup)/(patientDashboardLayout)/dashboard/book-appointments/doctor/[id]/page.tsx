import DoctorReviews from "@/components/modules/Consultation/DoctorReviews";
import BookAppointmentButton from "@/components/modules/Consultation/BookAppointmentButton";
import { getDoctorById } from "@/services/doctor.services";
import { getReviewsByDoctorId } from "@/services/review.services";
import { IDoctorDetails } from "@/types/doctor.types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Award,
  Briefcase,
  ChevronLeft,
  Mail,
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  Stethoscope,
  Calendar,
  Clock3,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ConsultationDoctorByIdPageProps {
  params: Promise<{ id: string }>;
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "N/A";
  }

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A";
  }

  return format(dateValue, "MMM dd, yyyy hh:mm a");
};

const getTodayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const ConsultationDoctorByIdPage = async ({ params }: ConsultationDoctorByIdPageProps) => {
  const { id } = await params;

  let doctor: IDoctorDetails;
  try {
    const response = await getDoctorById(id);
    if (!response?.data) return notFound();
    doctor = response.data as IDoctorDetails;
  } catch {
    return notFound();
  }

  // Prefetch first page of reviews server-side
  const queryClient = new QueryClient();
  const initialReviewQueryString = new URLSearchParams({
    page: "1",
    limit: "5",
    sortBy: "createdAt",
    sortOrder: "desc",
  }).toString();

  await queryClient.prefetchQuery({
    queryKey: ["reviews", id, 1, "newest"],
    queryFn: () => getReviewsByDoctorId(id, initialReviewQueryString),
    staleTime: 1000 * 60 * 5,
  });

  // Extract specialties safely supporting both flat and nested schemas
  const specialties = doctor.specialties?.map((s: any) => {
    if (s && typeof s === "object" && 'specialty' in s && s.specialty) {
      return s.specialty;
    }
    return s;
  }) ?? [];

  const getInitials = (name?: string) => {
    if (!name) return "DR";
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase() ?? "")
      .join("");
  };

  const todayStart = getTodayStart();

  const availableUpcomingSchedules = (doctor.doctorSchedules ?? [])
    .filter((item) => {
      if (item.isBooked) {
        return false;
      }

      if (!item.schedule?.startDateTime) {
        return false;
      }

      const startDate = new Date(item.schedule.startDateTime);
      if (Number.isNaN(startDate.getTime())) {
        return false;
      }

      return startDate >= todayStart;
    })
    .sort((a, b) => {
      const leftValue = new Date(a.schedule?.startDateTime ?? 0).getTime();
      const rightValue = new Date(b.schedule?.startDateTime ?? 0).getTime();
      return leftValue - rightValue;
    });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard/book-appointments"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors group"
      >
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to all doctors
      </Link>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        {/* Background Decorative Blurs */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 -ml-16 -mb-16 w-56 h-56 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Avatar + Name + Booking Button row */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            {/* Squircle Avatar */}
            <div className="relative shrink-0">
              <div className="relative w-24 h-24 rounded-[20px] overflow-hidden bg-emerald-50 border border-slate-100 shadow-md">
                {doctor.profilePhoto ? (
                  <Image
                    src={doctor.profilePhoto}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-600 font-extrabold text-3xl bg-emerald-50">
                    {getInitials(doctor.name)}
                  </div>
                )}
              </div>
              {/* Verified Check Badge */}
              <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg border border-slate-50">
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#047857] fill-[#047857]/10" />
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 min-w-0 pt-0.5 space-y-1.5">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{doctor.name}</h1>
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">{doctor.designation}</p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Star className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                <span className="text-sm font-bold text-slate-700">
                  {doctor.averageRating?.toFixed(1) ?? '0.0'}
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider ml-1">Avg Rating</span>
              </div>
            </div>

            {/* Booking Button */}
            <div className="shrink-0 flex items-center pt-2 sm:pt-0">
              <BookAppointmentButton
                doctorId={doctor.id}
                doctorName={doctor.name}
                appointmentFee={doctor.appointmentFee}
                doctorSchedules={doctor.doctorSchedules}
              />
            </div>
          </div>

          {/* Specialties badging */}
          {specialties && specialties.length > 0 && (
            <div className="border-t border-slate-100 pt-5">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Specialties
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {specialties.map((s) => (
                  <span
                    key={s?.id}
                    className="inline-flex items-center gap-1.5 text-xs bg-[#eefcf7] text-[#047857] px-3.5 py-1.5 rounded-full font-semibold border border-emerald-100/30"
                  >
                    <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
                    {s?.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctor.qualification && (
              <InfoRow icon={<Award className="h-4.5 w-4.5" />} label="Qualification" value={doctor.qualification} />
            )}
            {doctor.currentWorkingPlace && (
              <InfoRow icon={<Briefcase className="h-4.5 w-4.5" />} label="Works at" value={doctor.currentWorkingPlace} />
            )}
            {doctor.experience !== undefined && (
              <InfoRow
                icon={<MapPin className="h-4.5 w-4.5" />}
                label="Experience"
                value={`${doctor.experience} year${doctor.experience !== 1 ? 's' : ''} practice`}
              />
            )}
            {doctor.contactNumber && (
              <InfoRow icon={<Phone className="h-4.5 w-4.5" />} label="Contact" value={doctor.contactNumber} />
            )}
            {doctor.email && (
              <InfoRow icon={<Mail className="h-4.5 w-4.5" />} label="Email" value={doctor.email} />
            )}
            {doctor.address && (
              <InfoRow icon={<MapPin className="h-4.5 w-4.5" />} label="Address" value={doctor.address} />
            )}
          </div>
        </div>
      </div>

      {/* Schedules Card */}
      <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-xs">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Available Doctor Schedules
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Today onward
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {availableUpcomingSchedules.slice(0, 18).map((item, index) => (
            <div
              key={item.id ?? item.schedule?.id ?? `schedule-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4.5 transition-all hover:border-emerald-100 hover:bg-emerald-50/5 flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock3 className="h-4.5 w-4.5" />
              </div>
              <div className="text-xs space-y-1.5 flex-1 min-w-0">
                <p className="truncate">
                  <span className="font-bold text-slate-400 uppercase tracking-wider mr-1">Start:</span>
                  <span className="text-slate-700 font-semibold">{formatDateTime(item.schedule?.startDateTime)}</span>
                </p>
                <p className="truncate">
                  <span className="font-bold text-slate-400 uppercase tracking-wider mr-1">End:</span>
                  <span className="text-slate-600 font-medium">{formatDateTime(item.schedule?.endDateTime)}</span>
                </p>
                <p className="pt-0.5 text-emerald-700 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  Available Slot
                </p>
              </div>
            </div>
          ))}
          {availableUpcomingSchedules.length === 0 && (
            <div className="col-span-full text-center py-10 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-semibold">No available schedules from today onward.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews — client component with its own pagination & sorting */}
      <div className="space-y-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <DoctorReviews doctorId={id} averageRating={doctor.averageRating} />
        </HydrationBoundary>
      </div>
    </div>
  );
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
      <span className="mt-0.5 text-emerald-600 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-slate-800 font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

export default ConsultationDoctorByIdPage;