'use client';

import { HTMLProps, useState } from 'react';
import { FormInput } from './form-input';
import { Button } from '@/components/ui/button';
import { Tag } from './tag.client';
import { PlusIcon } from '@radix-ui/react-icons';

export interface TagInputProps {
  label: string;
  initialTags?: string[];
  className?: string;
  onChange?: (tags: string[]) => void;
  inputProps?: Omit<HTMLProps<HTMLInputElement>, 'type' | 'hidden'>;
}

export const TagInput = ({ inputProps, ...props }: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(props.initialTags ?? []);
  const [value, setValue] = useState('');

  const onTagCreate = () => {
    if (value === '') {
      return;
    }
    const updatedTags = [...tags, value.toLowerCase()];
    setTags(updatedTags);
    props.onChange?.(updatedTags);
    setValue('');
  };

  return (
    <div className={props.className}>
      <input hidden type='text' {...inputProps} />
      <div className='flex flex-row max-w-full overflow-x-auto gap-x-2'>
        {tags.map((text, index) => (
          <Tag
            key={text}
            text={text}
            onClose={() => {
              const updatedTags = tags.toSpliced(index, 1);
              setTags(updatedTags);
              props.onChange?.(updatedTags);
            }}
          />
        ))}
      </div>
      <div className='flex flex-row gap-x-2 items-center'>
        <FormInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label={props.label}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onTagCreate();
            }
          }}
        />
        <Button
          className='self-end'
          aria-label='create tag'
          onClick={(e) => {
            e.preventDefault();
            onTagCreate();
          }}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};
