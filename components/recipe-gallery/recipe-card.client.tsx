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
}

export const RecipeCard = (props: RecipeCardProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const router = useRouter();
  return (
    <Card
      className='flex flex-col md:flex-row w-full h-full max-4-4xl cursor-pointer'
      onClick={() => {
        router.push(props.href);
      }}
    >
      <div className='md:w-1/2 overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg'>
        <Image
          src={props.imageUrl || images.pizza}
          placeholder='blur'
          blurDataURL={blurDataUrl}
          alt={props.title}
          width={400}
          height={400}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-6 md:p-8 flex flex-col justify-center'>
        <CardTitle id={titleId}>{props.title}</CardTitle>
        <CardDescription className='mt-2 text-zinc-500' id={descriptionId}>
          {props.description}
        </CardDescription>
        <div className='mt-4 flex gap-2'>
          <LinkButton
            href={props.href}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            Read More
          </LinkButton>
        </div>
      </div>
    </Card>
  );
};
