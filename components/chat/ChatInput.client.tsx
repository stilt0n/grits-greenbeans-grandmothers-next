'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ChatInput = ({
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  className,
}: ChatInputProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex items-end gap-2 p-4 border-t border-zinc-200', className)}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          'flex-1 resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm',
          'placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'min-h-[40px] max-h-[120px]'
        )}
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <PaperPlaneIcon className="h-4 w-4" />
      </Button>
    </form>
  );
};
