import { notFound } from 'next/navigation';
import Image from 'next/image';
import { loadRecipe } from '@/app/actions/load-recipe';
import { currentUser } from '@clerk/nextjs/server';
import { hasElevatedPermissions } from '@/lib/auth';
import { DecorativeTag as Tag } from '@/components/form/decorative-tag';
import { LinkButton } from '@/components/recipe-gallery/link-button.client';
import { ClockIcon } from '@radix-ui/react-icons';
import { images } from '@/lib/constants';
import { ReactNode } from 'react';

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

  let TagArea: ReactNode = null;
  if (recipe.tags && recipe.tags.length > 0) {
    TagArea = (
      <div className='flex flex-col'>
        <h2 className='text-xl'>Tags:</h2>
        <div className='flex flex-row gap-2'>
          {recipe.tags.map((tag) => (
            <Tag text={tag} key={tag} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='prose prose-zinc mx-auto bg-zinc-50 px-4 border-x border-zinc-200 min-h-screen -mt-4 pt-4'>
        <span className='flex flex-row justify-between'>
          <h1>{recipe.title}</h1>
          {hasElevatedPermissions(user) ? (
            <LinkButton href={`/edit-recipe/${recipeId}`}>Edit</LinkButton>
          ) : null}
        </span>
        <p className='italic mt-0 mb-[2.5em]'>{recipe.description}</p>
        {recipe.author ? <p>By {recipe.author}</p> : null}
        {recipe.recipeTime ? (
          <span className='flex flex-row gap-2 items-baseline'>
            <ClockIcon />
            {recipe.recipeTime}
          </span>
        ) : null}
        <div className='relative w-[calc(100%+2rem)] pb-[calc(56.25%+1.125rem)] -mx-4'>
          <Image
            src={recipe.imageUrl ?? images.default}
            alt={recipe.title}
            fill
            className='object-cover'
          />
        </div>
        {/* HTML here is sanitized on the server-side and should be safe to set */}
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        {TagArea}
      </div>
    </>
  );
};

export default Page;
