'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import EditorInput from '@/components/editor';
import { useState } from 'react';

export interface RecipeFormProps {
  recipeData?: RecipeData;
}

export const RecipeForm = (props: RecipeFormProps) => {
  // this is not the way to do it with react-hook-form
  const [editorState, setEditorState] = useState('');
  return (
    <form className='h-full flex flex-col gap-y-4 p-4 lg:p-8'>
      <FormInput label='Recipe name' type='text' required />
      <FormInput label='Author' type='text' />
      <FormInput
        label='Recipe time'
        type='text'
        placeholder='e.g. 30 minutes'
      />
      <FormInput label='Image url' type='text' />
      <div>
        <Input type='hidden' value={editorState} />
        <EditorInput
          onChange={(editorContent) => setEditorState(editorContent)}
          menuAriaLabel='instructions editor menu'
          label='Recipe instructions'
        />
      </div>
      <Button>Submit</Button>
    </form>
  );
};

const recipeSchema = z.object({
  title: z.string().min(1, 'Title cannot be blank!'),
  instructions: z.string().min(1, 'Instructions cannot be blank!'),
  author: z.string().optional(),
  imageUrl: z.string().optional(),
  recipeTime: z.string().optional(),
});

type RecipeData = z.infer<typeof recipeSchema>;
