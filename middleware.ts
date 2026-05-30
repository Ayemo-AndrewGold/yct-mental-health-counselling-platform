import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access')?.value
  const userCookie = request.cookies.get('user')?.value
  const path = request.nextUrl.pathname

  // ── Redirect logged-in users away from login pages ──
  if (token && userCookie) {
    const user = JSON.parse(userCookie)
    
    if (path === '/login' || path === '/login/student') {
      if (user.role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      if (user.role === 'counsellor') return NextResponse.redirect(new URL('/dashboard/counsellor', request.url))
      return NextResponse.redirect(new URL('/dashboard/student', request.url))
    }

    if (path === '/login/admin' && user.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    }

    if (path === '/login/counsellor' && user.role === 'counsellor') {
      return NextResponse.redirect(new URL('/dashboard/counsellor', request.url))
    }
  }

  // ── Redirect unauthenticated users away from dashboard ──
  if (!token || !userCookie) {
    if (path.startsWith('/dashboard/admin')) {
      return NextResponse.redirect(new URL('/login/admin', request.url))
    }
    if (path.startsWith('/dashboard/counsellor')) {
      return NextResponse.redirect(new URL('/login/counsellor', request.url))
    }
    if (path.startsWith('/dashboard/student')) {
      return NextResponse.redirect(new URL('/login', request.url)) // ← your student login is at /login
    }
    return NextResponse.next()
  }

  const user = JSON.parse(userCookie)

  // ── Role-based protection ──
  if (path.startsWith('/dashboard/admin') && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  if (path.startsWith('/dashboard/student') && user.role !== 'student') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  if (path.startsWith('/dashboard/counsellor') && user.role !== 'counsellor') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/login/admin',
    '/login/counsellor',
  ],
}