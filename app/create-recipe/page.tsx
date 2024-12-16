'use client';
import { useTransition } from 'react';
import {
  RecipeForm,
  RecipeFormProps,
} from '@/components/recipe-edit-form.client';
import { recipeCreateAction } from '@/app/actions/form-actions';
import { useRouter } from 'next/navigation';
import { recipeToFormData } from '@/lib/formUtils';

interface UseCreateRecipeFromFormProps {
  redirect?: string;
  dryRun?: boolean;
}

const useCreateRecipeFromForm = ({
  redirect = '/recipes',
  dryRun = false,
}: UseCreateRecipeFromFormProps = {}): RecipeFormProps['onSubmitSuccess'] => {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (data) => {
    startTransition(async () => {
      const recipeId = await recipeCreateAction(recipeToFormData(data), dryRun);
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
