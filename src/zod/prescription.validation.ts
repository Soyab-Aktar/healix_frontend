import { z } from "zod"

export const createPrescriptionFormZodSchema = z.object({
  appointmentId: z.string().min(1, "Appointment id is required"),
  instructions: z.string().min(1, "Instructions are required"),
  followUpDate: z.string().optional(),
})

export type ICreatePrescriptionFormValues = z.infer<typeof createPrescriptionFormZodSchema>