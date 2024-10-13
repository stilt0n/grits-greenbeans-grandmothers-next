'use client';
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { UserAvatar } from './user-avatar.client';
import { SignInAvatar } from './sign-in-avatar.client';

export const UserMenu = (props: { className?: string }) => {
  return (
    <div className={props.className}>
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
    </div>
  );
};
