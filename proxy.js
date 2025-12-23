import { NextResponse } from "next/server";

/**
 * This runs before request reaches page / route
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // 🔐 Cookie se login check
  const isLogin = request.cookies.get("isLogin")?.value === "true";

  // 🟢 Public routes (no auth required)
  const publicRoutes = [
    "/authentication/login",
    "/authentication/register",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🔴 Not logged in & protected route
  if (!isLogin && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/authentication/login", request.url)
    );
  }

  // 🟢 Logged in & trying to access login again
  if (isLogin && pathname.startsWith("/authentication/login")) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

/**
 * Apply proxy on these routes only
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/authentication/:path*",],
};
