import { db } from '@/db';
import { recipes } from '@/db/schema';
// Rudimentary database backup. Should eventually be replaced by a real backup
// but will work okay with the current database size. Should the database need
// to be recreated the JSON file can be parsed and inserted.
const backupRecipes = async (filename = 'default.backup.json') => {
  try {
    const rows = await db.select().from(recipes);
    const jsonString = JSON.stringify({
      rows,
    });
    await Bun.write(`./local-backups/${filename}`, jsonString);
  } catch (e) {
    console.log(
      `failed to write backup, received error:\n\n${(e as any)?.message ?? String(e)}`
    );
  }
};

if (import.meta.main) {
  let filename = process.argv[2];
  if (!filename?.endsWith('.backup.json')) {
    console.log(
      'filename argument was not supplied or did not end with ".backup.json". Using "default.backup.json" as output file'
    );
    filename = 'default.backup.json';
  }
  backupRecipes(filename);
}
