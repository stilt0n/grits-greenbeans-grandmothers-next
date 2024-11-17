'use client';
import { useTransition } from 'react';
import { RecipeForm } from '@/components/recipe-edit-form.client';
import { recipeCreateAction } from '@/app/actions/form-submit';
import { useRouter } from 'next/navigation';
import { recipeToFormData } from '@/lib/formUtils';

const CreateRecipe = () => {
  const [, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Add a Recipe</h1>
      <RecipeForm
        onSubmitSuccess={(data) => {
          startTransition(async () => {
            const result = await recipeCreateAction(recipeToFormData(data));
            // if (result?.[0]?.recipeId) {
            //   router.push(`/recipes/${result[0].recipeId}`);
            // }
          });
        }}
        onSubmitError={(error) => {
          console.log('there was an error');
          console.error(error);
        }}
      />
    </div>
  );
};

export default CreateRecipe;
