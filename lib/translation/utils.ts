import { z } from 'zod';

export const getTagsUtilitySchema = z
  .array(
    z.object({
      id: z.number(),
      tags: z.array(z.string()).nullable().optional(),
    })
  )
  .max(
    1,
    'Invariant: queries using an id should only return one row because ids are unique. If you are seeing this there is a bug.'
  );

export type GetTagsReturnType = z.infer<typeof getTagsUtilitySchema>;
