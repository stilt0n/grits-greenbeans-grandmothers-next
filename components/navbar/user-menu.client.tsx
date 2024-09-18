import { SignedIn, SignedOut } from '@clerk/nextjs';
import { UserAvatar } from './user-avatar.client';
import { SignInAvatar } from './sign-in-avatar.client';

export const UserMenu = () => {
  return (
    <>
      <SignedIn>
        <UserAvatar />
      </SignedIn>
      <SignedOut>
        <SignInAvatar />
      </SignedOut>
    </>
  );
};
