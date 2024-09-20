'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import { hasElevatedPermissions } from '@/lib/auth';
import { FilePlusIcon } from '@radix-ui/react-icons';

export const UserAvatar = () => {
  const { user } = useUser();
  const canModifyRecipes = hasElevatedPermissions(user);
  return canModifyRecipes ? (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          label='Create Recipe'
          labelIcon={<FilePlusIcon />}
          href='/create-recipe'
        />
      </UserButton.MenuItems>
    </UserButton>
  ) : (
    <UserButton />
  );
};