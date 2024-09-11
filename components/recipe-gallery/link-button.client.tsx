'use client';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';

export interface LinkButtonProps extends ButtonProps {
  href: string;
  children?: ReactNode;
}

export const LinkButton = ({
  href,
  children,
  ...buttonProps
}: LinkButtonProps) => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push(href)} {...buttonProps}>
      {children}
    </Button>
  );
};
