import type { ChatItem } from '@nlux/react';

const startMessage =
  "Hi, I'm grandmother_bot!\n\nI'm here to answer questions you have about recipes or cooking.\n\nI also love to talk about my pet dog grits.";

export const intialConversation: ChatItem[] = [
  {
    role: 'assistant',
    message: startMessage,
  },
];
