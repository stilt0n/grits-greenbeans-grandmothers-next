import type { Meta, StoryObj } from '@storybook/react';
import { Chat } from '@/components/chat/Chat.client';

const meta = {
  title: 'Chat/Chat',
  component: Chat,
  decorators: [
    (Story) => (
      <div style={{ height: '400px', width: '100%', maxWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Chat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    messages: [],
    className: 'h-full border border-zinc-200 rounded-lg',
  },
};

export const SingleMessage: Story = {
  args: {
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Hello!',
      },
    ],
    className: 'h-full border border-zinc-200 rounded-lg',
  },
};

export const Conversation: Story = {
  args: {
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Hi there! Can you help me with a recipe?',
      },
      {
        id: '2',
        role: 'assistant',
        content:
          "Of course! I'd be happy to help you with a recipe. What kind of dish are you looking to make?",
      },
      {
        id: '3',
        role: 'user',
        content: "I'm thinking of making some southern-style green beans.",
      },
      {
        id: '4',
        role: 'assistant',
        content:
          "Southern-style green beans are delicious! Here's what you'll need: fresh green beans, bacon, onion, chicken broth, and some seasonings. Would you like the full recipe?",
      },
      {
        id: '5',
        role: 'user',
        content: 'Yes please!',
      },
    ],
    className: 'h-full border border-zinc-200 rounded-lg',
  },
};

export const LongConversation: Story = {
  args: {
    messages: [
      { id: '1', role: 'user', content: 'What are grits?' },
      {
        id: '2',
        role: 'assistant',
        content:
          'Grits are a Southern American dish made from ground corn (maize) that is boiled and often served as a breakfast side dish or as a base for savory meals.',
      },
      { id: '3', role: 'user', content: 'How do you cook them?' },
      {
        id: '4',
        role: 'assistant',
        content:
          "To cook grits: Bring 4 cups of water (or a mix of water and milk) to a boil. Add 1 cup of grits slowly while stirring. Reduce heat and simmer for 15-20 minutes, stirring occasionally. Season with salt, butter, and cheese if desired.",
      },
      { id: '5', role: 'user', content: 'What do you serve them with?' },
      {
        id: '6',
        role: 'assistant',
        content:
          'Grits are incredibly versatile! They pair well with shrimp (shrimp and grits is a classic), fried eggs, bacon, sausage, or as a creamy side dish for any Southern meal.',
      },
      { id: '7', role: 'user', content: 'That sounds amazing!' },
      {
        id: '8',
        role: 'assistant',
        content:
          "It really is! Grits are comfort food at its finest. If you're new to grits, I'd recommend starting with cheese grits - they're rich, creamy, and absolutely delicious.",
      },
    ],
    className: 'h-full border border-zinc-200 rounded-lg',
  },
};
