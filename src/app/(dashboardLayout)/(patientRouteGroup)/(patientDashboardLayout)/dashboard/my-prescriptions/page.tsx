
import { getMyPrescriptions } from "@/services/prescription.services";
import PatientPrescriptionsClient from "@/components/modules/Patient/Prescription/PatientPrescriptionsClient";
import { PrescriptionRow } from "@/types/prescription.types";

// ── Page ───────────────────────────────────────────────────────────────────

const MyPrescriptionsPage = async () => {
  const response = await getMyPrescriptions();
  const prescriptions = (response?.data ?? []) as PrescriptionRow[];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Prescriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all prescriptions issued by yours doctors.
        </p>
      </div>
      <PatientPrescriptionsClient
        prescriptions={prescriptions}
      />
    </div>
  );
};

export default MyPrescriptionsPage;