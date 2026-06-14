import React from 'react';
import { getUserinfo } from "@/services/auth.services";
import PatientHealthRecords from "@/components/modules/Dashboard/PatientHealthRecords";

const HealthRecordsPage = async () => {
  const user = await getUserinfo();

  return (
    <div className="container mx-auto py-6">
      <PatientHealthRecords patientData={user?.patient} />
    </div>
  );
};

export default HealthRecordsPage;