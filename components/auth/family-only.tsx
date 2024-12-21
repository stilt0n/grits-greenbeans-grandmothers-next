import { hasElevatedPermissions } from '@/lib/auth';
import { currentUser } from '@clerk/nextjs/server';
import { ReactNode } from 'react';

export const FamilyOnly = async ({ children }: { children: ReactNode }) => {
  const user = await currentUser();
  const hasPermission = hasElevatedPermissions(user);
  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};
