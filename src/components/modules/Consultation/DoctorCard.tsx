import Link from "next/link";
import Image from "next/image";
import { IDoctor } from "@/types/doctor.types";
import { Star, MapPin, Briefcase, IndianRupee } from "lucide-react";

interface DoctorCardProps {
  doctor: IDoctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const specialties = doctor.specialties
    ?.slice(0, 2)
    .map((s) => s.specialty?.title)
    .filter(Boolean);

  return (
    <Link href={`/consultation/doctor/${doctor.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group h-full flex flex-col">
        {/* Top: Avatar + Name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-blue-50 shrink-0">
            {doctor.profilePhoto ? (
              <Image
                src={doctor.profilePhoto}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-600 font-semibold text-xl">
                {doctor.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{doctor.designation}</p>
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-gray-700">
                {doctor.averageRating?.toFixed(1) ?? "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {specialties.map((title) => (
              <span
                key={title}
                className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
              >
                {title}
              </span>
            ))}
            {(doctor.specialties?.length ?? 0) > 2 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                +{doctor.specialties!.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Info rows */}
        <div className="space-y-1.5 mt-auto">
          {doctor.currentWorkingPlace && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{doctor.currentWorkingPlace}</span>
            </div>
          )}
          {doctor.experience !== undefined && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{doctor.experience} yr{doctor.experience !== 1 ? "s" : ""} experience</span>
            </div>
          )}
        </div>

        {/* Footer: fee + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-0.5 text-gray-900 font-semibold text-sm">
            <IndianRupee className="h-4 w-4" />
            <span>{doctor.appointmentFee}</span>
            <span className="text-xs text-gray-400 font-normal ml-1">/ session</span>
          </div>
          <span className="text-xs font-medium text-blue-600 group-hover:underline">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}