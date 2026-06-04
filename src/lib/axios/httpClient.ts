import { ApiResponse } from "@/types/api.types";
import axios from "axios";
import { isTokenExpiringSoon } from "../tokenUtils";
import { cookies, headers } from "next/headers";
import { getNewTokenWithRefreshToken } from "@/services/auth.services";
import { setTokenInCookies } from "../tokenUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

async function tryRefreshToken(
  accessToken: string,
  refreshToken: string,
  sessionToken?: string,
): Promise<string | null> {
  if (!(await isTokenExpiringSoon(accessToken)) || !sessionToken) {
    return null;
  }

  const requestHeaders = await headers();
  if (requestHeaders.get("x-token-refreshed") === "1") {
    return null; // avoid multiple refresh attempts in the same request lifecycle
  }

  try {
    const tokens = await getNewTokenWithRefreshToken(refreshToken, sessionToken);

    if (!tokens) {
      return null;
    }

    await setTokenInCookies("accessToken", tokens.accessToken);
    await setTokenInCookies("refreshToken", tokens.refreshToken, 7 * 24 * 60 * 60);
    await setTokenInCookies("better-auth.session_token", tokens.sessionToken);

    return tokens.accessToken;
  } catch (err) {
    console.error("Refresh Token Error: ", err);
    return null;
  }
}

const axiosInstance = async () => {
  const initialCookieStore = await cookies();
  const accessToken = initialCookieStore.get("accessToken")?.value;
  const refreshToken = initialCookieStore.get("refreshToken")?.value;
  const sessionToken = initialCookieStore.get("better-auth.session_token")?.value;

  if (accessToken && refreshToken && sessionToken) {
    await tryRefreshToken(accessToken, refreshToken, sessionToken);
  }

  const cookieStore = await cookies();
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
