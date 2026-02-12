import type { TradeCategory } from '@/types/database';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Map our trade categories to Google Places search terms
const TRADE_SEARCH_TERMS: Record<TradeCategory, string[]> = {
  plumber: ['plumber', 'plumbing services'],
  electrician: ['electrician', 'electrical services'],
  carpenter: ['carpenter', 'carpentry services'],
  painter: ['painter', 'house painter', 'painting services'],
  roofer: ['roofing', 'roof repairs'],
  landscaper: ['landscaper', 'landscaping services'],
  builder: ['builder', 'home builder', 'construction'],
  tiler: ['tiler', 'tiling services'],
  concreter: ['concreter', 'concrete services'],
  fencer: ['fencing', 'fence builder'],
  air_conditioning: ['air conditioning', 'HVAC', 'aircon'],
  solar: ['solar installer', 'solar panels'],
  pest_control: ['pest control'],
  cleaning: ['cleaning services', 'house cleaning'],
  locksmith: ['locksmith'],
  glazier: ['glazier', 'glass repair'],
  demolition: ['demolition services'],
  earthmoving: ['earthmoving', 'excavation'],
  pool_builder: ['pool builder', 'pool construction'],
  handyman: ['handyman', 'handyman services'],
  other: ['tradesman'],
};

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  reviews?: {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
  }[];
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
  business_status?: string;
  types?: string[];
}

/**
 * Search Google Places for tradies by trade category and location
 */
export async function searchPlaces(
  trade: TradeCategory,
  location: string,
  state: string = ''
): Promise<GooglePlaceResult[]> {
  if (!GOOGLE_API_KEY) {
    console.error('GOOGLE_PLACES_API_KEY not set');
    return [];
  }

  const searchTerms = TRADE_SEARCH_TERMS[trade] || [trade];
  const query = `${searchTerms[0]} in ${location}${state ? ` ${state}` : ''} Australia`;

  try {
    // Text Search - returns up to 20 results
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&region=au`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
      console.error('Google Places search failed:', data.status, data.error_message);
      return [];
    }

    return data.results || [];
  } catch (error) {
    console.error('Google Places API error:', error);
    return [];
  }
}

/**
 * Search and enrich: search for places, then fetch details for each (phone, website, reviews)
 * This gives us the full info needed for listings
 */
export async function searchPlacesWithDetails(
  trade: TradeCategory,
  location: string,
  state: string = '',
  limit: number = 20
): Promise<GooglePlaceResult[]> {
  const textResults = await searchPlaces(trade, location, state);

  if (textResults.length === 0) return [];

  // Fetch details for each place in parallel (limited to top results to manage API costs)
  const topResults = textResults.slice(0, limit);

  const enriched = await Promise.all(
    topResults.map(async (place) => {
      try {
        const details = await getPlaceDetails(place.place_id);
        if (details) {
          return {
            ...place,
            ...details,
            // Keep geometry from text search if details doesn't have it
            geometry: details.geometry || place.geometry,
          };
        }
        return place;
      } catch {
        return place;
      }
    })
  );

  // Sort: has phone/website first, then by rating
  return enriched.sort((a, b) => {
    const aHasContact = (a.formatted_phone_number || a.website) ? 1 : 0;
    const bHasContact = (b.formatted_phone_number || b.website) ? 1 : 0;
    if (bHasContact !== aHasContact) return bHasContact - aHasContact;
    return (b.rating || 0) - (a.rating || 0);
  });
}

/**
 * Get detailed place info including phone, reviews, photos
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
  if (!GOOGLE_API_KEY) return null;

  try {
    const fields = 'place_id,name,formatted_address,geometry,rating,user_ratings_total,formatted_phone_number,international_phone_number,website,opening_hours,reviews,photos,business_status,types';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
      console.error('Place details failed:', data.status);
      return null;
    }

    return data.result || null;
  } catch (error) {
    console.error('Place details error:', error);
    return null;
  }
}

/**
 * Get a photo URL from a photo reference
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

/**
 * Extract suburb/city from a Google formatted address
 */
export function extractLocationFromAddress(address: string): {
  suburb: string;
  state: string;
  postcode: string;
} {
  // Typical format: "123 Street, Suburb STATE POSTCODE, Australia"
  const parts = address.split(',').map((p) => p.trim());

  let suburb = '';
  let state = '';
  let postcode = '';

  // Usually the second-to-last part has suburb + state + postcode
  const statePostcodePart = parts.length >= 2 ? parts[parts.length - 2] : '';
  const stateMatch = statePostcodePart.match(
    /(.+?)\s+(QLD|NSW|VIC|SA|WA|TAS|NT|ACT)\s+(\d{4})/i
  );

  if (stateMatch) {
    suburb = stateMatch[1].trim();
    state = stateMatch[2].toUpperCase();
    postcode = stateMatch[3];
  } else if (parts.length >= 2) {
    suburb = parts[parts.length - 2];
  }

  return { suburb, state, postcode };
}

/**
 * Convert a Google Place result to our listing format for display
 */
export function placeToDirectoryListing(
  place: GooglePlaceResult,
  tradeCategory: TradeCategory
) {
  const location = extractLocationFromAddress(place.formatted_address || '');

  return {
    place_id: place.place_id,
    business_name: place.name,
    formatted_address: place.formatted_address,
    trade_category: tradeCategory,
    suburb: location.suburb,
    state: location.state,
    postcode: location.postcode,
    rating: place.rating || 0,
    review_count: place.user_ratings_total || 0,
    phone: place.formatted_phone_number || place.international_phone_number || '',
    website: place.website || '',
    is_open: place.opening_hours?.open_now,
    photo_reference: place.photos?.[0]?.photo_reference || null,
    reviews: (place.reviews || []).slice(0, 3).map((r) => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.relative_time_description,
    })),
    lat: place.geometry?.location?.lat,
    lng: place.geometry?.location?.lng,
  };
}
