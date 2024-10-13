import Link from 'next/link';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Search } from './search.client';
import { UserMenu } from './user-menu.client';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from '@clerk/nextjs';

const Navbar = () => {
  return (
    <nav className='flex flex-row px-4 py-4 drop-shadow-xl border-b border-zinc-200'>
      <h1 className='text-lg md:text-3xl text-left'>
        <Link href='/'>Grits Greenbeans and Grandmothers</Link>
      </h1>
      <div className='flex flex-row justify-end ml-auto gap-6 items-baseline'>
        <Search className='hidden lg:flex' />
        <UserMenu className='hidden md:flex' />
        <NavMenu />
      </div>
    </nav>
  );
};

const NavMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent side='left' className='w-[36rem] max-w-full'>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className='flex flex-col pt-8 pl-4 gap-8'>
          <Search />
          <SignedIn>
            <Link href='/create-recipe'>Create a Recipe</Link>
          </SignedIn>
          <LoginStateButton className='flex flex-col gap-8 items-start' />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const LoginStateButton = (props: { className?: string }) => {
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

export default Navbar;
