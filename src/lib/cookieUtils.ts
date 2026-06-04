"use server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export const setCookie = async (
  name: string,
  value: string,
  maxAgeInSeconds: number,
) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeInSeconds,
  });

}

export const setResponseCookie = async (
  response: NextResponse,
  name: string,
  value: string,
  maxAgeInSeconds: number,
) => {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeInSeconds,
  });
}

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.delete(name);
}