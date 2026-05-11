import type { Meta, StoryObj } from '@storybook/nextjs';
import { GrandmotherBotButton } from '@/components/grandmother-bot/grandmotherbot-button.client';

const meta = {
  title: 'Example/GrandmotherBotButton',
  component: GrandmotherBotButton,
} satisfies Meta<typeof GrandmotherBotButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
