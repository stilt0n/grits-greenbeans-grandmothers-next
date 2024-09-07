'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import EditorInput from '@/components/editor';
import { useEffect } from 'react';

export interface RecipeFormProps {
  recipeData?: RecipeData;
}

export const RecipeForm = (props: RecipeFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors: e },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      author: '',
      recipeTime: '',
      imageUrl: '',
      instructions: '',
    },
  });
  const onSubmit = handleSubmit(
    (data, event) => {
      event?.preventDefault();
      console.log(data);
    },
    (e) => {
      console.log(e);
    }
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'instructions') {
        console.log(value.instructions);
      }
    });
    return () => subscription.unsubscribe();
  });

  return (
    <>
      <form
        className='h-full flex flex-col gap-y-4 p-4 lg:p-8'
        onSubmit={onSubmit}
      >
        <FormInput
          label='Recipe name'
          type='text'
          required
          {...register('title')}
        />
        <FormInput label='Author' type='text' {...register('author')} />
        <FormInput
          label='Recipe time'
          type='text'
          placeholder='e.g. 30 minutes'
          {...register('recipeTime')}
        />
        <FormInput label='Image url' type='text' {...register('imageUrl')} />
        <EditorInput
          onChange={(editorContent) => setValue('instructions', editorContent)}
          menuAriaLabel='instructions editor menu'
          label='Recipe instructions'
          inputProps={register('instructions')}
          errorMessage={e.instructions?.message}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </>
  );
};

const recipeSchema = z.object({
  title: z.string().min(1, 'Title cannot be blank!'),
  instructions: z
    .string()
    .min(1, 'Instructions cannot be blank and cannot use the default input'),
  author: z.string().optional(),
  imageUrl: z.string().optional(),
  recipeTime: z.string().optional(),
});

type RecipeData = z.infer<typeof recipeSchema>;
