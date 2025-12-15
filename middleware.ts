// middleware.ts dosyası
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
  '/api/(.*)', // API rotalarını Middleware'den muaf tutar.
]);

export default clerkMiddleware((auth, req) => {
  const isProtected = isProtectedRoute(req);
  const isPublic = isPublicRoute(req);
  
  // Eğer talep korumalı bir rotayı eşleştiriyorsa VE herkese açık bir rota değilse, koru.
  if (isProtected && !isPublic) {
    // Eğer kullanıcı giriş yapmamışsa
    if (!auth().userId) {
      // Orijinal URL'yi alıyoruz, yönlendirme için kullanacağız
      const originalUrl = req.url;
      
      // Kullanıcıyı giriş sayfasına yönlendir
      return auth().redirectToSignIn({ returnBackUrl: originalUrl });
    }
    
    // Kullanıcı giriş yapmışsa, rotaya erişime izin ver
    auth().protect();
  }
});

export const config = {
  // Middleware'in hangi yolları dinleyeceğini tanımlar.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};