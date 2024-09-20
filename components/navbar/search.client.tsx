'use client';
import { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFocusHotkey } from '@/hooks/useFocusHotkey';
import { useRouter } from 'next/navigation';

interface SearchFormInput {
  query: string;
}

export const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { replace } = useRouter();
  useFocusHotkey('/', inputRef);
  const { register, handleSubmit } = useForm<SearchFormInput>({
    defaultValues: { query: '' },
  });

  const onSubmit: SubmitHandler<SearchFormInput> = ({ query }) => {
    const params = new URLSearchParams();
    if (query) {
      params.set('query', query);
    }
    replace(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('query')} ref={inputRef} />
      <Button type='submit'>
        <MagnifyingGlassIcon />
      </Button>
    </form>
  );
};
