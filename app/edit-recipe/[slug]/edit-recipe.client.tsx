'use client';
import { useTransition } from 'react';
import { RecipeForm } from '@/components/recipe-edit-form.client';
import { recipeUpdateAction } from '@/app/actions/form-submit';
import { getUpdatedRecipeFields } from '@/lib/database/utils';
import type { RecipeFormDataWithId } from '@/app/actions/load-recipe';

interface EditRecipeProps {
  recipe: RecipeFormDataWithId;
}

export const EditRecipe = ({ recipe }: EditRecipeProps) => {
  const [, startTransition] = useTransition();
  const { id, ...recipeData } = recipe;
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Edit Recipe</h1>
      <RecipeForm
        onSubmitSuccess={(data) => {
          const updatedFields = getUpdatedRecipeFields(recipeData, data);
          startTransition(() => {
            if (Object.keys(updatedFields).length !== 0) {
              recipeUpdateAction(updatedFields, id);
            }
          });
        }}
        onSubmitError={(error) => {
          console.error(error);
        }}
        initialRecipeData={recipeData}
      />
    </div>
  );
};
