'use client';
import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from 'react-hook-form';
import {
  recipeFormSchema,
  type RecipeFormData,
  type CropCoordinates,
} from '@/types/recipeTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import EditorInput from '@/components/editor';
import ImageEditorForm, { useImageFileUrl } from '@/components/image-editor';
export interface RecipeFormProps {
  onSubmitSuccess: SubmitHandler<RecipeFormData>;
  onSubmitError: SubmitErrorHandler<RecipeFormData>;
  initialRecipeData?: RecipeFormData;
}

const blankRecipeData: RecipeFormData = {
  title: '',
  description: '',
  author: null,
  recipeTime: null,
  imageFileList: null,
  cropCoordinates: null,
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
    watch,
    formState: { errors: e },
  } = useForm({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: initialRecipeData,
  });
  const onSubmit = handleSubmit(props.onSubmitSuccess, props.onSubmitError);
  const imageFileList = watch('imageFileList');
  const imageUrl = useImageFileUrl(imageFileList);
  const onCropChange = (coords: CropCoordinates | null) => {
    console.log('setting coordinates:');
    console.log(coords);
    setValue('cropCoordinates', coords ? JSON.stringify(coords) : null);
  };
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
        <div className='flex flex-row gap-x-2 items-center'>
          <FormInput
            label='Upload Image'
            type='file'
            accept='image/*'
            {...register('imageFileList')}
          />
          <Button
            type='button'
            onClick={() => {
              setValue('imageFileList', null);
              setValue('cropCoordinates', null);
            }}
            className='self-end'
          >
            Clear
          </Button>
        </div>
        <input type='hidden' {...register('cropCoordinates')} />
        <ImageEditorForm src={imageUrl} onChange={onCropChange} />
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
