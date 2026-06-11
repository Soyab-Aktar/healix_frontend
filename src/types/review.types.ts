export interface IReview {
  id: string;
  rating: number;
  comment: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  patient?: {
    id: string;
    name: string;
    email?: string;
    profilePhoto?: string;
  };
}

export interface ICreateReviewPayload {
  appointmentId: string;
  rating: number;
  comment: string;
}

export interface IUpdateReviewPayload {
  rating: number;
  comment: string;
}