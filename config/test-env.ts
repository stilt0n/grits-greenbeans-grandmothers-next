// Independent safety net: physically remove the prod URL/token from this
// process's environment before any test code runs. Even if every other defense
// in db/index.ts fails, no test can construct a real libsql client.
delete process.env.TURSO_CONNECTION_URL;
delete process.env.TURSO_AUTH_TOKEN;
