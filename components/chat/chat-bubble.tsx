import { cn } from '@/lib/utils';

export type MessageRole = 'user' | 'assistant';

export interface ChatBubbleProps {
  role: MessageRole;
  content: string;
  className?: string;
}

export const ChatBubble = ({ role, content, className }: ChatBubbleProps) => {
  const isUser = role === 'user';

  return (
    <div
      aria-label={isUser ? 'User message' : 'Assistant message'}
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
          isUser
            ? 'bg-zinc-900 text-white rounded-br-sm'
            : 'bg-zinc-100 text-zinc-900 rounded-bl-sm'
        )}
      >
        {content}
      </div>
    </div>
  );
};
