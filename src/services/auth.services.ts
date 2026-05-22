"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokenWithRefreshToken(refreshToken: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!sessionToken) {
      console.error("Failed to refresh token: missing session token cookie");
      return false;
    }

    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
      }
    });
    if (!res.ok) {
      return false;
    }
    const { data } = await res.json();
    const { accessToken, refreshToken: newRefreshToken, sessionToken: newSessionToken } = data;
    if (accessToken) {
      await setTokenInCookies("accessToken", accessToken);
    }
    if (newRefreshToken) {
      await setTokenInCookies("refreshToken", newRefreshToken);
    }
    if (newSessionToken) {
      await setTokenInCookies("better-auth.session_token", newSessionToken, 24 * 60 * 60);
    }
    return true;
  } catch (err) {
    console.error("Error Refresh Token :", err);
    return false;
  }
}

export async function getUserinfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken || !sessionToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
      }
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }

}
