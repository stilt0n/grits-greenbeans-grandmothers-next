'use client';

import { useState } from 'react';
import { FormInput } from './form-input';
import { Button } from '@/components/ui/button';
import { Tag } from './tag.client';
import { PlusIcon } from '@radix-ui/react-icons';

export interface TagInputProps {
  label: string;
  className?: string;
}

export const TagInput = (props: TagInputProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [value, setValue] = useState('');

  const onTagCreate = () => {
    const updatedTags = [...tags, value];
    setTags(updatedTags);
    setValue('');
  };

  return (
    <div className={props.className}>
      <div className='flex flex-row max-w-full overflow-x-auto gap-x-2'>
        {tags.map((text, index) => (
          <Tag
            key={text}
            text={text}
            onClose={() => {
              setTags((current) => current.toSpliced(index, 1));
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
          onClick={onTagCreate}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};
