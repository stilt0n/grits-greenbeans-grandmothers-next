export const slugify = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
};

export const recipePath = (id: number, title: string): string => {
  const slug = slugify(title);
  return slug ? `/recipes/${slug}-${id}` : `/recipes/${id}`;
};

export const editRecipePath = (id: number, title: string): string => {
  const slug = slugify(title);
  return slug ? `/edit-recipe/${slug}-${id}` : `/edit-recipe/${id}`;
};

export interface ParsedRecipeSlug {
  id: number;
  slug: string;
}

export const parseRecipeSlug = (param: string): ParsedRecipeSlug | null => {
  const match = param.match(/^(?:(.*)-)?(\d+)$/);
  if (!match) {
    return null;
  }
  const id = parseInt(match[2], 10);
  if (Number.isNaN(id)) {
    return null;
  }
  return { id, slug: match[1] ?? '' };
};
