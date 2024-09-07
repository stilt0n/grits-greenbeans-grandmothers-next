'use client';

import { RecipeForm } from '@/components/recipe-edit-form.client';

export default function Home() {
  return (
    <div>
      <h1 className='text-2xl text-center mt-2'>Recipe Form</h1>
      <RecipeForm
        onSubmitSuccess={(data, event) => {
          event?.preventDefault();
          console.log(data);
        }}
        onSubmitError={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
}
