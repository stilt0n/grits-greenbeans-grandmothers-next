'use client';

import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

export type ChatButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export const ChatButton = forwardRef<HTMLButtonElement, ChatButtonProps>(
  ({ className, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        size='icon'
        className={cn('text-xs w-44 px-2 rounded-md', className)}
        aria-label='open chat window'
        {...rest}
      >
        Ask grandmother_bot
        <ChatBubbleIcon className='ml-2 h-4 w-4' />
      </Button>
    );
  }
);

ChatButton.displayName = 'ChatButton';
