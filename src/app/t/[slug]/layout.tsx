import { notFound } from 'next/navigation';
import { getTradie } from '@/lib/tradie';
import type { Metadata } from 'next';
import { generateTradieMetadata } from '@/lib/seo';
import TradieSiteShell from '@/components/tradie-site/TradieSiteShell';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getTradie(slug);
  if (!result) return { title: 'Not Found' };
  return generateTradieMetadata(result.tradie);
}

export default async function TradieSiteLayout({ params, children }: Props) {
  const { slug } = await params;
  const result = await getTradie(slug);

  if (!result) notFound();

  const { tradie, site } = result;
  const color = site?.primary_color || '#F97316';

  return (
    <TradieSiteShell tradie={tradie} site={site} color={color}>
      {children}
    </TradieSiteShell>
  );
}
