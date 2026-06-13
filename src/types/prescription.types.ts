export interface ICreatePrescriptionPayload {
  appointmentId: string
  followUpDate?: string
  instructions: string
}

export interface IUpdatePrescriptionPayload {
  followUpDate?: string
  instructions?: string
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