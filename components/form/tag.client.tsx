'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface TagProps {
  text: string;
  onClose: () => void;
}

export const Tag = (props: TagProps) => {
  return (
    <span
      className={cn(
        'inline-flex justify-between items-center gap-2 border border-black',
        'bg-zinc-800 text-white rounded-xl',
        'max-w-52 px-2 py-1 text-ellipsis'
      )}
    >
      <p
        className='max-w-40 whitespace-nowrap overflow-hidden text-ellipsis'
        title={props.text}
      >
        {props.text}
      </p>
      <Cross2Icon
        aria-label={`remove ${props.text} from tags`}
        tabIndex={0}
        onClick={() => props.onClose()}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            props.onClose();
          }
        }}
        role='button'
      />
    </span>
  );
};
