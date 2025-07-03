import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/admin/:path*",
    "/agent/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/my_listing/:path*",
    "/preference/:path*",
    "/post_property/:path*",
    "/new-post-property/:path*",
    "/negotiation-inspection/:path*",
    "/seller-negotiation-inspection/:path*",
    "/payment-details/:path*",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get("adminToken")?.value;
  const agentToken = request.cookies.get("agentToken")?.value;
  const userToken = request.cookies.get("userToken")?.value;

  // Public routes that don't require any authentication
  const publicRoutes = [
    "/",
    "/homepage",
    "/about_us",
    "/contact-us",
    "/policies_page",
    "/auth/login",
    "/auth/register",
    "/auth/reset-password",
    "/admin/auth/login",
    "/agent/auth/login",
    "/agent/auth/register",
    "/buy_page",
    "/rent_page",
    "/agent_marketplace",
    "/market-place",
    "/joint-ventures",
    "/joint_ventures",
    "/landlord",
    "/coming-soon-modal",
    "/testing",
    "/verify-email",
    "/referral",
    "/slots",
  ];

  // Check if the route is public or starts with a public route
  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(route)),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // Agent route protection (excluding auth routes)
  if (pathname.startsWith("/agent") && !pathname.startsWith("/agent/auth")) {
    if (!agentToken) {
      return NextResponse.redirect(new URL("/agent/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // Protected user routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/my_listing") ||
    pathname.startsWith("/preference") ||
    pathname.startsWith("/post_property") ||
    pathname.startsWith("/new-post-property") ||
    pathname.startsWith("/negotiation-inspection") ||
    pathname.startsWith("/seller-negotiation-inspection") ||
    pathname.startsWith("/payment-details")
  ) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
