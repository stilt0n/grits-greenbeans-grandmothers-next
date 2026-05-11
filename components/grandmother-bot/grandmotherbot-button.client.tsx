'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type GrandmotherBotButtonProps = React.ComponentPropsWithoutRef<
  typeof Button
>;

export const GrandmotherBotButton = forwardRef<
  HTMLButtonElement,
  GrandmotherBotButtonProps
>(({ className, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      variant='brand'
      className={cn(
        'relative h-16 w-16 rounded-full p-0 overflow-visible shadow-lg ring-1 ring-inset',
        // this deliberately doesn't use semantic colors since it's matching a PNG image
        // and should not be affected by theme changes
        'ring-black',
        className
      )}
      aria-label='open chat with grandmother_bot'
      {...rest}
    >
      <span className='relative h-full w-full overflow-hidden rounded-full'>
        <Image
          src='/grandmotherbot_256x256.png'
          alt=''
          fill
          sizes='64px'
          className='object-cover'
        />
      </span>
      <span
        aria-hidden='true'
        className={cn(
          'absolute -top-1 -left-1 flex h-7 w-7 items-center justify-center rounded-full',
          'bg-background text-foreground shadow-md ring-1 ring-ring'
        )}
      >
        <ChatBubbleIcon className='size-4' />
      </span>
    </Button>
  );
});

GrandmotherBotButton.displayName = 'GrandmotherBotButton';
