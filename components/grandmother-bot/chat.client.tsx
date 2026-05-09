'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';

export interface ChatProps {
  initialMessages?: UIMessage[];
  api?: string;
  body?: Record<string, unknown>;
  className?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onError?: (error: Error) => void;
}

const messageText = (message: UIMessage): string =>
  message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');

export const Chat = ({
  initialMessages,
  api = '/api/grandmother-bot',
  body,
  className,
  emptyStateTitle,
  emptyStateDescription,
  onError,
}: ChatProps) => {
  const { messages, status, error, sendMessage, regenerate, stop, clearError } =
    useChat({
      messages: initialMessages,
      transport: new DefaultChatTransport({ api, body }),
      onError,
    });

  const isGenerating = status === 'submitted' || status === 'streaming';

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || isGenerating) {
      return;
    }
    sendMessage({ text });
  };

  const handleRetry = () => {
    clearError();
    regenerate();
  };

  return (
    <div className={cn('flex h-full flex-col pt-10', className)}>
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title={emptyStateTitle ?? 'Ask grandmother'}
              description={
                emptyStateDescription ??
                'Questions about this recipe — ingredients, substitutions, technique.'
              }
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.role === 'assistant' ? (
                    <MessageResponse
                      isAnimating={
                        status === 'streaming' &&
                        message.id === messages.at(-1)?.id
                      }
                    >
                      {messageText(message)}
                    </MessageResponse>
                  ) : (
                    messageText(message)
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === 'submitted' && (
            <Message from='assistant' aria-label='Thinking'>
              <MessageContent>
                <span
                  className='inline-flex gap-1 text-muted-foreground'
                  role='status'
                >
                  <span className='size-2 animate-pulse rounded-full bg-current' />
                  <span className='size-2 animate-pulse rounded-full bg-current [animation-delay:150ms]' />
                  <span className='size-2 animate-pulse rounded-full bg-current [animation-delay:300ms]' />
                </span>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {error && (
        <div
          className='mx-4 mb-2 flex items-center justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive'
          role='alert'
        >
          <span>Something went wrong. Please try again.</span>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      )}

      <div className='border-t px-2 py-2'>
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea disabled={isGenerating} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit
              status={status}
              onStop={stop}
              variant='brand'
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
