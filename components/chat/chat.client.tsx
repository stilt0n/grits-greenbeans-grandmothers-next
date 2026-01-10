'use client';

import { useEffect, useRef } from 'react';
import { ChatBubble, type MessageRole } from './chat-bubble';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

export interface ChatProps {
  messages: Message[];
  className?: string;
}

export const Chat = ({ messages, className }: ChatProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      role='log'
      aria-live='polite'
      aria-label='Chat messages'
      ref={scrollRef}
      className={cn('flex flex-col gap-3 overflow-y-auto p-4', className)}
    >
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          role={message.role}
          content={message.content}
        />
      ))}
    </div>
  );
};
