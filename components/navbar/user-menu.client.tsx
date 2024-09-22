'use client';
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { UserAvatar } from './user-avatar.client';
import { SignInAvatar } from './sign-in-avatar.client';

export const UserMenu = () => {
  return (
    <>
      <ClerkLoaded>
        <SignedIn>
          <UserAvatar />
        </SignedIn>
        <SignedOut>
          <SignInAvatar />
        </SignedOut>
      </ClerkLoaded>
      <ClerkLoading>
        <div>Loading...</div>
      </ClerkLoading>
    </>
  );
};
