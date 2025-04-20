import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // List of public API routes that don't require authentication
  const publicApiRoutes = [
    '/api/meme',
    '/api/upload',
    '/api/generate-meme',
    '/api/memes'
  ];

  // Check if the path is an API route that requires authentication
  if (path.startsWith('/api') && 
      !publicApiRoutes.some(route => path.startsWith(route))) {
    // Get the API key from the request headers
    const apiKey = request.headers.get('x-api-key');

    // Check if the API key matches the environment variable
    if (apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

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
  matcher: ['/uploads/:path*', '/memes/:path*', '/api/:path*'],
}; 