export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export interface IBookAppointmentPayload {
  doctorId: string;
  scheduleId: string;
}

export interface IAppointmentSchedule {
  id?: string;
  startDateTime?: string | Date;
  endDateTime?: string | Date;
}

export interface IAppointmentPayment {
  id: string;
  appointmentId: string;
  amount: number;
  transactionId: string;
  status?: PaymentStatus;
  invoiceUrl?: string | null;
}

export interface IAppointment {
  id: string;
  doctorId: string;
  patientId: string;
  scheduleId: string;
  videoCallingId?: string;
  status?: AppointmentStatus;
  paymentStatus?: PaymentStatus;
  createdAt?: string | Date;
  schedule?: IAppointmentSchedule;
}

export interface IBookAppointmentResponse {
  appointment: IAppointment;
  payment: IAppointmentPayment;
  paymentUrl?: string | null;
}

export interface IBookAppointmentPayLaterResponse {
  appointmentData: IAppointment;
  paymentData: IAppointmentPayment;
}