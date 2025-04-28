import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('token')?.value || null;
    const { pathname } = req.nextUrl;

    const publicPaths = ['/', '/login', '/signup'];

    if (!token && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && (pathname === '/login' || pathname === '/signup')) {
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
