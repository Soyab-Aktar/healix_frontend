"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokenWithRefreshToken(
  refreshToken: string,
  sessionToken: string, // ✅ pass it in from middleware
) {
  try {
    if (!sessionToken) {
      console.error("Failed to refresh token: missing session token cookie");
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    const {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken: newSessionToken,
    } = data;

    return {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken: newSessionToken,
    };
  } catch (err) {
    console.error("Error Refresh Token:", err);
    return null;
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
    if (
      error &&
      typeof error === "object" &&
      (("digest" in error && error.digest === "DYNAMIC_SERVER_USAGE") ||
        ("name" in error && error.name === "DynamicServerError"))
    ) {
      throw error;
    }
    console.error("Error fetching user info:", error);
    return null;
  }

}
