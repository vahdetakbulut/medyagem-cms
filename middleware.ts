import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isOnAdmin = request.nextUrl.pathname.startsWith("/admin")
  const isOnLogin = request.nextUrl.pathname.startsWith("/login")
  const isOnApi = request.nextUrl.pathname.startsWith("/api")

  // API routes are handled by the route handlers
  if (isOnApi) {
    return NextResponse.next()
  }

  // Check for auth token in cookies (NextAuth v5 uses these cookie names)
  const cookies = request.cookies
  const authToken = 
    cookies.get("authjs.session-token")?.value ||
    cookies.get("__Secure-authjs.session-token")?.value ||
    cookies.get("next-auth.session-token")?.value ||
    cookies.get("__Secure-next-auth.session-token")?.value

  const isLoggedIn = !!authToken

  // Redirect to login if not logged in and trying to access admin
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to admin if logged in and trying to access login
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
