import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { searchPlaces, placeToDirectoryListing } from '@/lib/google-places';
import { createAdminClient } from '@/lib/supabase/admin';
import type { TradeCategory } from '@/types/database';
import { TRADE_CATEGORIES, tradeCategoryLabel } from '@/lib/utils';

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Server-side Supabase for logging (no cookies needed)
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Search registered tradies from Supabase
async function searchRegisteredTradies(trade: TradeCategory, location: string) {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from('tradies')
      .select('*')
      .eq('is_active', true)
      .eq('is_approved', true)
      .eq('trade_category', trade)
      .limit(5);

    if (location) {
      query = query.or(`service_areas.cs.{${location}},postcode.eq.${location}`);
    }

    const { data } = await query;
    return (data || []).map((t) => ({
      id: `tm_${t.id}`,
      business_name: t.business_name,
      slug: t.slug,
      trade_category: t.trade_category,
      short_description: t.short_description || `${t.business_name} - serving ${(t.service_areas || []).join(', ')}`,
      average_rating: t.average_rating || 0,
      review_count: t.review_count || 0,
      suburb: t.service_areas?.[0] || '',
      state: t.state,
      phone: t.phone,
      website: t.slug ? `https://trademojo.com.au/t/${t.slug}` : '',
      place_id: `tm_${t.id}`,
      is_registered: true,
    }));
  } catch (err) {
    console.error('Supabase search error in Mojo:', err);
    return [];
  }
}

// Log a search to Supabase (fire-and-forget)
async function logSearch(params: {
  trade_category?: string;
  location?: string;
  state?: string;
  problem_description?: string;
  raw_query: string;
  results_count: number;
  results_json?: unknown;
  ip_address?: string;
  user_agent?: string;
}) {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.from('mojo_searches').insert({
      trade_category: params.trade_category || null,
      location: params.location || null,
      state: params.state || null,
      problem_description: params.problem_description || null,
      raw_query: params.raw_query,
      results_count: params.results_count,
      results_json: params.results_json || null,
      ip_address: params.ip_address || null,
      user_agent: params.user_agent || null,
    });
  } catch (err) {
    console.error('Failed to log search:', err);
  }
}

