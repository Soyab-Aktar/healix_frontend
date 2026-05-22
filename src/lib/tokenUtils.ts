"use server"
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";


const getTokenSecondsRemaining = (token: string): number => {
  if (!token) return 0;

  try {
    const tokenPayload = jwt.decode(token) as JwtPayload;

    if (tokenPayload && !tokenPayload.exp) {
      return 0;
    }
    const remainingSeconds = tokenPayload.exp as number - Math.floor(Date.now() / 1000);

    return remainingSeconds > 0 ? remainingSeconds : 0;
  } catch (err) {
    console.error("Error Decoding Token: ", err);
    return 0;
  }
}

export const setTokenInCookies = async (
  name: string,
  token: string,
  fallbackMaxAgeInSeconds = 24 * 60 * 60,
) => {
  let maxAgeInSeconds;
  if (name !== "better-auth.session_token") {
    maxAgeInSeconds = getTokenSecondsRemaining(token);
  }
  await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
}

export async function isTokenExpiringSoon(token: string, thresholdInSeconds = 300): Promise<boolean> {
  const remainingSeconds = getTokenSecondsRemaining(token);
  return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}
export async function isTokenExpired(token: string): Promise<boolean> {
  const remainingSeconds = getTokenSecondsRemaining(token);
  return remainingSeconds === 0;
} 