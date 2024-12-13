import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '@/components/form/tag.client';

const meta = {
  title: 'Example/Tag',
  component: Tag,
} satisfies Meta<typeof Tag>;

export default meta;

const onClose = () => {
  console.log('close button clicked');
};

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'example tag',
    onClose,
  },
};

export const LongTag: Story = {
  args: {
    text: 'This is a super long tag and it should be truncated with a tooltip because otherwise it will be too long!',
    onClose,
  },
};
