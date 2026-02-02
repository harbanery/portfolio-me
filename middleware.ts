import { ACCESS_ADMIN } from "@/lib/config/variables";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require authentication
const publicPaths = ["/admin/auth", "/admin/auth/login", "/admin/auth/api"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!ACCESS_ADMIN) {
    return NextResponse.next();
  }

  // Check if the path is in the admin section
  if (pathname.startsWith("/admin")) {
    // Check if the path is public (auth pages)
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Get session cookie
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie) {
      // No session found
      if (!isPublicPath) {
        // Redirect to login if trying to access protected route
        const loginUrl = new URL("/admin/auth", request.url);
        return NextResponse.redirect(loginUrl);
      }
      // Allow access to public routes
      return NextResponse.next();
    }

    // Session exists - verify it's valid
    // Note: We can't verify the session in middleware since we can't access the database
    // We'll rely on the API endpoints to validate sessions
    // The middleware here just ensures a session cookie exists

    if (isPublicPath && pathname !== "/admin/auth") {
      // If user is authenticated and trying to access login page, redirect to dashboard
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
