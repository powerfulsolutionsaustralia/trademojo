import { NextResponse } from 'next/server';
import { searchPlaces, placeToDirectoryListing } from '@/lib/google-places';
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
    const places = await searchPlaces(
      trade || 'handyman',
      location || 'Australia',
      state
    );

    const listings = places.map((p) => placeToDirectoryListing(p, trade || 'other'));

    return NextResponse.json({
      results: listings,
      total: listings.length,
      query: { trade, location, state },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
