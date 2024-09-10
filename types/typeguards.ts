// typesafe way to get environment variables
export const requireEnv = <T extends string>(
  ...keys: T[]
): { [K in T]: string } => {
  const env: { [K in T]: string } = {} as { [K in T]: string };
  for (const key of keys) {
    if (typeof process.env[key] !== 'string') {
      throw new Error(
        `Invariant failed: no environment variable for '${key}' was defined.`
      );
    }
    env[key] = process.env[key];
  }
  return env;
};
