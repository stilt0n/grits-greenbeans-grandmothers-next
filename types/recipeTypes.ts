import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string().min(1, 'Title cannot be blank!'),
  instructions: z
    .string()
    .min(1, 'Instructions cannot be blank and cannot use the default input'),
  author: z.string().optional(),
  imageUrl: z.string().optional(),
  recipeTime: z.string().optional(),
});

export type RecipeData = z.infer<typeof recipeSchema>;
