import { describe, it, expect } from 'bun:test';
import type { UIMessage } from 'ai';
import { buildChatPrompt, GRANDMOTHER_SYSTEM_PROMPT } from '../prompt';
import type { RecipePageData } from '@/lib/translation/schema';

const fixtureRecipe: RecipePageData = {
  title: 'Skillet Cornbread',
  description: 'Cast-iron cornbread, just like grandma made.',
  instructions:
    '<ol><li>Heat the skillet.</li><li>Mix the batter.</li><li>Bake at 425°F for 20 minutes.</li></ol>',
  author: 'grandma',
  recipeTime: '30 minutes',
  imageUrl: null,
  tags: ['southern', 'baking'],
};

const uiMessage = (
  role: 'user' | 'assistant',
  text: string,
  id = role + '-' + text.slice(0, 6)
): UIMessage => ({
  id,
  role,
  parts: [{ type: 'text', text }],
});

describe('buildChatPrompt', () => {
  it('uses the grandmother system prompt verbatim', async () => {
    const { system } = await buildChatPrompt({
      recipe: fixtureRecipe,
      messages: [uiMessage('user', 'What does this recipe make?')],
    });
    expect(system).toBe(GRANDMOTHER_SYSTEM_PROMPT);
  });

  it('matches the snapshot for a fixture recipe + single user turn', async () => {
    const result = await buildChatPrompt({
      recipe: fixtureRecipe,
      messages: [uiMessage('user', 'Can I substitute buttermilk?')],
    });
    expect(result).toMatchSnapshot();
  });

  it('preserves prior assistant turns and only augments the latest user message', async () => {
    const result = await buildChatPrompt({
      recipe: fixtureRecipe,
      messages: [
        uiMessage('user', 'How long does it bake?'),
        uiMessage('assistant', 'About 20 minutes at 425°F.'),
        uiMessage('user', 'Can I use a smaller pan?'),
      ],
    });

    const flatten = (content: unknown): string =>
      typeof content === 'string'
        ? content
        : Array.isArray(content)
          ? content
              .map((p) =>
                p && typeof p === 'object' && 'text' in p
                  ? String((p as { text: string }).text)
                  : ''
              )
              .join('')
          : '';

    expect(result.messages).toHaveLength(3);
    expect(result.messages[0]?.role).toBe('user');
    expect(result.messages[1]?.role).toBe('assistant');
    expect(flatten(result.messages[1]?.content)).toBe(
      'About 20 minutes at 425°F.'
    );

    const last = result.messages[2];
    expect(last?.role).toBe('user');
    expect(flatten(last?.content)).toContain('Can I use a smaller pan?');
    expect(flatten(last?.content)).toContain('Skillet Cornbread');
  });

  it('caps history at MAX_HISTORY (10) latest messages', async () => {
    const messages: UIMessage[] = [];
    for (let i = 0; i < 15; i++) {
      messages.push(
        uiMessage(i % 2 === 0 ? 'user' : 'assistant', 'turn ' + i, 'm-' + i)
      );
    }
    const result = await buildChatPrompt({ recipe: fixtureRecipe, messages });
    expect(result.messages).toHaveLength(10);
    // Latest user turn (index 14) must still be present and augmented.
    const last = result.messages.at(-1);
    const lastText =
      typeof last?.content === 'string'
        ? last.content
        : Array.isArray(last?.content)
          ? last.content
              .map((p) =>
                p && typeof p === 'object' && 'text' in p
                  ? String((p as { text: string }).text)
                  : ''
              )
              .join('')
          : '';
    expect(lastText).toContain('turn 14');
  });
});
