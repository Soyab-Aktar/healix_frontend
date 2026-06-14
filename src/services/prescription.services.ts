"use server"

import { httpClient } from "@/lib/axios/httpClient"
import {
  type ICreatePrescriptionPayload,
  type IPrescription,
} from "@/types/prescription.types"

export const givePrescription = async (payload: ICreatePrescriptionPayload) => {
  try {
    return await httpClient.post<IPrescription>("/prescriptions", payload)
  } catch (error) {
    console.log("Error giving prescription:", error)
    throw error
  }
}

export const getMyPrescriptions = async () => {
  try {
    return await httpClient.get<IPrescription[]>("/prescriptions/my-prescriptions")
  } catch (error) {
    console.log("Error fetching my prescriptions:", error)
    throw error
  }
}

export const getAllPrescriptions = async (queryString?: string) => {
  try {
    const url = queryString ? `/prescriptions?${queryString}` : "/prescriptions"
    return await httpClient.get<IPrescription[]>(url)
  } catch (error) {
    console.log("Error fetching all prescriptions:", error)
    throw error
  }
}