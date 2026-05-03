import { AsyncLocalStorage } from 'node:async_hooks';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import * as schema from '@/db/schema';

if (process.env.NODE_ENV !== 'test') {
  config({ path: '.env.local' });
}

export type Db = ReturnType<typeof drizzle<typeof schema>>;

// Exported so the test helper can call enterWith() to inject a per-test db.
// Production code must not touch this directly — use getDb() / withDb().
export const dbStorage = new AsyncLocalStorage<Db>();

let _singleton: Db | undefined;

const buildSingleton = (): Db => {
  if (process.env.NODE_ENV === 'test') {
    throw new Error(
      'getDb() fell through to the real client during tests. ' +
        'Wrap the call in withDb(testDb, ...) or use the setupTestDb() helper.'
    );
  }
  const url = process.env.TURSO_CONNECTION_URL;
  if (!url) throw new Error('TURSO_CONNECTION_URL is not set');
  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
};

export const getDb = (): Db => {
  const override = dbStorage.getStore();
  if (override) return override;
  if (!_singleton) _singleton = buildSingleton();
  return _singleton;
};

export const withDb = <T>(db: Db, fn: () => Promise<T>): Promise<T> =>
  dbStorage.run(db, fn);
