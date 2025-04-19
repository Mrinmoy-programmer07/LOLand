import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle access to uploads and memes directories
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/uploads/') || pathname.startsWith('/memes/')) {
    // Allow direct access to these files by passing through the request
    // Add caching headers for better performance
    const response = NextResponse.next();
    
    // Set caching headers (cache for 1 day)
    response.headers.set('Cache-Control', 'public, max-age=86400');
    
    return response;
  }
  
  return NextResponse.next();
}

// Configure matcher paths
export const config = {
  matcher: ['/uploads/:path*', '/memes/:path*'],
}; 