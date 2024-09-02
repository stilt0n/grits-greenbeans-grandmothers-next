import { defineConfig } from 'drizzle-kit';
// bun supports environment variables without .env
// but some of the tools in the ecosystem still
// rely on node, so this appears to still be necessary
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  schema: './db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
