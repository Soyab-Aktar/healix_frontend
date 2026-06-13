"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  ICreateReviewPayload,
  IReview,
  IUpdateReviewPayload,
} from "@/types/review.types";

export const getReviewsByDoctorId = async (
  doctorId: string,
  queryString?: string
) => {
  try {
    const base = `/reviews?doctorId=${doctorId}`;
    const url = queryString ? `${base}&${queryString}` : base;

    return await httpClient.get<IReview[]>(url);
  } catch (error) {
    console.log("Error fetching reviews:", error);
    throw error;
  }
};

export const getAllReviews = async (queryString?: string) => {
  try {
    const url = queryString ? `/reviews?${queryString}` : "/reviews";

    return await httpClient.get<IReview[]>(url);
  } catch (error) {
    console.log("Error fetching all reviews:", error);
    throw error;
  }
};

export const getMyReviews = async () => {
  try {
    return await httpClient.get<IReview[]>("/reviews/my-reviews");
  } catch (error) {
    console.log("Error fetching my reviews:", error);
    throw error;
  }
};

export const createReview = async (
  payload: ICreateReviewPayload
) => {
  try {
    return await httpClient.post<IReview>("/reviews", payload);
  } catch (error) {
    console.log("Error creating review:", error);
    throw error;
  }
};

export const updateReview = async (
  reviewId: string,
  payload: IUpdateReviewPayload
) => {
  try {
    return await httpClient.patch<IReview>(
      `/reviews/${reviewId}`,
      payload
    );
  } catch (error) {
    console.log("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    return await httpClient.delete<IReview>(`/reviews/${reviewId}`);
  } catch (error) {
    console.log("Error deleting review:", error);
    throw error;
  }
};