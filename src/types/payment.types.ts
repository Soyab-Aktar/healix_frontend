import { IAppointment } from "./appointment.types"

export type PaymentStatus = "PAID" | "UNPAID" | "FAILED" | string

export interface IPayment {
  id: string
  amount: number
  transactionId: string
  stripeEventId?: string | null
  status: PaymentStatus
  invoiceUrl?: string | null
  paymentGatewayData?: any
  createdAt: string | Date
  updatedAt: string | Date
  appointmentId: string
  appointment?: IAppointment | null
}
