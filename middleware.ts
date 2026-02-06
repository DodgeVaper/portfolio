import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

function unauthorized(message = 'Authentication required') {
  return new NextResponse(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Keystatic Admin"',
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Защищаем только админку и API Keystatic
  const isKeystaticUI = pathname.startsWith('/keystatic');
  const isKeystaticAPI = pathname.startsWith('/api/keystatic');

  if (!isKeystaticUI && !isKeystaticAPI) {
    return NextResponse.next();
  }

  if (!ADMIN_USER || !ADMIN_PASS) {
    return new NextResponse('Admin auth is not configured (set ADMIN_USER / ADMIN_PASS)', {
      status: 500,
    });
  }

  // Уже есть валидная сессия
  const cookie = request.cookies.get('keystatic_auth')?.value;
  if (cookie === '1') {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorized();
  }

  const base64 = authHeader.slice('Basic '.length).trim();
  let user = '';
  let pass = '';

  try {
    // Middleware runs on the Edge runtime, so use Web APIs (atob) instead of Node's Buffer
    const decoded = atob(base64);
    const idx = decoded.indexOf(':');
    if (idx === -1) {
      return unauthorized();
    }
    user = decoded.slice(0, idx);
    pass = decoded.slice(idx + 1);
  } catch {
    return unauthorized();
  }

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return unauthorized('Invalid credentials');
  }

  const response = NextResponse.next();
  response.cookies.set('keystatic_auth', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/keystatic/:path*', '/api/keystatic/:path*'],
};


