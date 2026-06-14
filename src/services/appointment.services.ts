"use server"

import { httpClient } from "@/lib/axios/httpClient"
import {
  type IAppointment,
  type IBookAppointmentPayload,
  type IBookAppointmentResult,
  type IInitiatePaymentResult,
} from "@/types/appointment.types"

export const bookAppointment = async (payload: IBookAppointmentPayload) => {
  try {
    return await httpClient.post<IBookAppointmentResult>("/appointments/book-appointment", payload)
  } catch (error) {
    console.log("Error booking appointment:", error)
    throw error
  }
}

export const bookAppointmentWithPayLater = async (payload: IBookAppointmentPayload) => {
  try {
    return await httpClient.post<IBookAppointmentResult>(
      "/appointments/book-appointment-with-pay-later",
      payload,
    )
  } catch (error) {
    console.log("Error booking appointment with pay later:", error)
    throw error
  }
}

export const initiateAppointmentPayment = async (appointmentId: string) => {
  try {
    return await httpClient.post<IInitiatePaymentResult>(
      `/appointments/initiate-payment/${appointmentId}`,
      {},
    )
  } catch (error) {
    console.log("Error initiating appointment payment:", error)
    throw error
  }
}

export const getMyAppointments = async () => {
  try {
    return await httpClient.get<IAppointment[]>("/appointments/my-appointments")
  } catch (error) {
    console.log("Error fetching my appointments:", error)
    throw error
  }
}

export const getMySingleAppointment = async (appointmentId: string) => {
  try {
    return await httpClient.get<IAppointment>(`/appointments/my-single-appointment/${appointmentId}`)
  } catch (error) {
    console.log("Error fetching appointment details:", error)
    throw error
  }
}
export const getAllAppointments = async (appointmentId: string) => {
  try {
    return await httpClient.get<IAppointment>(`/appointments`)
  } catch (error) {
    console.log("Error fetching appointment details:", error)
    throw error
  }
}

export const changeAppointmentStatus = async (appointmentId: string, status: string) => {
  try {
    return await httpClient.patch<IAppointment>(
      `/appointments/change-appointment-status/${appointmentId}`,
      { status },
    )
  } catch (error) {
    console.log("Error changing appointment status:", error)
    throw error
  }
}