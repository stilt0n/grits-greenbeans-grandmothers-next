'use client';
import { useId } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { images, blurDataUrl } from '@/lib/constants';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { LinkButton } from './link-button.client';

export interface RecipeCardProps {
  title: string;
  description: string;
  href: string;
  // Because of constrains of react-hook-form I think we need to support
  // both `null` and `undefined` here. This is sort of a pain and it might
  // be a good idea to look into if there's a way to avoid it.
  imageUrl?: string | null;
  author?: string | null;
}

export interface RecipeCardDesignProps extends RecipeCardProps {
  onClick?: () => void;
  linkDisabled?: boolean; // for storybook
}

export const RecipeCardDesign = (props: RecipeCardDesignProps) => {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <Card
      className='flex flex-col md:flex-row w-full h-full max-4-4xl cursor-pointer'
      onClick={props.onClick}
    >
      <div className='md:w-1/2 overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg'>
        <Image
          src={props.imageUrl || images.default}
          placeholder='blur'
          blurDataURL={blurDataUrl}
          alt={props.title}
          width={400}
          height={400}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-6 md:p-8 flex flex-col justify-center'>
        <CardTitle id={titleId} className='text-lg'>
          {props.title}
        </CardTitle>
        {props.author ? (
          <p className='mt-4 mb-3 text-zinc-700 text-sm'>
            Author: {props.author}
          </p>
        ) : undefined}
        <CardDescription className='mt-2 text-zinc-500' id={descriptionId}>
          {props.description}
        </CardDescription>
        <div className='mt-6 flex gap-2'>
          <LinkButton
            href={props.href}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            disabled={props.linkDisabled}
          >
            Read More
          </LinkButton>
        </div>
      </div>
    </Card>
  );
};

export const RecipeCard = (props: RecipeCardProps) => {
  const router = useRouter();
  const onClick = () => router.push(props.href);
  return <RecipeCardDesign onClick={onClick} {...props} />;
};
