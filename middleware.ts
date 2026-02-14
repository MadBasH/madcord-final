import {
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';

// --- Korunacak Rotalar ---
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/invite(.*)', 
]);

// --- Herkesin Erişebileceği Rotalar ---
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/uploadthing(.*)', 
  '/api/(.*)', 
]);

export default clerkMiddleware((auth, req) => {
  const isProtected = isProtectedRoute(req);
  const isPublic = isPublicRoute(req);
  
  if (isProtected && !isPublic) {
    if (!auth().userId) {
      const originalUrl = req.url;
      return auth().redirectToSignIn({ returnBackUrl: originalUrl });
    }
    auth().protect();
  }
});

// --- KRİTİK GÜNCELLEME BURADA ---
export const config = {
  matcher: [
    // 1. _next klasörü, statik dosyalar VE "api/socket/io" rotası hariç her şeyi yakala
    '/((?!.*\\..*|_next|api/socket/io).*)', 
    '/', 
    // 2. API rotalarını yakala AMA "api/socket/io" ise yakalama (Negative Lookahead)
    '/(api(?!/socket/io)|trpc)(.*)', 
  ],
};