import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { getNewTokenWithRefreshToken, getUserinfo } from "./services/auth.services";
import { isTokenExpiringSoon } from "./lib/tokenUtils";

async function refrshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokenWithRefreshToken(refreshToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error Refreshing token in middleware:", err);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const decodedAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

    const isValidAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

    let userRole: UserRole | null = null;

    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routerOwner = getRouteOwner(pathname);

    const unifySuperAdminandAdminRole = userRole === 'SUPER_ADMIN' ? 'ADMIN' : userRole;
    userRole = unifySuperAdminandAdminRole;
    const isAuth = isAuthRoute(pathname);

    if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken))) {
      const requestHeaders = new Headers(request.headers);
      const response = NextResponse.next({
        request: {
          headers: requestHeaders
        },

      });
      try {
        const refreshed = await refrshTokenMiddleware(refreshToken);
        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }
        return NextResponse.next({
          request: {
            headers: requestHeaders
          },
          headers: response.headers
        })
      } catch (err) {
        console.error("Error Refreshing Token :", err);
      }
      return response;
    }

    //? -> User is logged in (has access token) and trying to access auth route -> allow
    if (isAuth && isValidAccessToken) {
      return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole) as string, request.url));
    }

    //? -> User is trying to access reset password page
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");
      //* Case 1 - User has needPasswordChange true
      if (accessToken && email) {
        const userInfo = await getUserinfo();
        if (!userInfo) {
          const loginURL = new URL("/login", request.url);
          loginURL.searchParams.set("redirect", pathname);
          return NextResponse.redirect(loginURL);
        }
        if (userInfo.needPasswordChange) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole) as string, request.url));
        }
      }
      //* Case 2 - user Coming from forgot-password
      if (email) {
        return NextResponse.next();
      }
    }

    //? -> user tring to access Public Route -> allow
    if (routerOwner === null) {
      return NextResponse.next();
    }

    //? -> user does not have access token and user not logged in
    if (!accessToken || !isValidAccessToken) {
      const loginURL = new URL("/login", request.url);
      loginURL.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginURL);
    }

    //? -> Enforcing user to stay in reset password on verify email page if their needPasswordChange && isEmailVerified flags are not satisfied respectevly 
    if (accessToken) {
      const userInfo = await getUserinfo();

      if (!userInfo) {
        const loginURL = new URL("/login", request.url);
        loginURL.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginURL);
      }

      if (userInfo?.emailVerified === false) {
        if (pathname !== "/verify-email") {
          const verifyEmailUrl = new URL("/verify-email", request.url);
          verifyEmailUrl.searchParams.set("email", userInfo.email);
          return NextResponse.redirect(verifyEmailUrl);
        }
        return NextResponse.next();
      }

      if (userInfo && userInfo.emailVerified && pathname === "/verify-email") {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole) as string, request.url));
      }

      if (userInfo.needPasswordChange) {
        if (pathname !== "/reset-password") {
          const resetPasswordUrl = new URL("/reset-password", request.url);
          resetPasswordUrl.searchParams.set("email", userInfo.email);
          return NextResponse.redirect(resetPasswordUrl);
        }
        return NextResponse.next();
      }

      if (userInfo && !userInfo.needPasswordChange && pathname === "/reset-password") {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole) as string, request.url));
      }
    }

    //? -> user tring to access Common Protected Routes
    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    //? -> User trying to visit role based protected but doesn't have required role -> redirect to their default dashboard
    if (routerOwner === 'ADMIN' || routerOwner === 'DOCTOR' || routerOwner === 'PATIENT') {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole) as string, request.url));
      }
    }


    return NextResponse.next();

  } catch (err) {
    console.error("Error in Proxy Middleware : ", err);
  }

}

export const config = {
  matcher: [ /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ]
}
