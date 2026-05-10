import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';
import type { UIMessage } from 'ai';
import type { RecipePageData } from '@/lib/translation/schema';

const fixtureRecipe: RecipePageData = {
  title: 'Skillet Cornbread',
  description: 'Cast-iron cornbread, just like grandma made.',
  instructions: '<p>Heat skillet, mix batter, bake.</p>',
  author: 'grandma',
  recipeTime: '30 minutes',
  imageUrl: null,
  tags: ['southern'],
};

const userMessage = (text: string): UIMessage => ({
  id: 'm-' + text.slice(0, 8),
  role: 'user',
  parts: [{ type: 'text', text }],
});

// Captured args from the mocked streamText so tests can assert on what the
// route assembled and passed through.
type CapturedCall = {
  system: string;
  messages: unknown;
  model: unknown;
};
const captured: { last: CapturedCall | null } = { last: null };

mock.module('ai', () => {
  const actual = require('ai');
  return {
    ...actual,
    streamText: (args: CapturedCall) => {
      captured.last = args;
      return {
        toUIMessageStreamResponse: () =>
          new Response('streamed', {
            status: 200,
            headers: { 'content-type': 'text/event-stream' },
          }),
      };
    },
  };
});

mock.module('@/lib/loaders/load-recipe-page', () => ({
  loadRecipePage: async (id: number) => (id === 42 ? fixtureRecipe : undefined),
}));

const { POST } = await import('../route');

const postJson = (body: unknown, init: RequestInit = {}) =>
  new Request('http://localhost/api/grandmother-bot', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
    body: JSON.stringify(body),
    ...init,
  });

describe('POST /api/grandmother-bot', () => {
  beforeEach(() => {
    captured.last = null;
  });
  afterEach(() => {
    captured.last = null;
  });

  it('does not 401 unauthenticated callers (public endpoint)', async () => {
    const res = await POST(
      postJson({ recipeId: 42, messages: [userMessage('Hello?')] })
    );
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(200);
  });

  it('loads recipe server-side; ignores client-supplied recipe content', async () => {
    const tampered = '<h1>EVIL TAMPERED CONTENT</h1>';
    await POST(
      postJson({
        recipeId: 42,
        recipeContent: tampered,
        title: 'Hacked Title',
        messages: [userMessage('What is this recipe?')],
      })
    );

    expect(captured.last).not.toBeNull();
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
    const allMessageText = (
      captured.last!.messages as Array<{ content: unknown }>
    )
      .map((m) => flatten(m.content))
      .join('\n');

    expect(allMessageText).toContain('Skillet Cornbread');
    expect(allMessageText).not.toContain('EVIL TAMPERED CONTENT');
    expect(allMessageText).not.toContain('Hacked Title');
  });

  it('returns 400 on a malformed body', async () => {
    const res = await POST(postJson({ recipeId: 'not-a-number' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when the recipe does not exist', async () => {
    const res = await POST(
      postJson({ recipeId: 999, messages: [userMessage('hi')] })
    );
    expect(res.status).toBe(404);
  });

  it('accepts assistant messages with non-text parts and strips them before prompting', async () => {
    const res = await POST(
      postJson({
        recipeId: 42,
        messages: [
          userMessage('How long do I bake it?'),
          {
            id: 'a-1',
            role: 'assistant',
            parts: [
              { type: 'step-start' },
              { type: 'text', text: 'About 25 minutes.' },
            ],
          },
          userMessage('Thanks!'),
        ],
      })
    );

    expect(res.status).toBe(200);
    expect(captured.last).not.toBeNull();
    const serialized = JSON.stringify(captured.last!.messages);
    expect(serialized).not.toContain('step-start');
    expect(serialized).toContain('About 25 minutes.');
  });

  it('rejects malformed text parts missing the text field', async () => {
    const res = await POST(
      postJson({
        recipeId: 42,
        messages: [
          {
            id: 'm-bad',
            role: 'user',
            parts: [{ type: 'text' }],
          },
        ],
      })
    );
    expect(res.status).toBe(400);
  });

  it('passes the assembled system prompt and messages to streamText', async () => {
    await POST(
      postJson({ recipeId: 42, messages: [userMessage('Tell me about it.')] })
    );
    expect(captured.last?.system).toContain('grandmother_bot');
    expect(Array.isArray(captured.last?.messages)).toBe(true);
  });
});
