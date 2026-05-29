import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access')?.value
  const userCookie = request.cookies.get('user')?.value
  const path = request.nextUrl.pathname


  // if no token at all, redirect to home
  if (!token || !userCookie) {
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL ('/', request.url))
    }
    return NextResponse.next()
  }

  const user = JSON.parse(userCookie)

  //Role-base protection
  if (path.startsWith('/dashboard/admin') && user.role !== 'admin') {
    return NextResponse.redirect(new URL ('/unauthorized', request.url))
  }

  if (path.startsWith('/dashboard/student') && user.role !== 'student') {
    return NextResponse.redirect(new URL ('/unauthorized', request.url))
  }

  if (path.startsWith('/dashboard/counsellor') && user.role !== 'counsellor') {
    return NextResponse.redirect(new URL ('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

