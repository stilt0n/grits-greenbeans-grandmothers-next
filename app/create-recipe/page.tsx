'use client';
import { useTransition } from 'react';
import {
  RecipeForm,
  RecipeFormProps,
} from '@/components/recipe-edit-form.client';
import { createRecipeAction } from '@/lib/actions/create-recipe';
import { useRouter } from 'next/navigation';
import { recipeToFormData } from '@/lib/translation/parsers';
import { processImageForUpload } from '@/components/image-editor';
import { cropCoordinateSchema } from '@/lib/translation/schema';

interface UseCreateRecipeFromFormProps {
  redirect?: string;
}

const useCreateRecipeFromForm = ({
  redirect = '/recipes',
}: UseCreateRecipeFromFormProps = {}): RecipeFormProps['onSubmitSuccess'] => {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (data) => {
    startTransition(async () => {
      let processedImage: File | undefined;
      const file = data.imageFileList?.[0];
      if (file && data.cropCoordinates) {
        const crop = cropCoordinateSchema.parse(
          JSON.parse(data.cropCoordinates)
        );
        processedImage = await processImageForUpload(file, crop);
      }
      const recipeId = await createRecipeAction(
        recipeToFormData(data, processedImage)
      );
      if (redirect && recipeId !== undefined) {
        router.push(`${redirect}/${recipeId}`);
      }
    });
  };
};

const CreateRecipe = () => {
  const createRecipeFromForm = useCreateRecipeFromForm();
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Add a Recipe</h1>
      <RecipeForm
        onSubmitSuccess={createRecipeFromForm}
        onSubmitError={(error) => {
          console.log('there was an error');
          console.error(error);
        }}
      />
    </div>
  );
};

export default CreateRecipe;
