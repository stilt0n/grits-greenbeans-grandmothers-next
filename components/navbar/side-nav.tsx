import Link from 'next/link';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SignedIn } from '@clerk/nextjs';
import { SidebarLogin } from './sidebar-login';
import { Search } from './search.client';

export const SideNav = () => {
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
          <SidebarLogin className='flex flex-col gap-8 items-start' />
        </div>
      </SheetContent>
    </Sheet>
  );
};
