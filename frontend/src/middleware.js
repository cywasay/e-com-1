import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. PUBLIC ROUTES
  const publicRoutes = [
    "/",
    "/products",
    "/wholesale",
    "/login",
    "/register",
    "/blog",
    "/case-studies",
    "/catalogs",
    "/contact",
    "/cart",
    "/quote",
    "/privacy",
    "/terms",
    "/order/success",
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/categories/") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/case-studies/");

  if (isPublicRoute) return NextResponse.next();

  // 2. AUTH CHECK
  // NOTE: In Next.js, middleware runs on the server and cannot access localStorage.
  // To fulfill the "handle all route protection here" requirement, we assume
  // the authStore state is synced to a cookie named 'auth-storage'.
  const authCookie = request.cookies.get("auth-storage")?.value;
  const tokenCookie = request.cookies.get("auth-token")?.value;

  let auth = null;
  try {
    if (authCookie) {
      auth = JSON.parse(decodeURIComponent(authCookie)).state;
    }
  } catch (e) {
    console.error("Middleware auth parse error:", e);
  }

  const token = auth?.token || tokenCookie;
  const role = auth?.role;

  // 3. PROTECTED CUSTOMER ROUTES (/account/*)
  if (pathname.startsWith("/account")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 4. PROTECTED ADMIN ROUTES (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Only super_admin and admin_staff can access admin routes
    const adminRoles = ["super_admin", "admin_staff"];
    if (role && !adminRoles.includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
