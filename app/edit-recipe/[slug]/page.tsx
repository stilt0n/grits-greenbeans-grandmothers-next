import { notFound } from 'next/navigation';
import { EditRecipe } from './edit-recipe.client';
import { unstable_noStore as noStore } from 'next/cache';
import { Suspense } from 'react';
import { loadRecipeFormAction } from '@/lib/actions/load-edit-page';

const Page = async ({ params }: { params: { slug: string } }) => {
  noStore();
  const { slug } = params;
  const recipeId = parseInt(slug);
  if (Number.isNaN(recipeId)) {
    return notFound();
  }

  const result = await loadRecipeFormAction(recipeId);
  if (result === undefined) {
    return notFound();
  }

  const { recipe, initialTags } = result;

  return (
    <Suspense fallback='Loading...'>
      <EditRecipe recipe={{ id: recipeId, initialTags, ...recipe }} />
    </Suspense>
  );
};

export default Page;
