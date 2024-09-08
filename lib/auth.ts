import type { User } from '@clerk/nextjs/server';

const rolesWithPermissions = ['family', 'admin'];

export const hasElevatedPermissions = (user: User | null) => {
  const role = user?.publicMetadata.role;
  if (typeof role !== 'string') {
    return false;
  }
  return rolesWithPermissions.includes(role);
};

export const hasAdminPermissions = (user: User | null) => {
  return user?.publicMetadata.role === 'admin';
};
