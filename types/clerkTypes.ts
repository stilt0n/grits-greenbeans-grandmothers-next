import { useUser } from '@clerk/nextjs';

/**
 * useUser's returned `user` is of type `UserResource` but this
 * does not seem to be part of Clerk's public API. This extracts
 * that type so it can be used elsewhere.
 */
export type ClientUser = NonNullable<ReturnType<typeof useUser>['user']>;
