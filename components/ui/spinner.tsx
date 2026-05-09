import { UpdateIcon as Loader2Icon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<'svg'>, 'children'>) {
  return (
    <Loader2Icon
      role='status'
      aria-label='Loading'
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
