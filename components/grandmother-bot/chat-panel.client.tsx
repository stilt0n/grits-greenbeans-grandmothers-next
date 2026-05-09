'use client';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChatButton } from './chat-button.client';
import { Chat } from './chat.client';
import type { ChatPanelProps } from './types';

export const ChatPanel = ({ recipeId, buttonClassName }: ChatPanelProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <ChatButton className={buttonClassName} />
      </SheetTrigger>
      <SheetContent
        side='left'
        className='w-[48rem] max-w-full p-0 gap-0'
        focusOnContent
      >
        <VisuallyHidden>
          <SheetTitle>Chat with grandmother_bot</SheetTitle>
          <SheetDescription>
            Ask questions about this recipe — ingredients, substitutions, and
            technique.
          </SheetDescription>
        </VisuallyHidden>
        <Chat key={recipeId} body={{ recipeId }} className='h-full' />
      </SheetContent>
    </Sheet>
  );
};
