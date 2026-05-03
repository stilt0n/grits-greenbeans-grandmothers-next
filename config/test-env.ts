// Independent safety net: physically remove the prod URL/token from this
// process's environment before any test code runs. Combined with the
// NODE_ENV !== 'test' guard around dotenv loading in db/index.ts, this
// ensures no test can construct a real libsql client.
delete process.env.TURSO_CONNECTION_URL;
delete process.env.TURSO_AUTH_TOKEN;
