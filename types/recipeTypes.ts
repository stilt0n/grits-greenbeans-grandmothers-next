import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string().min(1, 'Title cannot be blank!'),
  description: z
    .string()
    .min(1, 'Description cannot be blank')
    .max(
      255,
      'Recipe descriptions are a small summary and should be kept to less than 256 characters.'
    ),
  instructions: z
    .string()
    .min(1, 'Instructions cannot be blank and cannot use the default input'),
  // use nullable instead of optional here because RHF does not support undefined as a default type
  // but we do not want to insert empty strings into the recipes table when we perform the db op
  author: z.string().nullable(),
  imageUrl: z.string().nullable(),
  recipeTime: z.string().nullable(),
});

export type RecipeData = z.infer<typeof recipeSchema>;
