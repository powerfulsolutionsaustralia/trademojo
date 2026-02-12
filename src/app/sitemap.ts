import type { MetadataRoute } from 'next';
import { TRADE_CATEGORIES } from '@/lib/utils';

// Major Australian cities for SEO
const MAJOR_CITIES = [
  'sydney',
  'melbourne',
  'brisbane',
  'perth',
  'adelaide',
  'gold-coast',
  'canberra',
  'newcastle',
  'sunshine-coast',
  'wollongong',
  'hobart',
  'geelong',
  'townsville',
  'cairns',
  'darwin',
  'toowoomba',
  'ballarat',
  'bendigo',
  'mackay',
  'rockhampton',
  'launceston',
  'bundaberg',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trademojo.com.au';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/for-tradies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Trade category pages (e.g., /plumber, /electrician)
  const tradePages: MetadataRoute.Sitemap = TRADE_CATEGORIES.filter(
    (t) => t !== 'other'
  ).map((trade) => ({
    url: `${baseUrl}/${trade}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Trade + Location combo pages (the SEO goldmine)
  // e.g., /plumber/brisbane, /electrician/sydney
  const tradeLocationPages: MetadataRoute.Sitemap = [];
  for (const trade of TRADE_CATEGORIES.filter((t) => t !== 'other')) {
    for (const city of MAJOR_CITIES) {
      tradeLocationPages.push({
        url: `${baseUrl}/${trade}/${city}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }
  }

  // Location pages
  const locationPages: MetadataRoute.Sitemap = MAJOR_CITIES.map((city) => ({
    url: `${baseUrl}/location/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // TODO: Add dynamic tradie pages from Supabase
  // const { data: tradies } = await supabase.from('tradies').select('slug, updated_at').eq('is_active', true);
  // const tradiePages = tradies?.map(t => ({ url: `${baseUrl}/t/${t.slug}`, lastModified: t.updated_at })) || [];

  return [
    ...staticPages,
    ...tradePages,
    ...tradeLocationPages,
    ...locationPages,
  ];
}
