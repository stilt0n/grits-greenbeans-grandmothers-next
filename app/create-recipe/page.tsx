'use client';
import { useTransition } from 'react';
import {
  RecipeForm,
  RecipeFormProps,
} from '@/components/recipe-edit-form.client';
import { createRecipeAction } from '@/lib/actions/create-recipe';
import { useRouter } from 'next/navigation';
import { recipeToFormData } from '@/lib/translation/parsers';

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
      const recipeId = await createRecipeAction(recipeToFormData(data));
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
        _hackyFeatureFlag={true}
      />
    </div>
  );
};

export default CreateRecipe;
