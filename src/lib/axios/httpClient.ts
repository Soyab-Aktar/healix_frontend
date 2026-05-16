import { ApiResponse } from "@/types/api.types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

const axiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    }
  })

  return instance;
}

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <TData>(endPoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endPoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (err) {
    console.error(`Get Request to ${endPoint} failed: `, err);
    throw err;
  }
}
const httpPost = async <TData>(endPoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().post<ApiResponse<TData>>(endPoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (err) {
    console.error(`Post Request to ${endPoint} failed: `, err);
    throw err;
  }
}
const httpPatch = async <TData>(endPoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().patch<ApiResponse<TData>>(endPoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (err) {
    console.error(`Patch Request to ${endPoint} failed: `, err);
    throw err;
  }
}
const httpPut = async <TData>(endPoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().put<ApiResponse<TData>>(endPoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (err) {
    console.error(`Put Request to ${endPoint} failed: `, err);
    throw err;
  }
}
const httpDelete = async <TData>(endPoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().delete<ApiResponse<TData>>(endPoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (err) {
    console.error(`Delete Request to ${endPoint} failed: `, err);
    throw err;
  }
}
export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
}