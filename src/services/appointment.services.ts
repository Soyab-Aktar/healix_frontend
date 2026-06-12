"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  IBookAppointmentPayload,
  IBookAppointmentResponse,
  IBookAppointmentPayLaterResponse,
} from "@/types/appointment.types";

export const bookAppointment = async (payload: IBookAppointmentPayload) => {
  try {
    const response = await httpClient.post<IBookAppointmentResponse>(
      "/appointments/book-appointment",
      payload,
    );
    return response;
  } catch (error) {
    console.log("Error booking appointment:", error);
    throw error;
  }
};

export const bookAppointmentWithPayLater = async (payload: IBookAppointmentPayload) => {
  try {
    const response = await httpClient.post<IBookAppointmentPayLaterResponse>(
      "/appointments/book-appointment-with-pay-later",
      payload,
    );
    return response;
  } catch (error) {
    console.log("Error booking appointment (pay later):", error);
    throw error;
  }
};