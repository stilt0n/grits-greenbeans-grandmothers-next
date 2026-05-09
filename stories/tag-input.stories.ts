import type { Meta, StoryObj } from '@storybook/nextjs';
import { TagInput } from '@/components/form/tag-input.client';

const meta = {
  title: 'Example/TagInput',
  component: TagInput,
} satisfies Meta<typeof TagInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Example',
  },
};
