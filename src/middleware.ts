import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
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
  "/agent",
  "/coming-soon-modal",
  "/testing",
  "/verify-email",
  "/referral",
  "/slots",
];

const agentProtectedRoutes = [
  "/agent/dashboard",
  "/agent/briefs",
  "/agent/onboard",
  "/agent/under-review",
];

const userProtectedRoutes = [
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

  // Skip middleware for API routes and static files
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Handle auth redirections for logged-in users
  if (userToken) {
    if (pathname === "/auth/login" || pathname === "/auth/register") {
      return NextResponse.redirect(new URL("/landlord", request.url));
    }
    // Redirect /landlord to dashboard if already logged in as landlord
    if (pathname === "/landlord") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Handle auth redirections for logged-in agents
  if (agentToken) {
    if (
      pathname === "/agent/auth/login" ||
      pathname === "/agent/auth/register"
    ) {
      return NextResponse.redirect(new URL("/agent/dashboard", request.url));
    }
    // Redirect /agent to dashboard if already logged in as agent
    if (pathname === "/agent") {
      return NextResponse.redirect(new URL("/agent/dashboard", request.url));
    }
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect agent routes
  const isAgentProtectedRoute = agentProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isAgentProtectedRoute) {
    if (!agentToken && !userToken) {
      const loginUrl = new URL("/agent/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect user routes
  const isUserProtectedRoute = userProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isUserProtectedRoute) {
    if (!userToken && !agentToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Handle property routes - check for specific property paths
  if (pathname.startsWith("/property/")) {
    return NextResponse.next();
  }

  // Handle buy_page details
  if (pathname.startsWith("/buy_page/details/")) {
    return NextResponse.next();
  }

  // Default: allow the request to continue
  return NextResponse.next();
}
