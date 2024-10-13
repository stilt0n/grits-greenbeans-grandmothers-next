import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from '@clerk/nextjs';

export const SidebarLogin = (props: { className?: string }) => {
  return (
    <div className={props.className}>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
    </div>
  );
};
