import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import EditorInput from '@/components/editor/editor-input.client';

const meta = {
  title: 'Example/EditorInput',
  component: EditorInput,
  args: {
    label: 'Recipe',
    menuAriaLabel: 'Editor menu',
    onChange: fn(),
  },
} satisfies Meta<typeof EditorInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInitialContent: Story = {
  args: {
    initialContent: `
      <h2>Ingredients</h2>
      <ul>
        <li>2 cups flour</li>
        <li>1 cup sugar</li>
      </ul>
      <h2>Instructions</h2>
      <ol>
        <li>Mix the dry ingredients.</li>
        <li>Add the wet ingredients.</li>
      </ol>
    `,
  },
};
