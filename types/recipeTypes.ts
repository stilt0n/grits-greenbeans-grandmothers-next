import { z } from 'zod';

const isValidJson = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

const Integer = z.number().transform(Math.floor);

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
  author: z.string().nullable().default(null),
  recipeTime: z.string().nullable().default(null),
});

export const recipeFormSchema = baseRecipeSchema.extend({
  imageFileList: z
    .unknown()
    .transform((value) => value as FileList | null)
    .refine(
      (fl) => fl == null || fl.length === 1,
      'Upload a maximum of one image'
    ),
  cropCoordinates: z
    .string()
    .nullable()
    .refine((str) => str == null || isValidJson(str)),
  tags: z
    .string()
    .nullable()
    .refine((str) => str == null || isValidJson(str)),
});

export const recipeFormServerSchema = baseRecipeSchema.extend({
  image: z.unknown().transform((value) => value as File | undefined),
  cropCoordinates: z
    .string()
    .nullable()
    .default(null)
    .refine((str) => str == null || isValidJson(str)),
  tags: z
    .string()
    .nullable()
    .refine((str) => str == null || isValidJson(str)),
});

export const cropCoordinateSchema = z.object({
  x: Integer,
  y: Integer,
  width: Integer,
  height: Integer,
});

export const tagsSchema = z.array(z.string());

export const recipeSchema = baseRecipeSchema.extend({
  tags: z.array(z.string()).nullable(),
  imageUrl: z.string().nullable(),
});

export type RecipeData = z.infer<typeof recipeSchema>;
export type RecipeFormData = z.infer<typeof recipeFormSchema>;
export type CropCoordinates = z.infer<typeof cropCoordinateSchema>;
export type ParsedRecipeFormData = z.infer<typeof recipeFormServerSchema>;
