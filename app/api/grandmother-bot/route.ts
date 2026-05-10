import { openai } from '@ai-sdk/openai';
import { stepCountIs, streamText, type UIMessage } from 'ai';
import { z } from 'zod';
import { loadRecipePage } from '@/lib/loaders/load-recipe-page';
import { buildChatPrompt } from '@/lib/ai/prompt';
import { CHAT_MODEL_ID } from '@/lib/ai/model';
import { recipeMathTools } from '@/lib/ai/tools';

export const runtime = 'nodejs';

const textPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

// Assistant messages from useChat (AI SDK v6) include non-text parts such as
// `step-start` alongside text parts. We only need to validate that *some* text
// is present; convertToModelMessages handles the other part types.
const messagePartSchema = z.union([
  textPartSchema,
  z.object({ type: z.string() }).passthrough(),
]);

const uiMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  parts: z
    .array(messagePartSchema)
    .min(1)
    .refine((parts) => parts.some((part) => part.type === 'text'), {
      message: 'message must contain at least one text part',
    }),
});

const requestSchema = z.object({
  recipeId: z.number().int().positive(),
  messages: z.array(uiMessageSchema).min(1),
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

  // Project to a structurally-valid UIMessage[] by keeping only text parts.
  // Non-text parts (e.g. `step-start` on prior assistant turns) are validated
  // at the boundary but discarded here — the prompt builder only needs text.
  const uiMessages: UIMessage[] = messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: message.parts.filter(
      (part): part is { type: 'text'; text: string } => part.type === 'text'
    ),
  }));

  const { system, messages: modelMessages } = await buildChatPrompt({
    recipe,
    messages: uiMessages,
  });

  const result = streamText({
    model: openai(CHAT_MODEL_ID),
    system,
    messages: modelMessages,
    tools: recipeMathTools,
    stopWhen: stepCountIs(3),
    abortSignal: request.signal,
  });

  return result.toUIMessageStreamResponse();
};
