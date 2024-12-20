export const xor = (a: any, b: any) => !!((a || b) && !(a && b));

export const getTagOperations = (currentTags: string[], newTags: string[]) => {
  const tagsToRemove = currentTags.filter((tag) => !newTags.includes(tag));
  const tagsToAdd = newTags.filter((tag) => !currentTags.includes(tag));
  return { tagsToAdd, tagsToRemove };
};
