import type { Meta, StoryObj } from '@storybook/react';
import { ChatButton } from '@/components/grandmother-bot/chat-button.client';

const meta = {
  title: 'Example/ChatButton',
  component: ChatButton,
} satisfies Meta<typeof ChatButton>;

export default meta;

const chatOpen = false;
const setChatOpen = () => console.log('chat open button clicked');

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    chatOpen,
    setChatOpen,
  },
};
