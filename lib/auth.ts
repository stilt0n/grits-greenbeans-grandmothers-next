import type { User } from '@clerk/nextjs/server';
import type { ClientUser } from '@/types/clerkTypes';

const rolesWithPermissions = ['family', 'admin'];

export const hasElevatedPermissions = (
  user: User | ClientUser | null | undefined
) => {
  const role = user?.publicMetadata.role;
  if (typeof role !== 'string') {
    return false;
  }
  return rolesWithPermissions.includes(role);
};

export const hasAdminPermissions = (
  user: User | ClientUser | null | undefined
) => {
  return user?.publicMetadata.role === 'admin';
};
