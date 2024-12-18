'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  RecipeForm,
  type RecipeFormProps,
} from '@/components/recipe-edit-form.client';
import { recipeUpdateAction } from '@/app/actions/form-actions';
import { recipeToFormData } from '@/lib/formUtils';
import { shouldUpdateRecipe } from '@/lib/database/utils';
import { RecipeFormData } from '@/lib/translation/schema';

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
  const [, startTransition] = useTransition();

  return (data) => {
    // TODO: refactor this to be less awful
    const { tags: currentTags, ...recipeDiffData } = recipeData;
    const { tags: newTags, ...newData } = data;

    if (!shouldUpdateRecipe(recipeDiffData, newData)) {
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
          tags: tags ? JSON.stringify(tags) : null,
          cropCoordinates: null,
          imageFileList: null,
        }}
        initialTags={initialTags}
        _hackyFeatureFlag={true}
      />
    </div>
  );
};
