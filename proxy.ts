import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isWritePermissionRoute = createRouteMatcher([
  '/create-recipe(.*)',
  '/edit-recipe(.*)',
]);

const isAdminPermissionRoute = createRouteMatcher([
  '/(trpc)(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isWritePermissionRoute(req)) {
    const { userId, sessionClaims, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn();
    }
    const role = sessionClaims?.metadata?.role;
    if (role !== 'family' && role !== 'admin') {
      return new NextResponse(null, { status: 404 });
    }
  }

  if (isAdminPermissionRoute(req)) {
    const { userId, sessionClaims } = await auth();
    const isAdmin = !!userId && sessionClaims?.metadata?.role === 'admin';
    if (!isAdmin) {
      return new NextResponse(null, { status: 404 });
    }
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
