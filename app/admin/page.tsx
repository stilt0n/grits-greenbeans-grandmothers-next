import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { hasAdminPermissions } from '@/lib/auth';
import { z } from 'zod';
import { getRecipes } from '@/lib/repository/recipe-store/read';
import { revalidatePath } from 'next/cache';
import { AdminActionButton } from './admin-action-button';

const invalidationSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
  })
);

const inavalidateAllCachesAction = async () => {
  'use server';
  const result = await getRecipes({ keys: ['id', 'title'] });
  const rows = invalidationSchema.parse(result);
  for (const { id, title } of rows) {
    console.log(`admin: invalidating cache for ${title} page`);
    revalidatePath(`/recipes/${id}`);
  }
  console.log('admin: finished revalidating paths');
};

const AdminStuff = async () => {
  const user = await currentUser();
  if (!hasAdminPermissions(user)) {
    return notFound();
  }

  return (
    <div className='m-auto prose prose-zinc'>
      <h1>Admin Stuff</h1>
      <AdminActionButton adminAction={inavalidateAllCachesAction}>
        Invalidate All Caches
      </AdminActionButton>
    </div>
  );
};

export default AdminStuff;
