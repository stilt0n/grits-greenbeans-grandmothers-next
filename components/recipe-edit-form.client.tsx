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
import { useEffect, useState } from 'react';

export interface RecipeFormProps {
  onSubmitSuccess: SubmitHandler<RecipeData>;
  onSubmitError: SubmitErrorHandler<RecipeData>;
  initialRecipeData?: RecipeData;
}

const blankRecipeData = {
  title: '',
  description: '',
  author: null,
  recipeTime: null,
  imageFileList: null,
  instructions: '',
};

const useImageFileUrl = (fileList: FileList | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (fileList?.length === 1) {
      const file = fileList[0];
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }
    setImageUrl(null);
  }, [fileList]);
  return imageUrl;
};

export const RecipeForm = ({
  initialRecipeData = blankRecipeData,
  ...props
}: RecipeFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors: e },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialRecipeData,
  });
  const onSubmit = handleSubmit(props.onSubmitSuccess, props.onSubmitError);
  const imageFileList = watch('imageFileList');
  const imageUrl = useImageFileUrl(imageFileList);
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
        <FormInput
          label='Recipe description'
          type='text'
          required
          {...register('description')}
        />
        <FormInput label='Author' type='text' {...register('author')} />
        <FormInput
          label='Recipe time'
          type='text'
          placeholder='e.g. 30 minutes'
          {...register('recipeTime')}
        />
        <FormInput
          label='Upload Image'
          type='file'
          accept='image/*'
          {...register('imageFileList')}
        />
        {
          // using an img element here because I want to keep the original image size for accurate resizing purposes
          // alt is blank because the screen reader should already get info from the form input.
          // eslint-disable-next-line @next/next/no-img-element
          imageUrl && <img src={imageUrl} alt='' />
        }
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
