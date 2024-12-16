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
import { getUpdatedTags, shouldUpdateRecipe } from '@/lib/database/utils';

interface EditRecipeProps {
  recipe: RecipeFormDataWithId;
}

export interface UseEditRecipeFromFormProps {
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
    // TODO: refactor this to be less awful
    const { tags: currentTags, ...recipeDiffData } = recipeData;
    const { tags: newTags, ...newData } = data;

    // TODO: I am ignoring tag edits for now
    const { addTags, removeTags } = getUpdatedTags(
      currentTags,
      newTags ? JSON.parse(newTags) : null
    );
    if (addTags || removeTags) {
      console.log(`should update tags. Add ${addTags}. Remove ${removeTags}`);
    }

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
  const { id, imageUrl: _, ...recipeData } = recipe;
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
      />
    </div>
  );
};
