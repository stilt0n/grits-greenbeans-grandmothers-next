import { db } from '@/db';
import { recipes } from '@/db/schema';
// Rudimentary database backup. Should eventually be replaced by a real backup
// but will work okay with the current database size. Should the database need
// to be recreated the JSON file can be parsed and inserted.
const backupRecipes = async () => {
  try {
    const rows = await db.select().from(recipes);
    const jsonString = JSON.stringify({
      rows,
    });
    await Bun.write('./local-backups/recipes.backup.json', jsonString);
  } catch (e) {
    console.log(
      `failed to write backup, received error:\n\n${(e as any)?.message ?? String(e)}`
    );
  }
};

if (import.meta.main) {
  backupRecipes();
}
