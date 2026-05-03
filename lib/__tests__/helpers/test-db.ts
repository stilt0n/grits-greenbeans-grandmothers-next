import { afterAll, beforeAll, beforeEach } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { dbStorage, type Db } from '@/db';
import * as schema from '@/db/schema';

// Registers beforeAll/beforeEach hooks that build an isolated libsql db,
// run migrations against it, and inject it into AsyncLocalStorage so that
// any getDb() call deeper in the stack resolves to the test db.
//
// We use a per-suite temp file rather than `:memory:` because libsql's
// client.transaction() opens a second connection, and `:memory:` databases
// are scoped per-connection — meaning any test exercising createRecipe /
// updateRecipe (which use db.transaction) would see an empty schema.
//
// The temp-file path is constructed locally and never reads from process.env,
// which keeps this helper as one of the safety layers preventing any test
// from accidentally reaching prod.
export const setupTestDb = () => {
  let testDb: Db;
  let client: Client | undefined;
  let tmpDir: string | undefined;

  beforeAll(async () => {
    tmpDir = mkdtempSync(join(tmpdir(), 'ggg-test-db-'));
    const url = `file:${join(tmpDir, 'test.db')}`;
    client = createClient({ url });
    testDb = drizzle(client, { schema });
    await migrate(testDb, { migrationsFolder: './migrations' });
  });

  beforeEach(() => {
    dbStorage.enterWith(testDb);
  });

  afterAll(() => {
    client?.close();
    if (tmpDir) rmSync(tmpDir, { recursive: true, force: true });
  });

  return () => testDb;
};
