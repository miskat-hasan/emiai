import { NextResponse } from "next/server";
const ROLE_HOME = {
  influencer: "/dashboard/influencer",
  advertiser: "/dashboard/advertiser",
  agency: "/dashboard/agency",
  business_manager: "/dashboard/business_manager",
  guest: "/dashboard/guest/explore",
};

const DEFAULT_DASHBOARD = "/dashboard/influencer";

const ROLE_PREFIX = {
  influencer: "/dashboard/influencer",
  advertiser: "/dashboard/advertiser",
  agency: "/dashboard/agency",
  business_manager: "/dashboard/business_manager",
  guest: "/dashboard/guest",
};

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/registration");

  const isDashboardRoot = pathname === "/dashboard";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isDashboardRoot && token) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[role] ?? DEFAULT_DASHBOARD, request.url)
    );
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[role] ?? DEFAULT_DASHBOARD, request.url)
    );
  }

  if (isDashboardRoute && token) {
    const allowedPrefix = ROLE_PREFIX[role];

    if (allowedPrefix && !pathname.startsWith(allowedPrefix)) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/registration/:path*",
  ],
};