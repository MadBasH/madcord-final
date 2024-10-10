import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

// Define the routes that need protection
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

// Define the routes that are public and should not be protected
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/uploadthing(.*)'
]);

export default clerkMiddleware((auth, req) => {
  // If the request matches a protected route and does not match a public route, protect it
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
      auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};