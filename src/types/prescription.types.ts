export interface ICreatePrescriptionPayload {
  appointmentId: string
  followUpDate?: string
  instructions: string
}

export interface PrescriptionUpdatePayload {
  instructions?: string;
  followUpDate?: string;
}

export interface IPrescription {
  id: string
  appointmentId: string
  doctorId: string
  patientId: string
  instructions: string
  followUpDate?: string | Date
  pdfUrl?: string | null
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface PrescriptionTableCallbacks {
  onView: (row: PrescriptionRow) => void;
  onEdit?: (row: PrescriptionRow) => void;   // optional — patients can't edit
  onDelete?: (row: PrescriptionRow) => void; // optional — patients can't delete
}

export type PrescriptionRow = IPrescription & {
  patient?: { name: string; email: string };
  doctor?: { name: string; email: string };
  appointment?: { id: string };
};