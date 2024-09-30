'use client';
import { useTransition } from 'react';
import { RecipeForm } from '@/components/recipe-edit-form.client';
import { formSubmitAction } from '@/app/actions/form-submit';
import { useRouter } from 'next/navigation';

const CreateRecipe = () => {
  const [, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Add a Recipe</h1>
      <RecipeForm
        onSubmitSuccess={(data) => {
          startTransition(async () => {
            const result = await formSubmitAction(data);
            if (result?.[0]?.recipeId) {
              router.push(`/recipes/${result[0].recipeId}`);
            }
          });
        }}
        onSubmitError={(error) => {
          console.error(error);
        }}
      />
    </div>
  );
};

export default CreateRecipe;
