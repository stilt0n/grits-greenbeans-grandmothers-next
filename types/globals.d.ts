export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: string;
    };
  }

  interface UserPublicMetadata {
    role?: string;
  }
}
