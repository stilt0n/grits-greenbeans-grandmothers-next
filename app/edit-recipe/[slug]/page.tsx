import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditRecipe } from './edit-recipe.client';
import { unstable_noStore as noStore } from 'next/cache';
import { Suspense } from 'react';
import { loadRecipeForm } from '@/lib/loaders/load-recipe-form';
import { parseRecipeSlug } from '@/lib/seo/recipe-slug';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  noStore();
  const parsed = parseRecipeSlug(params.slug);
  if (!parsed) {
    return notFound();
  }
  const recipeId = parsed.id;

  const result = await loadRecipeForm(recipeId);
  if (result === undefined) {
    return notFound();
  }

  const { recipe, initialTags } = result;

  return (
    <Suspense fallback='Loading...'>
      <EditRecipe
        recipe={{
          id: recipeId,
          initialTags: initialTags ?? undefined,
          ...recipe,
        }}
      />
    </Suspense>
  );
};

export default Page;
