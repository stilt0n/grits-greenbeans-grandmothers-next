'use client';

import { hasElevatedPermissions } from '@/lib/auth';
import { useUser } from '@clerk/nextjs';
import { ReactNode } from 'react';

export const FamilyOnly = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const hasPermission = hasElevatedPermissions(user);
  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};
