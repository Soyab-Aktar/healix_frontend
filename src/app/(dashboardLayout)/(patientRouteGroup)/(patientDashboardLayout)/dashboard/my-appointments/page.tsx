import MyAppointmentsView from "@/components/modules/Patient/Appointments/Myappointmentsview";
import React, { Suspense } from "react";

const MyAppointmentPage = () => {
  return (
    <Suspense fallback={<p>Loading appointments...</p>}>
      <MyAppointmentsView />
    </Suspense>
  );
};

export default MyAppointmentPage;