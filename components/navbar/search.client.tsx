'use client';
import { useRef } from 'react';
import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from 'react-hook-form';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFocusHotkey } from '@/hooks/useFocusHotkey';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchFormInput {
  query: string;
}

interface SearchProps {
  className?: string;
  successCallback?: () => void;
}

export const Search = (props: SearchProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { push } = useRouter();
  useFocusHotkey('/', inputRef);
  const { register, handleSubmit } = useForm<SearchFormInput>({
    defaultValues: { query: '' },
  });

  const onSubmitSuccess: SubmitHandler<SearchFormInput> = ({ query }) => {
    const params = new URLSearchParams();
    if (query) {
      params.set('query', query);
    }
    props.successCallback?.();
    push(`/?${params.toString()}`);
  };

  const onSubmitError: SubmitErrorHandler<SearchFormInput> = (error) => {
    console.log('failure!', error);
  };

  const fullRef = (element: HTMLInputElement) => {
    inputRef.current = element;
    register('query').ref(element);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitSuccess, onSubmitError)}
      className={cn('flex', props.className)}
    >
      <Input
        {...register('query')}
        autoComplete='off'
        placeholder='Type / to search'
        ref={fullRef}
        className='w-[25rem]'
      />
      <Button type='submit' variant='outline'>
        <MagnifyingGlassIcon />
      </Button>
    </form>
  );
};