// Tool definition for Mojo to search for tradies
const searchTool: Anthropic.Tool = {
  name: 'search_tradies',
  description:
    'Search for tradies/tradespeople in a specific location and trade category. Use this when the user wants to find a tradie.',
  input_schema: {
    type: 'object' as const,
    properties: {
      trade_category: {
        type: 'string',
        enum: TRADE_CATEGORIES,
        description: 'The type of trade to search for',
      },
      location: {
        type: 'string',
        description:
          'The suburb, city, or area to search in (e.g. "Brisbane", "Sydney CBD", "Gold Coast")',
      },
      state: {
        type: 'string',
        enum: ['QLD', 'NSW', 'VIC', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
        description: 'Australian state (optional)',
      },
    },
    required: ['trade_category', 'location'],
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, trade, location, problem, history } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ua = request.headers.get('user-agent') || '';

    // If guided flow provided trade + location directly, skip Claude and go straight to search
    if (trade && location) {
      const tradeCategory = trade as TradeCategory;

      // Search registered tradies first, then Google
      const [registeredResults, places] = await Promise.all([
        searchRegisteredTradies(tradeCategory, location),
        searchPlaces(tradeCategory, location),
      ]);

      const googleResults = places.slice(0, 8).map((p) => placeToDirectoryListing(p, tradeCategory));
      const tradeLabel = tradeCategoryLabel(tradeCategory);

      // Deduplicate: remove Google results that match registered business names
      const registeredNames = new Set(registeredResults.map((r) => r.business_name.toLowerCase().trim()));
      const filteredGoogle = googleResults.filter(
        (g) => !registeredNames.has(g.business_name.toLowerCase().trim())
      );

      const googleTradies = filteredGoogle.map((t) => ({
        id: t.place_id,
        business_name: t.business_name,
        slug: '',
        trade_category: t.trade_category,
        short_description: t.formatted_address,
        average_rating: t.rating,
        review_count: t.review_count,
        suburb: t.suburb,
        state: t.state,
        phone: t.phone,
        website: t.website,
        place_id: t.place_id,
        is_registered: false,
      }));

      // Registered first, then Google
      const frontendTradies = [...registeredResults, ...googleTradies];

      // Log to Supabase (fire and forget)
      logSearch({
        trade_category: trade,
        location,
        problem_description: problem,
        raw_query: query,
        results_count: frontendTradies.length,
        results_json: frontendTradies.slice(0, 5).map(t => ({
          name: t.business_name,
          rating: t.average_rating,
          reviews: t.review_count,
          suburb: t.suburb,
        })),
        ip_address: ip,
        user_agent: ua,
      });

      const message = frontendTradies.length > 0
        ? `Found ${frontendTradies.length} ${tradeLabel.toLowerCase()}s near ${location}! Here are the top results — you can call them directly or check their website.`
        : `I couldn't find any ${tradeLabel.toLowerCase()}s in ${location} right now. Try a nearby suburb or larger city.`;

      return NextResponse.json({
        message,
        tradies: frontendTradies,
      });
    }

    // No direct trade/location — use Claude to parse the query
    if (!anthropic) {
      return handleFallbackSearch(query, ip, ua);
    }

    const systemPrompt = `You are Mojo, the friendly AI assistant for TradeMojo — Australia's smartest trade directory.

Your job is to help Australians find the right tradie for their job. You're casual, helpful, and very Australian.

IMPORTANT: You have a search_tradies tool. USE IT whenever the user mentions needing a trade service and a location. Don't ask too many questions — if you can figure out the trade and location from their message, search immediately.

Trade categories available: ${TRADE_CATEGORIES.map((t) => `${t} (${tradeCategoryLabel(t as TradeCategory)})`).join(', ')}

Rules:
- Be concise and helpful. 2-3 sentences max in your responses.
- If they mention a trade and location, search straight away.
- If they only mention a trade, ask for their location.
- If they only mention a location, ask what trade they need.
- Present results warmly — mention the top-rated ones.
- Encourage getting multiple quotes and checking reviews.
- Use Australian slang naturally but don't overdo it.
- If no results found, suggest trying a nearby area or different search term.`;

    const messages: Anthropic.MessageParam[] = [];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({
          role: msg.role === 'mojo' ? 'assistant' : 'user',
          content: msg.content,
        });
      }
    }

    messages.push({ role: 'user', content: query });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      tools: [searchTool],
      messages,
    });

    let mojoMessage = '';
    let tradieResults: ReturnType<typeof placeToDirectoryListing>[] = [];
    let searchedTrade = '';
    let searchedLocation = '';

    for (const block of response.content) {
      if (block.type === 'text') {
        mojoMessage += block.text;
      } else if (block.type === 'tool_use' && block.name === 'search_tradies') {
        const input = block.input as {
          trade_category: TradeCategory;
          location: string;
          state?: string;
        };

        searchedTrade = input.trade_category;
        searchedLocation = input.location;

        const places = await searchPlaces(input.trade_category, input.location, input.state || '');
        tradieResults = places.slice(0, 8).map((p) => placeToDirectoryListing(p, input.trade_category));

        const followUp = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          system: systemPrompt,
          messages: [
            ...messages,
            { role: 'assistant', content: response.content },
            {
              role: 'user',
              content: [
                {
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: JSON.stringify({
                    total: tradieResults.length,
                    results: tradieResults.map((t) => ({
                      name: t.business_name,
                      rating: t.rating,
                      review_count: t.review_count,
                      suburb: t.suburb,
                      phone: t.phone,
                      is_open: t.is_open,
                    })),
                  }),
                },
              ],
            },
          ],
        });

        for (const fb of followUp.content) {
          if (fb.type === 'text') {
            mojoMessage = fb.text;
          }
        }
      }
    }

    if (!mojoMessage) {
      mojoMessage = tradieResults.length > 0
        ? "Found some results for you! Check them out below."
        : "I couldn't find any results. Try a different area or trade.";
    }

    const frontendTradies = tradieResults.map((t) => ({
      id: t.place_id,
      business_name: t.business_name,
      slug: '',
      trade_category: t.trade_category,
      short_description: t.formatted_address,
      average_rating: t.rating,
      review_count: t.review_count,
      suburb: t.suburb,
      state: t.state,
      phone: t.phone,
      website: t.website,
      place_id: t.place_id,
    }));

    // Log to Supabase
    logSearch({
      trade_category: searchedTrade || undefined,
      location: searchedLocation || undefined,
      raw_query: query,
      results_count: frontendTradies.length,
      results_json: frontendTradies.slice(0, 5).map(t => ({
        name: t.business_name,
        rating: t.average_rating,
        reviews: t.review_count,
        suburb: t.suburb,
      })),
      ip_address: ip,
      user_agent: ua,
    });

    return NextResponse.json({
      message: mojoMessage,
      tradies: frontendTradies,
    });
  } catch (error) {
    console.error('Mojo API error:', error);
    return NextResponse.json(
      {
        message: "G'day! I'm having a bit of trouble right now. Try again in a sec!",
        tradies: [],
      },
      { status: 500 }
    );
  }
}

