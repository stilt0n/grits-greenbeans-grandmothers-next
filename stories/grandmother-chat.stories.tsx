import type { Meta, StoryObj } from '@storybook/nextjs';
import type { UIMessage } from 'ai';
import { Chat } from '@/components/grandmother-bot/chat.client';

const meta = {
  title: 'GrandmotherBot/Chat',
  component: Chat,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '480px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

const seeded: UIMessage[] = [
  {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'Can I swap buttermilk for regular milk?' }],
  },
  {
    id: '2',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'You can — but you’ll lose the tang and a little of the lift.\n\nA quick stand-in: stir **1 tablespoon of lemon juice or white vinegar** into a cup of milk and let it sit five minutes. It curdles slightly, and that acidity is what your batter is really after.',
      },
    ],
  },
];

export const Empty: Story = {
  args: {
    className: 'h-full rounded-lg border',
  },
};

export const SeededHistory: Story = {
  args: {
    className: 'h-full rounded-lg border',
    initialMessages: seeded,
  },
};
