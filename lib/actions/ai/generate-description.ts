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
    You are a helpful recipe tagline generator.
    
    You will be given details for a family-submitted recipe.
    
    Write a short recipe tagline (no more than 20 words) for a recipe.
    The tone should be warm, homestyle, and lightly playful, like a cherished family or community cookbook. Keep it friendly, inviting, and nostalgic rather than commercial or restaurant-style.
    Recipes may come from any cuisine or region of the world. Adapt wording to fit the dish’s cultural context when appropriate, but maintain an overall family-table feel.
    Do not default to fine-dining language or trendy food marketing terms like “elevated,” “artisanal,” or “chef-inspired.” Instead, emphasize comfort, flavor, tradition, and togetherness.
    Do not repeat the recipe title. Do not include instructions. Output only one tagline sentence.
    For simple recipes, keep the tone straightforward and comforting. For layered, quirky, or potluck-style dishes, allow gentle humor or charm.
    
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
