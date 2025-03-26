import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public paths that don't require store validation
const publicPaths = ['/api', '/_next', '/static', '/favicon.ico'];

// Base domain for store URLs
const STORE_DOMAIN = process.env.NEXT_PUBLIC_STORE_DOMAIN || 'ecommercestore-online.vercel.app';

export async function middleware(request: NextRequest) {
     const { pathname, host } = request.nextUrl;

     // Skip middleware for public paths
     if (publicPaths.some(path => pathname.startsWith(path))) {
          return NextResponse.next();
     }

     // For local development, create dummy store headers
     if (host.includes('localhost') || host.includes('127.0.0.1')) {
          console.log('Local development detected, using test store data');

          // Create a new headers object
          const requestHeaders = new Headers(request.headers);

          // Add test store data to headers
          requestHeaders.set('x-store-id', 'local-dev-store-id');
          requestHeaders.set('x-store-name', 'Test Store');

          // Return next response with dummy headers
          return NextResponse.next({
               request: {
                    headers: requestHeaders,
               }
          });
     }

     try {
          // Extract subdomain from host
          let subdomain = '';

          if (host.includes('.vercel.app')) {
               // For Vercel domains
               subdomain = host.split('.')[0];

               // If it's the main domain, redirect to a default store or landing page
               if (host === STORE_DOMAIN) {
                    return NextResponse.redirect(new URL('/', request.url));
               }
          } else {
               // For custom domains
               subdomain = host.split('.')[0];
          }

          // Skip subdomain extraction if empty
          if (!subdomain) {
               return NextResponse.next();
          }

          // Generate store URL for validation
          const storeUrl = `https://${subdomain}.${STORE_DOMAIN}`;

          // Skip API validation in development to avoid errors
          const isDevelopment = process.env.NODE_ENV === 'development';
          if (isDevelopment) {
               const requestHeaders = new Headers(request.headers);
               requestHeaders.set('x-store-id', 'dev-store-id');
               requestHeaders.set('x-store-name', subdomain);
               requestHeaders.set('x-store-url', storeUrl);

               return NextResponse.next({
                    request: {
                         headers: requestHeaders,
                    }
               });
          }

          // Admin API validation - only in production
          const adminApiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;
          if (!adminApiUrl) {
               console.warn('NEXT_PUBLIC_ADMIN_API_URL not defined, skipping validation');
               return NextResponse.next();
          }

          // Production store validation
          const apiUrl = `${adminApiUrl}/api/stores/validate/${subdomain}`;
          const response = await fetch(apiUrl, {
               headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
               console.warn(`Store validation failed for subdomain: ${subdomain}`);
               return NextResponse.redirect(new URL('/', request.url));
          }

          const store = await response.json();

          // Add store data to headers
          const requestHeaders = new Headers(request.headers);
          requestHeaders.set('x-store-id', store.id);
          requestHeaders.set('x-store-name', store.name);
          requestHeaders.set('x-store-url', storeUrl);

          return NextResponse.next({
               request: {
                    headers: requestHeaders,
               }
          });
     } catch (error) {
          console.error('Middleware error:', error);
          // Continue without validation in case of error
          return NextResponse.next();
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