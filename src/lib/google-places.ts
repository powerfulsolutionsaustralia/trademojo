import type { TradeCategory } from '@/types/database';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Map our trade categories to Google Places search terms
const TRADE_SEARCH_TERMS: Record<TradeCategory, string[]> = {
  // Plumbing & Gas
  plumber: ['plumber', 'plumbing services'],
  gas_fitter: ['gas fitter', 'gas plumber'],
  drain_specialist: ['drain cleaning', 'blocked drain specialist'],
  // Electrical & Solar
  electrician: ['electrician', 'electrical services'],
  solar: ['solar installer', 'solar panels', 'solar system installer'],
  air_conditioning: ['air conditioning', 'HVAC', 'aircon installer'],
  data_cabling: ['data cabling', 'network cabling'],
  security_systems: ['security system installer', 'CCTV installer', 'alarm installer'],
  // Building & Renovation
  builder: ['builder', 'home builder', 'construction'],
  carpenter: ['carpenter', 'carpentry services'],
  tiler: ['tiler', 'tiling services'],
  concreter: ['concreter', 'concrete services'],
  glazier: ['glazier', 'glass repair', 'glass replacement'],
  plasterer: ['plasterer', 'plastering services'],
  bricklayer: ['bricklayer', 'brickwork', 'brick laying'],
  cabinet_maker: ['cabinet maker', 'custom cabinetry'],
  bathroom_renovator: ['bathroom renovation', 'bathroom remodel'],
  kitchen_renovator: ['kitchen renovation', 'kitchen remodel'],
  // Roofing & Exterior
  roofer: ['roofing', 'roof repairs', 'roofer'],
  painter: ['painter', 'house painter', 'painting services'],
  renderer: ['renderer', 'rendering services', 'cement render'],
  cladding: ['cladding installer', 'wall cladding'],
  gutter_specialist: ['gutter cleaning', 'gutter installation', 'gutter repairs'],
  // Outdoor & Property
  landscaper: ['landscaper', 'landscaping services'],
  fencer: ['fencing', 'fence builder', 'fencing contractor'],
  pool_builder: ['pool builder', 'pool construction', 'swimming pool'],
  earthmoving: ['earthmoving', 'excavation', 'excavator hire'],
  demolition: ['demolition services', 'demolition contractor'],
  paver: ['paving', 'paver installer', 'paving contractor'],
  retaining_walls: ['retaining wall builder', 'retaining walls'],
  tree_lopper: ['tree lopping', 'tree removal', 'arborist'],
  irrigation: ['irrigation installer', 'reticulation', 'irrigation systems'],
  // Home Services
  handyman: ['handyman', 'handyman services'],
  locksmith: ['locksmith', 'locksmith services'],
  pest_control: ['pest control', 'termite inspection'],
  cleaning: ['cleaning services', 'house cleaning', 'home cleaner'],
  carpet_cleaning: ['carpet cleaning', 'carpet steam cleaning'],
  // Appliances & Systems
  appliance_repair: ['appliance repair', 'washing machine repair', 'oven repair'],
  water_filtration: ['water filtration', 'water filter installation', 'water purification'],
  hot_water_systems: ['hot water system', 'hot water installation', 'hot water repairs'],
  garage_doors: ['garage door repair', 'garage door installation', 'roller door'],
  antenna_specialist: ['TV antenna installer', 'antenna installation', 'antenna repair'],
  // Flooring
  flooring: ['flooring installer', 'timber flooring', 'floor sanding'],
  // Other
  other: ['tradesman', 'trade services'],
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
 */
export async function searchPlacesWithDetails(
  trade: TradeCategory,
  location: string,
  state: string = '',
  limit: number = 20
): Promise<GooglePlaceResult[]> {
  const textResults = await searchPlaces(trade, location, state);

  if (textResults.length === 0) return [];

  const topResults = textResults.slice(0, limit);

  const enriched = await Promise.all(
    topResults.map(async (place) => {
      try {
        const details = await getPlaceDetails(place.place_id);
        if (details) {
          return {
            ...place,
            ...details,
            geometry: details.geometry || place.geometry,
          };
        }
        return place;
      } catch {
        return place;
      }
    })
  );

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
  const parts = address.split(',').map((p) => p.trim());

  let suburb = '';
  let state = '';
  let postcode = '';

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
