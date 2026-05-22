import { ApiResponse } from "@/types/api.types";
import axios from "axios";
import { isTokenExpiringSoon } from "../tokenUtils";
import { cookies, headers } from "next/headers";
import { getNewTokenWithRefreshToken } from "@/services/auth.services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

async function tryRefreshToken(accessToken: string, refreshToken: string): Promise<void> {
  if (!isTokenExpiringSoon(accessToken)) {
    return;
  }
  const requestHeaders = await headers();
  if (requestHeaders.get("x-token-refreshed") === "1") {
    return; // this is for to avoid multiple refresh attempts in the same request lifecycle
  }
  try {
    await getNewTokenWithRefreshToken(refreshToken);
  } catch (err) {
    console.error("Refresh Token Error: ", err);
    return;
  }
}

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken && refreshToken) {
    await tryRefreshToken(accessToken, refreshToken);
  }
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
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
    const instance = await axiosInstance();
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
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endPoint, data, {
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
    const instance = await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(endPoint, data, {
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
    const instance = await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(endPoint, data, {
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
    const instance = await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(endPoint, {
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