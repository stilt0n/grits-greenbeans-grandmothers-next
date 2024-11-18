'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  RecipeForm,
  type RecipeFormProps,
} from '@/components/recipe-edit-form.client';
import { recipeUpdateAction } from '@/app/actions/form-actions';
import type { RecipeFormDataWithId } from '@/app/actions/load-recipe';
import { recipeToFormData } from '@/lib/formUtils';
import { shouldUpdateRecipe } from '@/lib/database/utils';

interface EditRecipeProps {
  recipe: RecipeFormDataWithId;
}

interface UseEditRecipeFromFormProps {
  id: number;
  recipeData: Omit<RecipeFormDataWithId, 'id' | 'imageUrl'>;
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
  const [, startTransition] = useTransition();

  return (data) => {
    if (!shouldUpdateRecipe(recipeData, data)) {
      return;
    }
    startTransition(async () => {
      const formData = recipeToFormData(data);
      await recipeUpdateAction(formData, id, dryRun);
      router.push(`${redirect}/${id}`);
    });
  };
};

export const EditRecipe = ({ recipe }: EditRecipeProps) => {
  const { id, imageUrl: _, ...recipeData } = recipe;
  const editRecipeFromForm = useEditRecipeFromForm({
    id,
    recipeData,
    dryRun: true,
  });
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Edit Recipe</h1>
      <RecipeForm
        onSubmitSuccess={editRecipeFromForm}
        onSubmitError={(error) => {
          console.error(error);
        }}
        initialRecipeData={{
          ...recipeData,
          cropCoordinates: null,
          imageFileList: null,
        }}
      />
    </div>
  );
};
