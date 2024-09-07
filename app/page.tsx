'use client';

import { RecipeForm } from '@/components/recipe-edit-form.client';
import { useTransition } from 'react';
import { formSubmitAction } from '@/app/actions/form-submit';

export default function Home() {
  const [, startTransition] = useTransition();
  return (
    <div>
      <h1 className='text-2xl text-center mt-2'>Recipe Form</h1>
      <RecipeForm
        onSubmitSuccess={(data) => {
          console.log(data);
          startTransition(() => {
            formSubmitAction(data);
          });
        }}
        onSubmitError={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
}
