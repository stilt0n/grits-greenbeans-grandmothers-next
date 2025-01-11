'use client';
import { useRef, useState } from 'react';
import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from 'react-hook-form';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFocusHotkey } from '@/hooks/useFocusHotkey';
import { useRouter } from 'next/navigation';
import { capitalized, cn } from '@/lib/utils';

interface SearchFormInput {
  query: string;
}

interface SearchProps {
  categories: string[];
  className?: string;
  successCallback?: () => void;
}

export const Search = (props: SearchProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const selectedCategory = props.categories[categoryIndex] ?? 'title';
  const { push } = useRouter();
  useFocusHotkey('/', inputRef);
  const { register, handleSubmit } = useForm<SearchFormInput>({
    defaultValues: { query: '' },
  });

  const onSubmitSuccess: SubmitHandler<SearchFormInput> = ({ query }) => {
    const params = new URLSearchParams();
    if (query) {
      params.set('query', query);
      params.set('category', props.categories[categoryIndex] ?? 'title');
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
      className={cn('flex relative items-center', props.className)}
    >
      <MagnifyingGlassIcon className='absolute left-2 w-5 h-5' />
      <Input
        {...register('query')}
        autoComplete='off'
        placeholder={`Search for recipes by ${selectedCategory}`}
        ref={fullRef}
        className='w-[25rem] pl-8'
      />
      <div className='absolute right-0 top-0 h-full'>
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setCategoryIndex(props.categories.indexOf(value));
          }}
        >
          <SelectTrigger
            aria-label='Choose a category to search'
            className='h-full border-0 bg-transparent focus:ring-0 focus:ring-offset-0 focus:bg-slate-100'
          >
            <SelectValue placeholder='title' />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {props.categories.map((category) => (
              <SelectItem
                className='focus:bg-slate-100'
                value={category}
                key={category}
              >
                {capitalized(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};
