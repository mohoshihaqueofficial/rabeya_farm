import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName, readAdminToken } from "@/lib/admin-session";

// Optimistic gate: no valid admin cookie → send to /admin-login.
// app/admin/layout.tsx checks again on the server (proxy alone is not enough — see docs/security.md).
export async function proxy(request: NextRequest) {
  if (await readAdminToken(request.cookies.get(adminCookieName)?.value)) return NextResponse.next();
  const login = new URL("/admin-login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
