"use server";

import { deleteCookie } from "@/lib/cookieUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";

export const logoutAction = async () => {
  try {
    await httpClient.post("/auth/logout", {});
  } catch {
    // best-effort — clear cookies regardless
  }

  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");
  await deleteCookie("better-auth.session_token");

  redirect("/login");
};