'use server';

import { openai } from '@ai-sdk/openai';
import { generateObject, streamText, type CoreMessage } from 'ai';
import { createStreamableValue } from 'ai/rsc';
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

const classifyPrompt = async (messages: CoreMessage[]) => {
  const {
    object: { calculation },
  } = await generateObject({
    model: openai('gpt-4o-mini'),
    output: 'object',
    schema: z.object({ calculation: z.boolean() }),
    system: classifierSystemMessage,
    messages: messages,
  });

  return calculation;
};

const extractIngredientsAndScale = async (messages: CoreMessage[]) => {
  // this should have been converted to a string before being passed to the action
  const prompt = messages.at(-1)!.content as string;
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    output: 'object',
    schema: recipeMathSchema,
    system: toolUseSystemMessage,
    prompt,
  });

  return object;
};

export const recipeChatAction = async (
  prompt: string,
  history: CoreMessage[]
) => {
  const messages = [
    ...history.slice(-MAX_HISTORY),
    { role: 'user', content: prompt } as CoreMessage,
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
