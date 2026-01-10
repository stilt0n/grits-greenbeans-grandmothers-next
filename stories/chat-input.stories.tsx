import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ChatInput } from '@/components/chat/chat-input.client';

const meta = {
  title: 'Chat/ChatInput',
  component: ChatInput,
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof ChatInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Ask grandmother for a recipe...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
