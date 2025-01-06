'use server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { html as dedent } from '@/lib/utils';

interface DescriptionContext {
  title: string;
  instructions: string;
}

/**
 * Creates an AI generated description for a recipe and returns the text.
 * Returns `null` if the AI fails to generate a valid recipe.
 */
export const generateDescriptionAction = async (
  context: DescriptionContext
) => {
  const systemMessage = dedent`
    You are a helpful recipe summarizer.
    
    You will be given details for a recipe.
    
    Please use these details to generate a short (160 character or less) description of the recipe.
    
    The description should accurately describe how the recipe might taste and should have a fun sounding tone.

    The recipe details will be formatted in html. The first header is the recipe title. All other content are instructions.
  `;

  const prompt = `<!-- Recipe Title -->\n<h1>${context.title}</h1>\n<!-- Recipe Instructions -->${context.instructions}\n<!-- End of Recipe -->`;

  for (let retries = 0; retries < 2; retries++) {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemMessage,
      messages: [{ role: 'user', content: prompt }],
    });
    if (result.text.length > 0 && result.text.length <= 160) {
      return result.text;
    }
  }

  return null;
};
