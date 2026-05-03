'use server';

import { openai } from '@ai-sdk/openai';
import { generateText, streamText, Output, type ModelMessage } from 'ai';
import { createStreamableValue } from '@ai-sdk/rsc';
import {
  createScaledRecipePrompt,
  classifierSystemMessage,
  toolUseSystemMessage,
  scaleRecipeSystemMessage,
  baseSystemMessage,
} from './prompts';
import { scaleIngredients, recipeMathSchema } from './tools';
import { z } from 'zod';

const MAX_HISTORY = 10;

const classifyPrompt = async (messages: ModelMessage[]) => {
  const {
    output: { calculation },
  } = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({
      schema: z.object({ calculation: z.boolean() }),
    }),
    system: classifierSystemMessage,
    messages,
  });

  return calculation;
};

const extractIngredientsAndScale = async (messages: ModelMessage[]) => {
  // this should have been converted to a string before being passed to the action
  const prompt = messages.at(-1)!.content as string;
  const { output } = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({ schema: recipeMathSchema }),
    system: toolUseSystemMessage,
    prompt,
  });

  return output;
};

export const recipeChatAction = async (
  prompt: string,
  history: ModelMessage[]
) => {
  const messages = [
    ...history.slice(-MAX_HISTORY),
    { role: 'user', content: prompt } as ModelMessage,
  ];

  const stream = createStreamableValue('');

  const usesCalculation = await classifyPrompt(messages);

  if (usesCalculation) {
    const { scale, ingredients } = await extractIngredientsAndScale(messages);

    if (scale === 'unsure') {
      stream.update(
        'Sorry, it seems like you would like me to scale a recipe but I was confused by the wording of your request. Can you rephrase it for me?'
      );
      stream.done();
      return { output: stream.value };
    }

    const scaledIngredients = ingredients.map(scaleIngredients(scale));

    const streamFunction = async () => {
      const { textStream } = streamText({
        model: openai('gpt-4o-mini'),
        system: scaleRecipeSystemMessage,
        prompt: createScaledRecipePrompt(
          prompt,
          JSON.stringify(scaledIngredients)
        ),
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    };

    streamFunction();

    return { output: stream.value };
  }

  const streamFunction = async () => {
    const { textStream } = streamText({
      model: openai('gpt-4o-mini'),
      system: baseSystemMessage,
      messages,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  };

  streamFunction();

  return { output: stream.value };
};
