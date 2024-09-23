import { notFound } from 'next/navigation';
import Image from 'next/image';
import { loadRecipe } from '@/app/actions/load-recipe';
import { currentUser } from '@clerk/nextjs/server';
import { hasElevatedPermissions } from '@/lib/auth';
import { LinkButton } from '@/components/recipe-gallery/link-button.client';

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

  const user = await currentUser();

  return (
    <>
      <div className='prose prose-zinc lg:prose-xl'>
        <h1>{recipe.title}</h1>
        {recipe.author ? <p>By {recipe.author}</p> : null}
        {recipe.recipeTime ? <p>Time: {recipe.recipeTime}</p> : null}
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            height={300}
            width={400}
          />
        ) : null}
        {/* HTML here is sanitized on the server-side and should be safe to set */}
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      </div>
      {hasElevatedPermissions(user) ? (
        <LinkButton href={`/edit-recipe/${recipeId}`}>Edit</LinkButton>
      ) : null}
    </>
  );
};

export default Page;
