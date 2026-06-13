export interface IReview {
  id: string;
  rating: number;
  comment: string;

  appointmentId: string;
  patientId: string;
  doctorId: string;

  createdAt: string;
  updatedAt: string;

  patient?: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };

  doctor?: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };

  appointment?: {
    id: string;
    scheduledDate?: string;
    createdAt?: string;
    paymentStatus?: string;
    status?: string;
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