import { NextResponse } from "next/server";

const ROLE_HOME = {
  influencer: "/dashboard/influencer",
  advertiser: "/dashboard/advertiser",
  agency: "/dashboard/marketing-agency",
  business_manager: "/dashboard/business-manager",
  guest: "/dashboard/guest/explore",
};

const DEFAULT_DASHBOARD = "/dashboard/influencer";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/registration");
  const isDashboardRoot = pathname === "/dashboard";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isDashboardRoot && token) {
    const home = ROLE_HOME[role] ?? DEFAULT_DASHBOARD;
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isAuthRoute && token) {
    const home = ROLE_HOME[role] ?? DEFAULT_DASHBOARD;
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/login",
    "/registration/:path*",
  ],
};
