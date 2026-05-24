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
import { toast } from 'sonner';

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
        try {
          const crop = cropCoordinateSchema.parse(
            JSON.parse(data.cropCoordinates)
          );
          processedImage = await processImageForUpload(file, crop);
        } catch (error) {
          console.error('Client image processing failed', error);
          toast.error(
            'We couldn’t process the image in your browser. Try a different image or a smaller file.'
          );
          return;
        }
      }
      const recipeId = await createRecipeAction(
        recipeToFormData(data, processedImage)
      );
      if (recipeId === undefined) {
        toast.error('Saving the recipe failed. Please try again.');
        return;
      }
      if (redirect) {
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
