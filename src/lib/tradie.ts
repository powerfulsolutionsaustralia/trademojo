import { createClient } from '@/lib/supabase/server';
import { tradeCategoryLabel } from '@/lib/utils';
import type { Tradie, TradieSite, TradeCategory } from '@/types/database';

/**
 * Fetch tradie + site from Supabase by slug.
 * Returns null if not found.
 */
export async function getTradie(slug: string): Promise<{ tradie: Tradie; site: TradieSite } | null> {
  try {
    const supabase = await createClient();

    const { data: tradie, error } = await supabase
      .from('tradies')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !tradie) return null;

    const { data: site } = await supabase
      .from('tradie_sites')
      .select('*')
      .eq('tradie_id', tradie.id)
      .single();

    const tradeLabel = tradeCategoryLabel(tradie.trade_category as TradeCategory);
    const areas = (tradie.service_areas as string[]) || [];

    const defaultSite: TradieSite = {
      id: '',
      tradie_id: tradie.id,
      primary_color: '#F97316',
      secondary_color: '#1E293B',
      hero_headline: `${areas[0] || tradie.state || ''}'s Trusted ${tradeLabel}`,
      hero_subheadline: `Licensed, insured, and ready to help. Get a free, no-obligation quote from ${tradie.business_name} today.`,
      cta_text: 'Get a Free Quote',
      services_list: [
        'Emergency Repairs',
        `${tradeLabel} Installation`,
        'Maintenance & Servicing',
        'Inspections & Reports',
        'Renovations & Upgrades',
      ],
      about_text: tradie.description || `${tradie.business_name} provides quality ${tradeLabel.toLowerCase()} services.`,
      testimonials: [],
      show_booking: true,
      show_reviews: true,
      show_gallery: true,
      meta_title: `${tradie.business_name} - ${tradeLabel} in ${areas[0] || tradie.state || 'Australia'}`,
      meta_description: tradie.short_description || `Trusted ${tradeLabel.toLowerCase()} services.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mergedSite = site
      ? {
          ...defaultSite,
          ...site,
          services_list: site.services_list?.length > 0 ? site.services_list : defaultSite.services_list,
          testimonials: site.testimonials || [],
        }
      : defaultSite;

    return {
      tradie: tradie as Tradie,
      site: mergedSite,
    };
  } catch (err) {
    console.error('Error fetching tradie:', err);
    return null;
  }
}
