import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isAppRoute = req.nextUrl.pathname.startsWith("/app");
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/app", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAppRoute = req.nextUrl.pathname.startsWith("/app");
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || 
                           req.nextUrl.pathname.startsWith("/register");

        // Public routes (homepage, etc.) - allow access
        if (!isAppRoute && !isAdminRoute && !isAuthRoute) {
          return true;
        }

        // Auth routes - always allow access (redirect handled in page component)
        if (isAuthRoute) {
          return true;
        }

        // Protected routes - require token
        if (isAppRoute || isAdminRoute) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/login", "/register"],
};







