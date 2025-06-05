import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from localStorage (this will be handled by the client)
  const isLoginPage = request.nextUrl.pathname === "/login";

  // If trying to access protected routes without authentication
  if (!isLoginPage) {
    // We'll handle the redirect in the client side
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
