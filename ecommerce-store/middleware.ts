import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public paths that don't require store validation
const publicPaths = ['/api', '/_next', '/static', '/favicon.ico'];

export async function middleware(request: NextRequest) {
     const { pathname, host } = request.nextUrl;

     // Skip middleware for public paths
     if (publicPaths.some(path => pathname.startsWith(path))) {
          return NextResponse.next();
     }

     // Extract subdomain from host
     const subdomain = host.split('.')[0];

     // Skip if it's the main domain
     if (host === 'ecommercestore-online.vercel.app') {
          return NextResponse.next();
     }

     try {
          // Fetch store data from the admin API
          const response = await fetch(
               `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/api/stores/validate/${subdomain}`,
               {
                    headers: {
                         'Content-Type': 'application/json',
                    },
               }
          );

          if (!response.ok) {
               // Store not found or invalid
               return NextResponse.redirect(new URL('/', request.url));
          }

          const store = await response.json();

          // Clone the request headers and add store data
          const requestHeaders = new Headers(request.headers);
          requestHeaders.set('x-store-id', store.id);
          requestHeaders.set('x-store-name', store.name);

          // Return response with modified headers
          return NextResponse.next({
               request: {
                    headers: requestHeaders,
               },
          });
     } catch (error) {
          console.error('Middleware error:', error);
          return NextResponse.redirect(new URL('/', request.url));
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
           */
          '/((?!api|_next/static|_next/image|favicon.ico).*)',
     ],
}; 