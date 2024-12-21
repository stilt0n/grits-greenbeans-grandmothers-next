import type { Meta, StoryObj } from '@storybook/react';
import { RecipeCardDesign } from '@/components/recipe-gallery/recipe-card.client';
import { images } from '@/lib/constants';

const meta = {
  title: 'Example/RecipeCard',
  component: RecipeCardDesign,
} satisfies Meta<typeof RecipeCardDesign>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ShortDescription: Story = {
  args: {
    title: 'Example Card',
    description: 'This card has a short description',
    href: '',
    imageUrl: images.grits,
    author: 'grandmother_bot',
    linkDisabled: true,
    onClick: () => {
      console.log('card clicked');
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/recipes',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    title: 'Card with long description',
    description:
      'The pasta was smooth and practical, the fruit was sweet and carefree. They knew it was a scandalous match, but they couldn’t help themselves! They eloped right then and there, and now, here they are—living their best, rebellious life in this salad.',
    href: '',
    imageUrl: images.grits,
    author: 'grandmother_bot',
    linkDisabled: true,
    onClick: () => {
      console.log('card clicked');
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/recipes',
      },
    },
  },
};
