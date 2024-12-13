'use client';

import { useState, KeyboardEvent } from 'react';
import { FormInput } from './form-input';
import { Button } from '@/components/ui/button';

export interface TagInputProps {
  label: string;
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
    <div>
      {tags.map((t) => (
        <p key={t}>{t}</p>
      ))}
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
      <Button onClick={onTagCreate}>Create Tag</Button>
    </div>
  );
};
