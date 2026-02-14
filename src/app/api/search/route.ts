import { NextResponse } from 'next/server';
import { searchPlacesWithDetails, placeToDirectoryListing } from '@/lib/google-places';
import { createAdminClient } from '@/lib/supabase/admin';
import type { TradeCategory } from '@/types/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trade = searchParams.get('trade') as TradeCategory;
  const location = searchParams.get('location') || '';
  const state = searchParams.get('state') || '';

  if (!trade && !location) {
    return NextResponse.json({ error: 'Trade or location is required' }, { status: 400 });
  }

  try {
    // 1. Query registered TradeMojo businesses first (from Supabase)
    let registeredListings: Array<{
      place_id: string;
      business_name: string;
      formatted_address: string;
      trade_category: TradeCategory;
      suburb: string;
      state: string;
      postcode: string;
      rating: number;
      review_count: number;
      phone: string;
      website: string;
      is_open?: boolean;
      photo_reference: string | null;
      reviews?: Array<{ author: string; rating: number; text: string; time: string }>;
      lat: number;
      lng: number;
      is_registered: boolean;
      plan_tier?: string;
      slug?: string;
    }> = [];

    try {
      const supabase = createAdminClient();
      let query = supabase
        .from('tradies')
        .select('*')
        .eq('is_active', true)
        .eq('is_approved', true);

      if (trade) query = query.eq('trade_category', trade);
      if (state) query = query.eq('state', state);

      // Location matching: check service_areas array or postcode
      if (location && location !== 'Australia') {
        query = query.or(`service_areas.cs.{${location}},postcode.eq.${location}`);
      }

      query = query
        .order('is_featured', { ascending: false })
        .order('plan_tier', { ascending: true })
        .order('average_rating', { ascending: false, nullsFirst: false })
        .limit(10);

      const { data: tradies } = await query;

      if (tradies && tradies.length > 0) {
        registeredListings = tradies.map((t) => ({
          place_id: `tm_${t.id}`,
          business_name: t.business_name,
          formatted_address: `${(t.service_areas || []).join(', ')}, ${t.state}`,
          trade_category: t.trade_category as TradeCategory,
          suburb: t.service_areas?.[0] || '',
          state: t.state,
          postcode: t.postcode || '',
          rating: t.average_rating || 0,
          review_count: t.review_count || 0,
          phone: t.phone,
          website: t.slug ? `https://trademojo.com.au/t/${t.slug}` : '',
          photo_reference: null,
          lat: 0,
          lng: 0,
          is_registered: true,
          plan_tier: t.plan_tier,
          slug: t.slug,
        }));
      }
    } catch (err) {
      // Supabase query failed — continue with Google results only
      console.error('Supabase search error (continuing with Google):', err);
    }

    // 2. Fetch Google Places results
    const places = await searchPlacesWithDetails(
      trade || 'handyman',
      location || 'Australia',
      state,
      20
    );

    const googleListings = places.map((p) => ({
      ...placeToDirectoryListing(p, trade || 'other'),
      is_registered: false,
      plan_tier: undefined,
      slug: undefined,
    }));

    // 3. Deduplicate: if a registered business also shows in Google, remove the Google one
    const registeredNames = new Set(
      registeredListings.map((r) => r.business_name.toLowerCase().trim())
    );
    const filteredGoogle = googleListings.filter(
      (g) => !registeredNames.has(g.business_name.toLowerCase().trim())
    );

    // 4. Merge: registered first, then Google
    const allListings = [...registeredListings, ...filteredGoogle];

    return NextResponse.json({
      results: allListings,
      total: allListings.length,
      registered_count: registeredListings.length,
      query: { trade, location, state },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
