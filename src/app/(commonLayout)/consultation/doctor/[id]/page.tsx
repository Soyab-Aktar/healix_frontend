import { getDoctorById } from '@/services/doctor.services';
import { IDoctorDetails } from '@/types/doctor.types';
import { getReviewsByDoctorId } from '@/services/review.services';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import DoctorReviews from '@/components/modules/Consultation/DoctorReviews';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Award,
  IndianRupee,
  ChevronLeft,
  Calendar,
  User,
} from 'lucide-react';

interface ConsultationDoctorByIdPageProps {
  params: Promise<{ id: string }>;
}

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

  const specialties = doctor.specialties?.map((s) => {
    if ('specialty' in s) return s.specialty;
    return s;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/consultation"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to all doctors
      </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        {/* Top gradient band */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-700" />

        <div className="px-6 pb-6">
          {/* Avatar + name row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-blue-50 shadow-md shrink-0">
              {doctor.profilePhoto ? (
                <Image
                  src={doctor.profilePhoto}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-600">
                  <User className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="flex-1 pt-2">
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-gray-500">{doctor.designation}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-gray-800">
                  {doctor.averageRating?.toFixed(1) ?? 'N/A'}
                </span>
                <span className="text-sm text-gray-400 ml-0.5">avg rating</span>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shrink-0">
              <Calendar className="h-4 w-4" />
              Book Appointment
            </button>
          </div>

          {/* Fee */}
          <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-semibold text-sm px-3 py-1.5 rounded-full mb-5">
            <IndianRupee className="h-4 w-4" />
            {doctor.appointmentFee} per consultation
          </div>

          {/* Specialties */}
          {specialties && specialties.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Specialties
              </h2>
              <div className="flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <span
                    key={s?.id}
                    className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"
                  >
                    {s?.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctor.qualification && (
              <InfoRow icon={<Award className="h-4 w-4" />} label="Qualification" value={doctor.qualification} />
            )}
            {doctor.currentWorkingPlace && (
              <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Works at" value={doctor.currentWorkingPlace} />
            )}
            {doctor.experience !== undefined && (
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Experience"
                value={`${doctor.experience} year${doctor.experience !== 1 ? 's' : ''}`}
              />
            )}
            {doctor.contactNumber && (
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Contact" value={doctor.contactNumber} />
            )}
            {doctor.email && (
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={doctor.email} />
            )}
            {doctor.address && (
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={doctor.address} />
            )}
          </div>
        </div>
      </div>

      {/* Reviews — client component with its own pagination & sorting */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DoctorReviews doctorId={id} averageRating={doctor.averageRating} />
      </HydrationBoundary>
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
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-blue-500 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}

export default ConsultationDoctorByIdPage;