// Fallback search when no Anthropic key is set
async function handleFallbackSearch(query: string, ip: string, ua: string) {
  const queryLower = query.toLowerCase();

  let detectedTrade: TradeCategory | null = null;
  for (const trade of TRADE_CATEGORIES) {
    const label = tradeCategoryLabel(trade as TradeCategory).toLowerCase();
    if (queryLower.includes(label) || queryLower.includes(trade)) {
      detectedTrade = trade as TradeCategory;
      break;
    }
  }

  const cities = [
    'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold coast',
    'canberra', 'newcastle', 'hobart', 'darwin', 'cairns', 'townsville',
    'sunshine coast', 'wollongong', 'geelong', 'toowoomba', 'ballarat',
  ];
  let detectedLocation = '';
  for (const city of cities) {
    if (queryLower.includes(city)) {
      detectedLocation = city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  if (detectedTrade && detectedLocation) {
    const places = await searchPlaces(detectedTrade, detectedLocation);
    const results = places.slice(0, 8).map((p) => placeToDirectoryListing(p, detectedTrade!));

    const frontendTradies = results.map((t) => ({
      id: t.place_id,
      business_name: t.business_name,
      slug: '',
      trade_category: t.trade_category,
      short_description: t.formatted_address,
      average_rating: t.rating,
      review_count: t.review_count,
      suburb: t.suburb,
      state: t.state,
      phone: t.phone,
      website: t.website,
      place_id: t.place_id,
    }));

    logSearch({
      trade_category: detectedTrade,
      location: detectedLocation,
      raw_query: query,
      results_count: frontendTradies.length,
      results_json: frontendTradies.slice(0, 5).map(t => ({
        name: t.business_name,
        rating: t.average_rating,
        reviews: t.review_count,
      })),
      ip_address: ip,
      user_agent: ua,
    });

    return NextResponse.json({
      message: `Found ${results.length} ${tradeCategoryLabel(detectedTrade).toLowerCase()}s in ${detectedLocation}!`,
      tradies: frontendTradies,
    });
  }

  logSearch({
    trade_category: detectedTrade || undefined,
    location: detectedLocation || undefined,
    raw_query: query,
    results_count: 0,
    ip_address: ip,
    user_agent: ua,
  });

  return NextResponse.json({
    message: detectedTrade
      ? `I can find ${tradeCategoryLabel(detectedTrade).toLowerCase()}s for you! Which area are you in?`
      : detectedLocation
        ? `Looking in ${detectedLocation} — what kind of tradie do you need?`
        : "G'day! Tell me what trade you need and where you are, and I'll find the best options.",
    tradies: [],
  });
}
