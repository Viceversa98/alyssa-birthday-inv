import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest, SESSION_COOKIE } from "@/lib/auth";

export const middleware = (request: NextRequest) => {
  const isAuthed = isAuthenticatedRequest(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !isAuthed) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && isAuthed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/admin/:path*"],
};
