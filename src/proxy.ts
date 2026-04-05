import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminSessionValid } from "@/lib/adminAuth";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && path !== "/admin/login") {
    if (!isAdminSessionValid(request)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (path === "/admin/login") {
    if (isAdminSessionValid(request)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
