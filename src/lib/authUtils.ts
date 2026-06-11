// src/lib/authUtils.ts

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

// Auth routes = pages only guests should see. 
// /verify-email and /reset-password are POST-auth flows — logged-in users need them too.
export const authRoutes = ["/login", "/register", "/forgot-password"];

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

export const superAdminProtectedRoutes: RouteConfig = {
  pattern: [/^\/superAdmin\/dashboard/],
  exact: [],
};
export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/],
  exact: [],
};
export const doctorProtectedRoutes: RouteConfig = {
  pattern: [/^\/doctor\/dashboard/],
  exact: [],
};
export const commonProtectedRoutes: RouteConfig = {
  pattern: [],
  exact: ["/my-profile", "/change-password"],
};
export const patientProtectedRoutes: RouteConfig = {
  // ✅ Fix: added "/dashboard" exact so the root /dashboard is also protected
  pattern: [/^\/dashboard(\/.*)?$/],
  exact: ["/payment/success"],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string
): "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
  if (isRouteMatches(pathname, superAdminProtectedRoutes)) return "SUPER_ADMIN";
  if (isRouteMatches(pathname, adminProtectedRoutes)) return "ADMIN";
  if (isRouteMatches(pathname, doctorProtectedRoutes)) return "DOCTOR";
  if (isRouteMatches(pathname, patientProtectedRoutes)) return "PATIENT";
  if (isRouteMatches(pathname, commonProtectedRoutes)) return "COMMON";
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/dashboard";
  if (role === "DOCTOR") return "/doctor/dashboard";
  if (role === "PATIENT") return "/dashboard";
  return "/";
};

export const isValidRedirectRole = (redirectPath: string, role: UserRole) => {
  const unifySuperAdminandAdminRole =
    role === "SUPER_ADMIN" ? "ADMIN" : role;
  role = unifySuperAdminandAdminRole;
  const routeOwner = getRouteOwner(redirectPath);
  if (routeOwner === null || routeOwner === "COMMON") return true;
  if (routeOwner === role) return true;
  return false;
};