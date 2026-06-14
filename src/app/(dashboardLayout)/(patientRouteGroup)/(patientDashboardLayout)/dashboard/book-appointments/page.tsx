import DoctorsList from "@/components/modules/Consultation/DoctorsList";
import AppointmentBookingConfirmation from "@/components/modules/Patient/Appointments/AppointmentBookingConfirmation";
import { getAllSpecialties, getDoctors, getDoctorById } from "@/services/doctor.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface BookAppointmentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BookAppointmentPage = async ({ searchParams }: BookAppointmentPageProps) => {
  const resolvedSearchParams = await searchParams;

  const doctorId = typeof resolvedSearchParams.doctorId === "string" ? resolvedSearchParams.doctorId : "";
  const scheduleId = typeof resolvedSearchParams.scheduleId === "string" ? resolvedSearchParams.scheduleId : "";

  if (doctorId && scheduleId) {
    let doctorName = "Doctor";
    let doctorDesignation = "";
    let doctorProfilePhoto = "";
    let doctorWorkingPlace = "";
    let appointmentFee = 0;
    let scheduleStart: string | Date | undefined;
    let scheduleEnd: string | Date | undefined;
    let isScheduleAvailable = false;

    try {
      const response = await getDoctorById(doctorId);
      const doctor = response.data;
      if (doctor) {
        doctorName = doctor.name;
        doctorDesignation = doctor.designation || "";
        doctorProfilePhoto = doctor.profilePhoto || "";
        doctorWorkingPlace = doctor.currentWorkingPlace || "";
        appointmentFee = doctor.appointmentFee || 0;

        const scheduleItem = doctor.doctorSchedules?.find(
          (item: any) => item.scheduleId === scheduleId || item.schedule?.id === scheduleId
        );

        if (scheduleItem) {
          isScheduleAvailable = !scheduleItem.isBooked;
          scheduleStart = scheduleItem.schedule?.startDateTime;
          scheduleEnd = scheduleItem.schedule?.endDateTime;
        }
      }
    } catch (error) {
      console.error("Error fetching doctor details for booking confirmation:", error);
    }

    return (
      <AppointmentBookingConfirmation
        doctorId={doctorId}
        scheduleId={scheduleId}
        doctorName={doctorName}
        doctorDesignation={doctorDesignation}
        doctorProfilePhoto={doctorProfilePhoto}
        doctorWorkingPlace={doctorWorkingPlace}
        appointmentFee={appointmentFee}
        scheduleStart={scheduleStart}
        scheduleEnd={scheduleEnd}
        isScheduleAvailable={isScheduleAvailable}
      />
    );
  }

  const queryString = new URLSearchParams(
    Object.entries(resolvedSearchParams)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, Array.isArray(v) ? v[0] : v!])
  ).toString();

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["doctors", queryString],
      queryFn: () => getDoctors(queryString),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 6,
    }),
    queryClient.prefetchQuery({
      queryKey: ["specialties"],
      queryFn: () => getAllSpecialties(),
      staleTime: 1000 * 60 * 60 * 6,
      gcTime: 1000 * 60 * 60 * 24,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsList />
    </HydrationBoundary>
  );
};

export default BookAppointmentPage;