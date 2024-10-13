import { notFound } from 'next/navigation';
import Image from 'next/image';
import { loadRecipe } from '@/app/actions/load-recipe';
import { currentUser } from '@clerk/nextjs/server';
import { hasElevatedPermissions } from '@/lib/auth';
import { LinkButton } from '@/components/recipe-gallery/link-button.client';
import { ClockIcon } from '@radix-ui/react-icons';

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
      <div className='prose prose-zinc mx-auto bg-zinc-50 px-4 border-x border-zinc-200 min-h-screen -mt-4 pt-4'>
        <span className='flex flex-row justify-between'>
          <h1>{recipe.title}</h1>
          {hasElevatedPermissions(user) ? (
            <LinkButton href={`/edit-recipe/${recipeId}`}>Edit</LinkButton>
          ) : null}
        </span>
        {recipe.author ? <p>By {recipe.author}</p> : null}
        {recipe.recipeTime ? (
          <span className='flex flex-row gap-2 items-baseline'>
            <ClockIcon />
            {recipe.recipeTime}
          </span>
        ) : null}
        {recipe.imageUrl ? (
          <div className='relative h-96 w-[calc(100%+2rem)] -mx-4'>
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className='object-cover'
            />
          </div>
        ) : null}
        {/* HTML here is sanitized on the server-side and should be safe to set */}
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      </div>
    </>
  );
};

export default Page;
