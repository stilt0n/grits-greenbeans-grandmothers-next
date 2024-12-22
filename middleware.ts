import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isWritePermissionRoute = createRouteMatcher([
  '/create-recipe(.*)',
  '/edit-recipe(.*)',
]);

const isAdminPermissionRoute = createRouteMatcher(['/(trpc)(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isWritePermissionRoute(req)) {
    auth().protect(() => {
      const { userId, sessionClaims } = auth();
      return (
        !!userId &&
        (sessionClaims?.metadata?.role === 'family' ||
          sessionClaims?.metadata?.role === 'admin')
      );
    });
  }

  if (isAdminPermissionRoute(req)) {
    auth().protect(() => {
      const { userId, sessionClaims } = auth();
      return !!userId && sessionClaims?.metadata?.role === 'admin';
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
