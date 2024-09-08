'use client';

import { RecipeForm } from '@/components/recipe-edit-form.client';
import { useTransition } from 'react';
import { formSubmitAction } from '@/app/actions/form-submit';

const CreateRecipe = () => {
  const [, startTransition] = useTransition();
  return (
    <div>
      <h1 className='text-3xl text-center mt-2'>Add a Recipe</h1>
      <RecipeForm
        onSubmitSuccess={(data) => {
          startTransition(() => {
            formSubmitAction(data);
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
