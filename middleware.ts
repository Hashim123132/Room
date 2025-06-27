import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const protectedRoute = createRouteMatcher([
  '/',
  '/upcoming',
  '/meeting(.*)',
  '/previous',
  '/recordings',
  '/personal-room',
]);

export default clerkMiddleware(async (auth, req) => {
  if (protectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
     
      // Redirect unauthenticated users to the sign-in page
      const signInUrl = new URL('/sign-in', req.url);
     
      //where the user originally wanted to go before sign in so redirect to that
      signInUrl.searchParams.set('redirectUrl', req.url);
      //redirect
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};