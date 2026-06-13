import DoctorAppointmentsView from "@/components/modules/Doctor/Appointments/DoctorAppointmentsView";
import React, { Suspense } from "react";


const DoctorAppointmentPage = () => {
  return (
    <Suspense fallback={<p>Loading appointments...</p>}>
      <DoctorAppointmentsView />
    </Suspense>
  );
};

export default DoctorAppointmentPage;