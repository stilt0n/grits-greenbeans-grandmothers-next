import { z } from 'zod';

const isValidJson = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const baseRecipeSchema = z.object({
  title: z.string().min(1, 'Title cannot be blank'),
  description: z
    .string()
    .min(1, 'Description cannot be blank')
    .max(
      255,
      'Recipe descriptions are a small summary and should be kept to less than 256 characters'
    ),
  instructions: z
    .string()
    .min(1, 'Instructions cannot be blank and cannot use the default input'),
  author: z.string().nullable(),
  recipeTime: z.string().nullable(),
});

export const recipeFormSchema = baseRecipeSchema.extend({
  imageFileList: z
    .instanceof(FileList)
    .nullable()
    .refine(
      (fl) => fl == null || fl.length === 1,
      'Upload a maximum of one image'
    ),
  cropCoordinates: z
    .string()
    .nullable()
    .refine((str) => str == null || isValidJson(str)),
});

export const cropCoordinateSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const recipeSchema = baseRecipeSchema.extend({
  imageUrl: z.string().nullable(),
});

export type RecipeData = z.infer<typeof recipeSchema>;
export type RecipeFormData = z.infer<typeof recipeFormSchema>;
export type CropCoordinates = z.infer<typeof cropCoordinateSchema>;
