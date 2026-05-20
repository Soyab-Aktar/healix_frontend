import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";

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

    //? -> user is Logged in , and has valid access token
    if (isAuth && isValidAccessToken) {
      return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole) as string, request.url));
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
    //? -> user tring to access Common Protected Routes
    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }
    //? -> user tring to delete role based protected route
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