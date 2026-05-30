import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access')?.value
  const userCookie = request.cookies.get('user')?.value
  const path = request.nextUrl.pathname

  // If no token redirect to the correct login page
  if (!token || !userCookie) {
    if (path.startsWith('/dashboard/admin')) {
      return NextResponse.redirect(new URL('/login/admin', request.url))
    }
    if (path.startsWith('/dashboard/counsellor')) {
      return NextResponse.redirect(new URL('/login/counsellor', request.url))
    }
    if (path.startsWith('/dashboard/student')) {
      return NextResponse.redirect(new URL('/login/student', request.url))
    }
    return NextResponse.next()
  }

  const user = JSON.parse(userCookie)

  // Role-based protection
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
  matcher: ['/dashboard/:path*'],
}