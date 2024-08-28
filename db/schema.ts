import { sql } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').default('grandmother_bot'),
  recipeTime: text('recipe_time'),
  createAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
  instructions: text('instructions').notNull(),
});

export type InsertRecipe = typeof recipes.$inferInsert;
export type SelectRecipe = typeof recipes.$inferSelect;