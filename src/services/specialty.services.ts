"use server"

import { httpClient } from "@/lib/axios/httpClient"
import { type ISpecialty } from "@/types/specialty.types"

export const getAllSpecialties = async () => {
  try {
    const response = await httpClient.get<ISpecialty[]>("/specialties")
    return response
  } catch (error) {
    console.log("Error fetching specialties:", error)
    throw error
  }
}

export const createSpecialty = async (formData: FormData) => {
  try {
    const response = await httpClient.post<ISpecialty>("/specialties", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response
  } catch (error) {
    console.log("Error creating specialty:", error)
    throw error
  }
}

export const updateSpecialty = async (id: string, payload: any) => {
  try {
    const response = await httpClient.patch<ISpecialty>(`/specialties/${id}`, payload)
    return response
  } catch (error) {
    console.log("Error updating specialty:", error)
    throw error
  }
}

export const deleteSpecialty = async (id: string) => {
  try {
    const response = await httpClient.delete<ISpecialty>(`/specialties/${id}`)
    return response
  } catch (error) {
    console.log("Error deleting specialty:", error)
    throw error
  }
}
