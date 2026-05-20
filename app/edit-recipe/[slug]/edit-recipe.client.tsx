'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  RecipeForm,
  type RecipeFormProps,
} from '@/components/recipe-edit-form.client';
import { recipeToFormData } from '@/lib/translation/parsers';
import { cropCoordinateSchema, RecipeFormData } from '@/lib/translation/schema';
import { updateRecipeAction } from '@/lib/actions/update-recipe';
import { processImageForUpload } from '@/components/image-editor';

interface RecipeFormDataWithId extends RecipeFormData {
  id: number;
  initialTags?: string[];
}

interface EditRecipeProps {
  recipe: RecipeFormDataWithId;
}

export interface UseEditRecipeFromFormProps {
  id: number;
  recipeData: RecipeFormData;
  redirect?: string;
  dryRun?: boolean;
}

const useEditRecipeFromForm = ({
  id,
  recipeData,
  redirect = '/recipes',
  dryRun = false,
}: UseEditRecipeFromFormProps): RecipeFormProps['onSubmitSuccess'] => {
  const router = useRouter();
  const [transitioning, startTransition] = useTransition();

  return (data) => {
    if (transitioning) {
      console.log('recipe is already submitting');
      return;
    }
    startTransition(async () => {
      let processedImage: File | undefined;
      const file = data.imageFileList?.[0];
      if (file && data.cropCoordinates) {
        const crop = cropCoordinateSchema.parse(
          JSON.parse(data.cropCoordinates)
        );
        processedImage = await processImageForUpload(file, crop);
      }
      const formData = recipeToFormData(data, processedImage);
      await updateRecipeAction({ formData, id });
      router.push(`${redirect}/${id}`);
    });
  };
};

export const EditRecipe = ({ recipe }: EditRecipeProps) => {
  const { id, initialTags, ...recipeData } = recipe;
  const editRecipeFromForm = useEditRecipeFromForm({
    id,
    recipeData,
  });
  const { tags, ...initialRecipeData } = recipeData;
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Edit Recipe</h1>
      <RecipeForm
        onSubmitSuccess={editRecipeFromForm}
        onSubmitError={(error) => {
          console.error(error);
        }}
        initialRecipeData={{
          ...initialRecipeData,
          tags: tags,
          cropCoordinates: null,
          imageFileList: null,
        }}
        initialTags={initialTags}
      />
    </div>
  );
};
