import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

// Define the routes that need protection
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/invite(.*)', // Davet kodu sayfalarını burada ekleyin
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
      // Eğer kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
      if (!auth().userId) {
          const origin = req.headers.get('origin') || 'http://localhost:3000'; // Kök URL'yi ayarla
          return auth().redirectToSignIn({
              returnBackUrl: origin, // Sadece kök URL'ye yönlendir
          });
      }
      auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};


