'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { hasElevatedPermissions } from '@/lib/auth';
import { SidebarLogin } from './sidebar-login';
import { Search } from './search.client';
import { usePathname } from 'next/navigation';
import { PRIVACY_POLICY_LINK } from '@/lib/constants';

const useCloseOnRouteChange = (onClose: () => void) => {
  const pathname = usePathname();
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);
};

const searchCategories = ['title', 'author', 'tag'];

export const SideNav = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const canCreateRecipes = hasElevatedPermissions(user);

  // the callback keeps onClose stable for the dependency array
  // it's not strictly necessary but I like this a little better
  // than silencing the React linter warning
  const closeNav = useCallback(() => setOpen(false), []);
  useCloseOnRouteChange(closeNav);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost'>
          <HamburgerMenuIcon height='2.5rem' />
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-[36rem] max-w-full'>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className='flex flex-col pt-8 pl-4 gap-8 h-full'>
          <Search successCallback={closeNav} categories={searchCategories} />
          <Link href='/about'>About This Site</Link>
          {canCreateRecipes ? (
            <Link href='/create-recipe'>Create a Recipe</Link>
          ) : null}
          <SidebarLogin className='flex flex-col gap-8 items-start' />
          <div className='flex flex-row mt-auto mb-8 gap-x-8'>
            <Link className='text-sm' href={PRIVACY_POLICY_LINK}>
              Privacy Policy
            </Link>
            <Link className='text-sm' href='/delete-my-account'>
              Delete My Account
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
