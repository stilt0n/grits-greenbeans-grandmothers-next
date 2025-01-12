'use client';
import { Button } from '@/components/ui/button';
import { ReactNode, useState } from 'react';

interface AdminActionButtonProps {
  adminAction: () => Promise<void>;
  children?: ReactNode;
}

export const AdminActionButton = ({
  adminAction,
  children,
}: AdminActionButtonProps) => {
  const [log, setLog] = useState<string>();
  return (
    <form action={adminAction}>
      <Button
        type='submit'
        onClick={() => {
          setLog('queued action. check server logs for details.');
        }}
      >
        {children}
      </Button>
      {log && <p>Log: {log}</p>}
    </form>
  );
};
