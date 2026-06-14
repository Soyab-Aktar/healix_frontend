"use server"

import { httpClient } from "@/lib/axios/httpClient"
import { type IAdmin } from "@/types/admin.types"

export const getAllAdmins = async () => {
  try {
    const response = await httpClient.get<IAdmin[]>("/admins")
    return response
  } catch (error) {
    console.log("Error fetching admins:", error)
    throw error
  }
}

export const createAdmin = async (payload: any) => {
  try {
    const response = await httpClient.post<IAdmin>("/users/create-Admin", payload)
    return response
  } catch (error) {
    console.log("Error creating admin:", error)
    throw error
  }
}

export const deleteAdmin = async (id: string) => {
  try {
    const response = await httpClient.delete<any>(`/admins/${id}`)
    return response
  } catch (error) {
    console.log("Error deleting admin:", error)
    throw error
  }
}

export const changeAdminStatus = async (userId: string, userStatus: string) => {
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
