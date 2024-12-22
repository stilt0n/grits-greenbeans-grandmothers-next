import { useAsStreamAdapter, type StreamingAdapterObserver } from '@nlux/react';
import { createPromptFromContext } from './prompts';
import '@nlux/themes/nova.css';

export const useChatAdapter = (context?: string) => {
  return useAsStreamAdapter(
    async (prompt: string, observer: StreamingAdapterObserver) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt: createPromptFromContext(prompt, context),
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
