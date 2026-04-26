import { clerkSetup } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';
import { requireEnv } from '@/types/typeguards';

setup('global setup', async ({}) => {
  await clerkSetup();
  requireEnv('E2E_CLERK_USER_USERNAME', 'E2E_CLERK_USER_PASSWORD');
});
