import type { Meta, StoryObj } from '@storybook/react';
import { ChatButton } from '@/components/grandmother-bot/chat-button.client';

const meta = {
  title: 'Example/ChatButton',
  component: ChatButton,
} satisfies Meta<typeof ChatButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
