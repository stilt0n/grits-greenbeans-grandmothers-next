// Throwaway smoke test for AI SDK 6 + OpenAI mini model.
// Confirms streamText works against the model id we plan to use in the
// grandmother-bot route handler. Safe to delete once Milestone 5 is wired.
//
// Run: bun run scripts/ai-smoke.ts [model-id]

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const modelId = process.argv[2] ?? 'gpt-5.4-mini';

const main = async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set. Add it to .env.local.');
    process.exit(1);
  }

  console.log(`> model: ${modelId}`);
  console.log('> streaming...\n');

  const result = streamText({
    model: openai(modelId),
    prompt:
      'In one short sentence, name a classic Southern green bean dish a grandmother might make.',
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }

  process.stdout.write('\n\n');
  const usage = await result.usage;
  console.log('> usage:', usage);
};

main().catch((err) => {
  console.error('\n[ai-smoke] failed:', err);
  process.exit(1);
});
