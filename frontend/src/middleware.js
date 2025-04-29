import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('token')?.value || null;
    const { pathname } = req.nextUrl;

    const publicPaths = ['/', '/auth/login', '/signup'];

    if (!token && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (token && (pathname === '/auth/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/admin/:path*',
        '/profile/:path*',
        '/beats/:path*',
        '/officers/:path*',
    ],
};
