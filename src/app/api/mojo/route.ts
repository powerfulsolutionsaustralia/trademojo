import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchPlaces, placeToDirectoryListing } from '@/lib/google-places';
import type { TradeCategory } from '@/types/database';
import { TRADE_CATEGORIES, tradeCategoryLabel } from '@/lib/utils';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
    const { query, history } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback if no API key - do a basic keyword search
      return handleFallbackSearch(query);
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

    // First call - may trigger tool use
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      tools: [searchTool],
      messages,
    });

    // Check if Mojo wants to search
    let mojoMessage = '';
    let tradieResults: ReturnType<typeof placeToDirectoryListing>[] = [];

    for (const block of response.content) {
      if (block.type === 'text') {
        mojoMessage += block.text;
      } else if (block.type === 'tool_use' && block.name === 'search_tradies') {
        const input = block.input as {
          trade_category: TradeCategory;
          location: string;
          state?: string;
        };

        // Actually search Google Places
        const places = await searchPlaces(
          input.trade_category,
          input.location,
          input.state || ''
        );

        tradieResults = places
          .slice(0, 6)
          .map((p) => placeToDirectoryListing(p, input.trade_category));

        // Send tool result back to get Mojo's response
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
      mojoMessage = "I found some results for you! Check them out below.";
    }

    // Convert to the format the frontend expects
    const frontendTradies = tradieResults.map((t) => ({
      id: t.place_id,
      business_name: t.business_name,
      slug: '', // Google Places results don't have slugs
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

    return NextResponse.json({
      message: mojoMessage,
      tradies: frontendTradies,
    });
  } catch (error) {
    console.error('Mojo API error:', error);
    return NextResponse.json(
      {
        message:
          "G'day! I'm having a bit of trouble right now. Try browsing by category below, or give me another go in a sec!",
        tradies: [],
      },
      { status: 500 }
    );
  }
}

// Fallback search when no Anthropic key is set
async function handleFallbackSearch(query: string) {
  const queryLower = query.toLowerCase();

  // Try to extract trade from query
  let detectedTrade: TradeCategory | null = null;
  for (const trade of TRADE_CATEGORIES) {
    const label = tradeCategoryLabel(trade as TradeCategory).toLowerCase();
    if (queryLower.includes(label) || queryLower.includes(trade)) {
      detectedTrade = trade as TradeCategory;
      break;
    }
  }

  // Try to extract location
  const cities = [
    'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold coast',
    'canberra', 'newcastle', 'hobart', 'darwin', 'cairns', 'townsville',
    'sunshine coast', 'wollongong', 'geelong', 'toowoomba', 'ballarat',
  ];
  let detectedLocation = '';
  for (const city of cities) {
    if (queryLower.includes(city)) {
      detectedLocation = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  if (detectedTrade && detectedLocation) {
    const places = await searchPlaces(detectedTrade, detectedLocation);
    const results = places.slice(0, 6).map((p) => placeToDirectoryListing(p, detectedTrade!));

    return NextResponse.json({
      message: `Found ${results.length} ${tradeCategoryLabel(detectedTrade).toLowerCase()}s in ${detectedLocation}! Here are the top results:`,
      tradies: results.map((t) => ({
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
      })),
    });
  }

  return NextResponse.json({
    message: detectedTrade
      ? `I can find ${tradeCategoryLabel(detectedTrade).toLowerCase()}s for you! Which area are you in?`
      : detectedLocation
        ? `Looking in ${detectedLocation} — what kind of tradie do you need? (plumber, electrician, builder, etc.)`
        : "G'day! Tell me what trade you need and where you are, and I'll find the best options. For example: 'I need a plumber in Brisbane'",
    tradies: [],
  });
}
