"use server"

import { httpClient } from "@/lib/axios/httpClient"
import { type IPayment } from "@/types/payment.types"

export const getAllPayments = async (queryString?: string) => {
  try {
    const url = queryString ? `/payments?${queryString}` : "/payments"
    return await httpClient.get<IPayment[]>(url)
  } catch (error) {
    console.log("Error fetching payments:", error)
    throw error
  }
}
