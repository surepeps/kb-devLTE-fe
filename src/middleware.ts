import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/:path*", // Match everything, handle logic inside
  ],
};

const publicRoutes = [
  "/",
  "/homepage",
  "/about_us",
  "/contact-us",
  "/policies_page",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
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

const agentProtectedPrefix = "/agent";
const agentAuthPrefix = "/agent/auth";

const userProtectedPrefixes = [
  "/dashboard",
  "/profile",
  "/my_listing",
  "/preference",
  "/post_property",
  "/new-post-property",
  "/negotiation-inspection",
  "/seller-negotiation-inspection",
  "/payment-details",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const agentToken = request.cookies.get("agentToken")?.value;
  const userToken = request.cookies.get("token")?.value;

  // ✅ If user is logged in and trying to visit /auth/*, redirect to /dashboard
  if (
    userToken &&
    (pathname === "/auth/login" || pathname === "/auth/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ If agent is logged in and trying to visit /agent/auth/*, redirect to /agent/dashboard
  if (
    agentToken &&
    (pathname === "/agent/auth/login" || pathname === "/agent/auth/register")
  ) {
    return NextResponse.redirect(new URL("/agent/dashboard", request.url));
  }

  // ✅ Allow public routes
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );
  if (isPublicRoute) return NextResponse.next();

  // ✅ Protect agent routes
  if (
    pathname.startsWith(agentProtectedPrefix) &&
    !pathname.startsWith(agentAuthPrefix)
  ) {
    if (!agentToken) {
      return NextResponse.redirect(new URL("/agent/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // ✅ Protect user routes
  if (userProtectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
