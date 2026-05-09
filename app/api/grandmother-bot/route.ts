import { openai } from '@ai-sdk/openai';
import { streamText, type UIMessage } from 'ai';
import { z } from 'zod';
import { loadRecipePage } from '@/lib/loaders/load-recipe-page';
import { buildChatPrompt } from '@/lib/ai/prompt';
import { CHAT_MODEL_ID } from '@/lib/ai/model';

export const runtime = 'nodejs';

const requestSchema = z.object({
  recipeId: z.number().int().positive(),
  messages: z.array(z.custom<UIMessage>()).min(1),
});

export const POST = async (request: Request) => {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return new Response('Invalid request', { status: 400 });
  }

  const { recipeId, messages } = parsed.data;

  const recipe = await loadRecipePage(recipeId);
  if (!recipe) {
    return new Response('Recipe not found', { status: 404 });
  }

  const { system, messages: modelMessages } = await buildChatPrompt({
    recipe,
    messages,
  });

  const result = streamText({
    model: openai(CHAT_MODEL_ID),
    system,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
};
