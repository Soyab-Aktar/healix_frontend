"use server"

import { httpClient } from "@/lib/axios/httpClient"
import { type IPatient } from "@/types/patient.types"

export const getAllPatients = async (queryString?: string) => {
  try {
    const url = queryString ? `/patients?${queryString}` : "/patients"
    const response = await httpClient.get<IPatient[]>(url)
    return response
  } catch (error) {
    console.log("Error fetching patients:", error)
    throw error
  }
}

export const deletePatient = async (id: string) => {
  try {
    const response = await httpClient.delete<{ message: string }>(`/patients/${id}`)
    return response
  } catch (error) {
    console.log("Error deleting patient:", error)
    throw error
  }
}

export const changeUserStatus = async (userId: string, userStatus: string) => {
  try {
    const response = await httpClient.patch<any>("/admins/change-user-status", {
      userId,
      userStatus,
    })
    return response
  } catch (error) {
    console.log("Error changing user status:", error)
    throw error
  }
}
