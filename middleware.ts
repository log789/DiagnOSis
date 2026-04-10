import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types/user";

const roleRoutes: Record<UserRole, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  hospital: "/hospital/dashboard"
};

function getRouteRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/patient")) return "patient";
  if (pathname.startsWith("/doctor")) return "doctor";
  if (pathname.startsWith("/hospital")) return "hospital";
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const targetRole = getRouteRole(pathname);

  if (!targetRole) {
    return NextResponse.next();
  }

  const cookieRole = request.cookies.get("diagnosis-role")?.value as UserRole | undefined;

  if (!cookieRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (cookieRole !== targetRole) {
    return NextResponse.redirect(new URL(roleRoutes[cookieRole], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/hospital/:path*"]
};
