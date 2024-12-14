import { cn } from '@/lib/utils';

interface TagProps {
  text: string;
}

export const DecorativeTag = (props: TagProps) => {
  return (
    <span
      className={cn(
        'inline-flex justify-between items-center gap-2 border border-black',
        'bg-zinc-800 text-white rounded-xl',
        'max-w-52 px-2 py-1 text-ellipsis h-8'
      )}
    >
      <p
        className='max-w-40 whitespace-nowrap overflow-hidden text-ellipsis'
        title={props.text}
        aria-label={`tag: ${props.text}`}
      >
        {props.text}
      </p>
    </span>
  );
};
