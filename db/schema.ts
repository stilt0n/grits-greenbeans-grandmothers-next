import { relations, sql } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  author: text('author').default('grandmother_bot'),
  recipeTime: text('recipe_time'),
  createAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
  instructions: text('instructions').notNull(),
  imageUrl: text('image_url'),
});

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const recipesToTags = sqliteTable('recipe_tag', {
  id: integer('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id),
  tagId: integer('tag_id').references(() => tags.id),
});

export const recipeRelations = relations(recipes, ({ many }) => ({
  recipesToTags: many(recipesToTags),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  recipesToTags: many(recipesToTags),
}));

export const recipeToTagRelations = relations(recipesToTags, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipesToTags.recipeId],
    references: [recipes.id],
  }),
  tag: one(tags, {
    fields: [recipesToTags.tagId],
    references: [tags.id],
  }),
}));

export type InsertRecipe = typeof recipes.$inferInsert;
export type SelectRecipe = typeof recipes.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;
export type SelectTag = typeof tags.$inferSelect;
export type InsertRecipesToTags = typeof recipesToTags.$inferInsert;
export type SelectRecipesToTags = typeof recipesToTags.$inferSelect;
