'use client';
import { useState } from 'react';
import { AiChat } from '@nlux/react';
import '@nlux/themes/nova.css';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChatButton } from './chat-button.client';
import { useChatAdapter } from './config/adapters';
import { intialConversation } from './config/history';
import { ChatPanelProps } from './types';

// note that props is used implicitly by the defaultAdapter
export const ChatPanel = (props: ChatPanelProps) => {
  const [open, setOpen] = useState(false);
  const adapter = useChatAdapter(props.pageContext);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <ChatButton
          className={props.buttonClassName}
          chatOpen={open}
          setChatOpen={setOpen}
        />
      </SheetTrigger>
      <SheetContent side='left' className='w-[48rem] max-w-full'>
        <div className='pt-4 w-full h-full'>
          <AiChat
            adapter={adapter}
            initialConversation={intialConversation}
            conversationOptions={{
              layout: 'bubbles',
            }}
            displayOptions={{ colorScheme: 'light' }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
