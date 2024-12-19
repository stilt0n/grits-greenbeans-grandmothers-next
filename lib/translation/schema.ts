import { isValid, z } from 'zod';

const isValidCropCoordinate = (str: string) => {
  try {
    const { success } = cropCoordinateSchema.safeParse(JSON.parse(str));
    return success;
  } catch {
    return false;
  }
};

const isValidJsonArray = (str: string) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed);
  } catch {
    return false;
  }
};

const Integer = z.number().transform(Math.floor);

export const cropCoordinateSchema = z.object({
  x: Integer,
  y: Integer,
  width: Integer,
  height: Integer,
});

export const recipeFormSchema = z.object({
  title: z.string().min(1, 'Title cannot be blank'),
  description: z
    .string()
    .min(1, 'Description cannot be blank')
    .max(
      255,
      'Recipe descriptions are intended to be small and should be less than 255 characters'
    ),
  instructions: z
    .string()
    .min(1, 'Instructions cannot be blank and cannot use the default template'),
  author: z.string().nullable().default(null),
  recipeTime: z.string().nullable().default(null),
  imageFileList: z
    .unknown()
    .transform((value) => value as FileList | null)
    .refine(
      (fl) => fl === null || fl.length === 1,
      'Upload a maximum of one image'
    ),
  cropCoordinates: z
    .string()
    .nullable()
    .refine((str) => str === null || isValidCropCoordinate(str)),
  tags: z
    .string()
    .nullable()
    .refine((str) => str === null || isValidJsonArray(str)),
});

export const baseRecipeSchema = z.object({
  title: z.string().min(1, 'Title cannot be blank'),
  description: z
    .string()
    .min(1, 'Description cannot be blank')
    .max(
      255,
      'Recipe descriptions are intended to be small and should be less than 255 characters'
    ),
  instructions: z
    .string()
    .min(1, 'Instructions cannot be blank and cannot use the default template'),
  author: z.string().optional().nullable().default('unknown author'),
  recipeTime: z.string().optional().nullable(),
});

export const tagsSchema = z.array(z.string()).nullable().optional();

export const recipePageSchema = baseRecipeSchema.extend({
  imageUrl: z.string().optional().nullable(),
  tags: tagsSchema,
});

export const galleryItemSchema = recipePageSchema
  .pick({
    title: true,
    author: true,
    description: true,
    imageUrl: true,
  })
  .extend({ id: Integer });

export const intermediateSchema = baseRecipeSchema.extend({
  tags: z
    .string()
    .nullable()
    .refine((str) => str === null || isValidJsonArray(str))
    .transform((str) => {
      if (str) {
        const validatedArray = tagsSchema.parse(JSON.parse(str));
        return validatedArray;
      }
      return null;
    }),
  cropCoordinates: z
    .string()
    .nullable()
    .refine((str) => str === null || isValidCropCoordinate(str))
    .transform((str) => {
      if (str) {
        const validatedCropCoordinates = cropCoordinateSchema.parse(
          JSON.parse(str)
        );
        return validatedCropCoordinates;
      }
      return null;
    }),
  image: z.unknown().transform((value) => value as File | undefined),
});

export type RecipeFormData = z.infer<typeof recipeFormSchema>;
export type BaseRecipe = z.infer<typeof baseRecipeSchema>;
export type TagsArray = z.infer<typeof tagsSchema>;
export type RecipePageData = z.infer<typeof recipePageSchema>;
export type CropCoordinates = z.infer<typeof cropCoordinateSchema>;
export type GalleryItemData = z.infer<typeof galleryItemSchema>;
export type IntermediateRecipe = z.infer<typeof intermediateSchema>;
