import { notFound } from 'next/navigation';
import { loadRecipe } from '@/app/actions/load-recipe';
import { EditRecipe } from './edit-recipe.client';
import { unstable_noStore as noStore } from 'next/cache';
import { Suspense } from 'react';

const Page = async ({ params }: { params: { slug: string } }) => {
  noStore();
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
