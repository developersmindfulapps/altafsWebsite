import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect all /admin routes except /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value
    const expectedToken = process.env.ADMIN_SESSION_TOKEN || 'secure_admin_logged_in_default_token'

    // Verify token
    if (!sessionCookie || sessionCookie !== expectedToken) {
      // Redirect unauthenticated users
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Prevent logged-in users from seeing the login page
  if (path === '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value
    const expectedToken = process.env.ADMIN_SESSION_TOKEN || 'secure_admin_logged_in_default_token'
    
    if (sessionCookie === expectedToken) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
