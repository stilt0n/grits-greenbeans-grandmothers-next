import { useAsStreamAdapter, type StreamingAdapterObserver } from '@nlux/react';
import { createPromptFromContext } from './prompts';
import '@nlux/themes/nova.css';
import { convertNluxChatHistory } from '@/lib/translation/parsers';

export const useChatAdapter = (context?: string) => {
  return useAsStreamAdapter(
    async (
      prompt: string,
      observer: StreamingAdapterObserver,
      { conversationHistory }
    ) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt: createPromptFromContext(prompt, context),
          history: convertNluxChatHistory(conversationHistory),
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status !== 200) {
        observer.error(new Error('Failed to connect to the server'));
        return;
      }

      if (!response.body) {
        return;
      }

      const reader = response.body.getReader();
      const textDecoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const content = textDecoder.decode(value);
        if (content) {
          observer.next(content);
        }
      }

      observer.complete();
    },
    [context]
  );
};
