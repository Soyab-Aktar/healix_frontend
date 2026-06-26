// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import {
  getNewTokenWithRefreshToken,
  getUserinfo,
} from "./services/auth.services";
import {
  getTokenSecondsRemaining,
  isTokenExpiringSoon,
} from "./lib/tokenUtils";
import { setResponseCookie } from "./lib/cookieUtils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function refreshTokenMiddleware(
  refreshToken: string,
  sessionToken: string
) {
  try {
    return await getNewTokenWithRefreshToken(refreshToken, sessionToken);
  } catch (err) {
    console.error("Error refreshing token in middleware:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main middleware
// ---------------------------------------------------------------------------

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ?? "";

    // ── Decode & validate access token ──────────────────────────────────────
    const verifyResult = accessToken
      ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
      : null;

    const isValidAccessToken = verifyResult?.success === true;
    const decodedAccessToken = verifyResult?.data ?? null;

    let userRole: UserRole | null = decodedAccessToken
      ? (decodedAccessToken.role as UserRole)
      : null;

    // Unify SUPER_ADMIN → ADMIN for routing
    if (userRole === "SUPER_ADMIN") userRole = "ADMIN";

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname); // only /login, /register, /forgot-password

    // ── 1. Proactive token refresh ───────────────────────────────────────────
    if (
      isValidAccessToken &&
      accessToken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken))
    ) {
      const response = NextResponse.next();
      try {
        const tokens = await refreshTokenMiddleware(refreshToken, sessionToken);
        if (tokens) {
          const accessMaxAge = await getTokenSecondsRemaining(tokens.accessToken);
          await setResponseCookie(response, "accessToken", tokens.accessToken, accessMaxAge);
          await setResponseCookie(response, "refreshToken", tokens.refreshToken, 7 * 24 * 60 * 60);
          await setResponseCookie(response, "better-auth.session_token", tokens.sessionToken, 24 * 60 * 60);
          response.headers.set("x-token-refreshed", "1");
        }
      } catch (err) {
        console.error("Token refresh error:", err);
      }
      return response;
    }

    // ── 2. /verify-email — always publicly accessible ────────────────────────
    // After registration we do NOT set cookies, so this page must be reachable
    // without an access token. If the user IS logged in and already verified,
    // send them to their dashboard. Otherwise let them through.
    if (pathname === "/verify-email") {
      if (isValidAccessToken && accessToken) {
        const userInfo = await getUserinfo();
        if (userInfo?.emailVerified) {
          // Already verified — no need to be here
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole) as string,
              request.url
            )
          );
        }
      }
      // Not logged in OR logged in but unverified → let through
      return NextResponse.next();
    }

    // ── 3. /reset-password ───────────────────────────────────────────────────
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");
      if (accessToken && isValidAccessToken && email) {
        const userInfo = await getUserinfo();
        if (!userInfo) {
          return NextResponse.redirect(new URL("/login", request.url));
        }
        if (userInfo.needPasswordChange) return NextResponse.next();
        return NextResponse.redirect(
          new URL(
            getDefaultDashboardRoute(userRole as UserRole) as string,
            request.url
          )
        );
      }
      // Coming from forgot-password flow (no token needed, just email param)
      if (email) return NextResponse.next();
      // No email → nothing to do here
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ── 4. Logged-in user hitting a guest-only auth route ───────────────────
    // /login, /register, /forgot-password
    if (isAuth && isValidAccessToken) {
      // Extra guard: only redirect if their email is verified.
      // If not verified, let the page render (e.g., rare edge case where
      // someone lands on /login with unverified cookies — they can still log in).
      if (accessToken) {
        const userInfo = await getUserinfo();
        if (userInfo?.emailVerified) {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole) as string,
              request.url
            )
          );
        }
      }
      // Unverified logged-in user on /login or /register → let through
      return NextResponse.next();
    }

    // ── 5. Public (unprotected) routes ───────────────────────────────────────
    if (routeOwner === null) {
      // For logged-in users on public routes, enforce forced states
      if (accessToken && isValidAccessToken) {
        const userInfo = await getUserinfo();
        if (userInfo) {
          if (!userInfo.emailVerified) {
            const url = new URL("/verify-email", request.url);
            url.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(url);
          }
          // Allow user to enter site even if they need password change
        }
      }
      return NextResponse.next();
    }

    // ── 6. Protected route — user not authenticated ──────────────────────────
    if (!accessToken || !isValidAccessToken) {
      const loginURL = new URL("/login", request.url);
      loginURL.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginURL);
    }

    // ── 7. Protected route — authenticated, check forced states ─────────────
    const userInfo = await getUserinfo();

    if (!userInfo) {
      const loginURL = new URL("/login", request.url);
      loginURL.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginURL);
    }

    if (!userInfo.emailVerified) {
      const url = new URL("/verify-email", request.url);
      url.searchParams.set("email", userInfo.email);
      return NextResponse.redirect(url);
    }

    // Allow user to enter site even if they need password change

    // ── 8. Common protected routes ───────────────────────────────────────────
    if (routeOwner === "COMMON") return NextResponse.next();

    // ── 9. Role-based protected routes ──────────────────────────────────────
    if (
      routeOwner === "ADMIN" ||
      routeOwner === "DOCTOR" ||
      routeOwner === "PATIENT"
    ) {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(
            getDefaultDashboardRoute(userRole as UserRole) as string,
            request.url
          )
        );
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Error in Proxy Middleware:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};