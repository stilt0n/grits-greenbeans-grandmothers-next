'use client';
import Link from 'next/link';
import { useState } from 'react';
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

export const SideNav = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const canCreateRecipes = hasElevatedPermissions(user);
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
        <div className='flex flex-col pt-8 pl-4 gap-8'>
          <Search successCallback={() => setOpen(false)} />
          {canCreateRecipes ? (
            <Link href='/create-recipe'>Create a Recipe</Link>
          ) : null}
          <SidebarLogin className='flex flex-col gap-8 items-start' />
        </div>
      </SheetContent>
    </Sheet>
  );
};
