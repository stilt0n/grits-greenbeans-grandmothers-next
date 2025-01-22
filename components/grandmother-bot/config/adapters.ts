import { useAsStreamAdapter, type StreamingAdapterObserver } from '@nlux/react';
import { createPromptFromContext } from './prompts';
import '@nlux/themes/nova.css';
import { convertNluxChatHistory } from '@/lib/translation/parsers';
import { recipeChatAction } from '@/lib/actions/ai/recipe-chat';
import { readStreamableValue } from 'ai/rsc';

export const useChatAdapter = (context?: string) => {
  return useAsStreamAdapter(
    async (
      prompt: string,
      observer: StreamingAdapterObserver,
      { conversationHistory }
    ) => {
      const { output } = await recipeChatAction(
        createPromptFromContext(prompt, context),
        convertNluxChatHistory(conversationHistory)
      );

      for await (const chunk of readStreamableValue(output)) {
        if (typeof chunk === 'string') {
          observer.next(chunk);
        }
      }

      observer.complete();
    },
    [context]
  );
};
