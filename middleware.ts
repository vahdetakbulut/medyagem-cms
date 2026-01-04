import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnLogin = req.nextUrl.pathname.startsWith("/login")
  const isOnApi = req.nextUrl.pathname.startsWith("/api")

  // API routes are handled by the route handlers
  if (isOnApi) {
    return NextResponse.next()
  }

  // Redirect to login if not logged in and trying to access admin
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Redirect to admin if logged in and trying to access login
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
