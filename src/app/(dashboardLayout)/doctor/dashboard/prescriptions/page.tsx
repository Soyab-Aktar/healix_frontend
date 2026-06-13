import { getMyPrescriptions } from "@/services/prescription.services";
import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import { IPrescription, PrescriptionRow, PrescriptionUpdatePayload } from "@/types/prescription.types";
import DoctorPrescriptionsClient from "@/components/modules/Doctor/Prescriptions/Doctorprescriptionsclient";


// ── Server Actions ─────────────────────────────────────────────────────────

async function updatePrescription(id: string, payload: PrescriptionUpdatePayload) {
  "use server";
  await httpClient.patch<IPrescription>(`/prescriptions/${id}`, payload);
  revalidatePath("/doctor/dashboard/prescriptions");
}

async function deletePrescription(id: string) {
  "use server";
  await httpClient.delete(`/prescriptions/${id}`);
  revalidatePath("/doctor/dashboard/prescriptions");
}

// ── Page ───────────────────────────────────────────────────────────────────

const DoctorPrescriptionsPage = async () => {
  const response = await getMyPrescriptions();
  const prescriptions = (response?.data ?? []) as PrescriptionRow[];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Prescriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all prescriptions you have issued to your patients.
        </p>
      </div>

      <DoctorPrescriptionsClient
        prescriptions={prescriptions}
        onUpdate={updatePrescription}
        onDelete={deletePrescription}
      />
    </div>
  );
};

export default DoctorPrescriptionsPage;