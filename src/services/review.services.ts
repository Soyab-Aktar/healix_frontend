"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IReview } from "@/types/review.types";

export const getReviewsByDoctorId = async (doctorId: string, queryString?: string) => {
  try {
    const base = `/reviews?doctorId=${doctorId}`;
    const url = queryString ? `${base}&${queryString}` : base;
    const reviews = await httpClient.get<IReview[]>(url);
    return reviews;
  } catch (error) {
    console.log("Error fetching reviews:", error);
    throw error;
  }
};

export const getAllReviews = async (queryString?: string) => {
  try {
    const url = queryString ? `/reviews?${queryString}` : "/reviews";
    const reviews = await httpClient.get<IReview[]>(url);
    return reviews;
  } catch (error) {
    console.log("Error fetching all reviews:", error);
    throw error;
  }
};