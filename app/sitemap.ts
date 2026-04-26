import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // When the site goes public, append entries for each recipe here, e.g.:
    //   const recipes = await loadAllRecipeSlugs();
    //   ...recipes.map((r) => ({
    //     url: `${SITE_URL}/recipes/${r.slug}`,
    //     lastModified: r.updatedAt,
    //     changeFrequency: 'yearly' as const,
    //     priority: 0.8,
    //   })),
  ];
};

export default sitemap;
