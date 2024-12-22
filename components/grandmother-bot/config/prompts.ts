export const createPromptFromContext = (prompt: string, context?: string) => {
  if (!context) {
    return prompt;
  }
  return `USER QUESTION:\n\n${prompt}\n\nTHE USER IS VIEWING THIS RECIPE:${context}\n\n`;
};
