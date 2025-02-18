import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("token");

  // If user is NOT logged in and NOT on /login, redirect to /login
  if (!authToken && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: ["/student/simulation/:path*","/student/assessment/:path*", "/student/assignment-score/:path*",  "/student/teaching", "/"],
  
};
