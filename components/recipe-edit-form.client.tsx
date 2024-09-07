'use client';
import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from 'react-hook-form';
import { recipeSchema, type RecipeData } from '@/types/recipeTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import EditorInput from '@/components/editor';

export interface RecipeFormProps {
  onSubmitSuccess: SubmitHandler<RecipeData>;
  onSubmitError: SubmitErrorHandler<RecipeData>;
  initialRecipeData?: RecipeData;
}

const blankRecipeData = {
  title: '',
  author: '',
  recipeTime: '',
  imageUrl: '',
  instructions: '',
};

export const RecipeForm = ({
  initialRecipeData = blankRecipeData,
  ...props
}: RecipeFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: e },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialRecipeData,
  });
  const onSubmit = handleSubmit(props.onSubmitSuccess, props.onSubmitError);

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
          initialContent={
            initialRecipeData.instructions.length > 0
              ? initialRecipeData.instructions
              : undefined
          }
        />
        <Button type='submit'>Submit</Button>
      </form>
    </>
  );
};
