import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT secret (should match backend)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Role-based route configurations
const ROLE_ROUTES = {
  admin: ['/admin'],
  seller: ['/seller'],
  customer: ['/cart', '/checkout', '/orders'],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/', '/_next', '/api'];

// Routes that require authentication but no specific role
const AUTH_ROUTES = ['/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a public route
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get JWT from httpOnly cookie
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    if (!payload || !payload.sub) {
      throw new Error('Invalid token payload');
    }

    const userRole = payload.role as string;
    const userId = payload.sub;

    // Check if user is blocked
    if (payload.isBlocked) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('jwt');
      return response;
    }

    // Check role-based access for admin routes
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check role-based access for seller routes
    if (pathname.startsWith('/seller') && userRole !== 'seller') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check role-based access for customer routes
    if (ROLE_ROUTES.customer.some(route => pathname.startsWith(route)) && userRole !== 'customer') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Add user info to headers for use in components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-role', userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error('JWT verification failed:', error);
    
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('jwt');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
