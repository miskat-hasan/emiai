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
    pathname.startsWith("/login") || pathname.startsWith("/registration");

  const isDashboardRoot = pathname === "/dashboard";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Check if it's the dynamic invite page: /dashboard/invite/<anything>
  const isInviteRoute = /^\/dashboard\/invite\/[^/]+$/.test(pathname);

  // 1. If trying to see the invite page, allow anyone to view it without checking roles
  if (isInviteRoute) {
    return NextResponse.next();
  }

  // 2. Protect all other dashboard routes from unauthenticated users
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Handle root dashboard redirects
  if (isDashboardRoot && token) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[role] ?? DEFAULT_DASHBOARD, request.url),
    );
  }

  // 4. Prevent logged-in users from hitting login/registration
  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[role] ?? DEFAULT_DASHBOARD, request.url),
    );
  }

  // 5. Restrict roles to their respective folder paths
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
