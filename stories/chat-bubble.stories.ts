import type { Meta, StoryObj } from '@storybook/react';
import { ChatBubble } from '@/components/chat/chat-bubble';

const meta = {
  title: 'Chat/ChatBubble',
  component: ChatBubble,
} satisfies Meta<typeof ChatBubble>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    role: 'user',
    content: 'Hello! How are you today?',
  },
};

export const AssistantMessage: Story = {
  args: {
    role: 'assistant',
    content: "I'm doing great, thank you for asking! How can I help you today?",
  },
};

export const LongUserMessage: Story = {
  args: {
    role: 'user',
    content:
      'This is a much longer message that demonstrates how the chat bubble handles text that spans multiple lines. It should wrap nicely within the bubble and maintain proper padding and styling throughout.',
  },
};

export const LongAssistantMessage: Story = {
  args: {
    role: 'assistant',
    content:
      "That's a great question! Let me explain in detail. The chat bubble component is designed to handle messages of varying lengths gracefully. It uses a maximum width constraint to ensure readability while allowing the text to flow naturally across multiple lines when needed.",
  },
};
