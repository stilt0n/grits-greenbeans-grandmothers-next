import { notFound } from 'next/navigation';
import { loadRecipe } from '@/app/actions/load-recipe';
import { EditRecipe } from './edit-recipe.client';
import { Suspense } from 'react';

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const recipeId = parseInt(slug);
  if (Number.isNaN(recipeId)) {
    return notFound();
  }

  const recipe = await loadRecipe(recipeId);
  if (recipe === null) {
    return notFound();
  }

  return (
    <Suspense fallback='Loading...'>
      <EditRecipe recipe={{ id: recipeId, ...recipe }} />
    </Suspense>
  );
};

export default Page;
