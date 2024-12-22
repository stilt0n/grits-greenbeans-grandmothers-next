'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

export interface ChatButtonProps {
  chatOpen: boolean;
  setChatOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export const ChatButton = (props: ChatButtonProps) => {
  return (
    <Button
      size='icon'
      className={cn('w-48 rounded-md', props.className)}
      onClick={() => props.setChatOpen((prev) => !prev)}
      aria-label='open chat window'
    >
      Ask grandmother_bot
      <ChatBubbleIcon className='ml-2 h-4 w-4' />
    </Button>
  );
};
