import { scaleRecipeTool } from './scale-recipe';
import { simplifyUnitsTool } from './simplify-units';
import { solveForIngredientTool } from './solve-for-ingredient';

export const recipeMathTools = {
  scaleRecipe: scaleRecipeTool,
  simplifyUnits: simplifyUnitsTool,
  solveForIngredient: solveForIngredientTool,
};

export type RecipeMathToolName = keyof typeof recipeMathTools;
