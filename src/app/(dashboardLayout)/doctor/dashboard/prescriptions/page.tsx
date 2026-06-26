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
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-1 bg-gradient-to-b from-[#0d9488] to-[#047857] rounded-full shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0d9488] to-[#047857] bg-clip-text text-transparent">My Prescriptions</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            View and manage all prescriptions you have issued to your patients.
          </p>
        </div>
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