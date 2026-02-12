import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query, history } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // TODO: Replace with real Supabase query once DB is populated
    const systemPrompt = `You are Mojo, the friendly AI assistant for TradeMojo — Australia's smartest trade directory.

Your job is to help Australians find the right tradie for their job. You're casual, helpful, and knowledgeable about trades.

When a user asks for a tradie:
1. Acknowledge what they need
2. Ask clarifying questions if needed (location, urgency, specific requirements)
3. When you have enough info, search the database for matching tradies
4. Present results in a helpful way

Important rules:
- Always be friendly and Australian in tone (but not over the top)
- If you don't have tradies in the database for their area yet, be honest and offer to notify them when one signs up
- Never make up tradie businesses — only show real results from the database
- Keep responses concise — users want answers, not essays
- Always encourage users to check reviews and get multiple quotes

Current database status: The directory is launching soon. For now, let users know their search has been noted and we'll match them with tradies as they sign up. Encourage them to check back soon or leave their details so we can notify them.`;

    const messages: Anthropic.MessageParam[] = [];

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({
          role: msg.role === 'mojo' ? 'assistant' : 'user',
          content: msg.content,
        });
      }
    }

    // Add current query
    messages.push({
      role: 'user',
      content: query,
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    const mojoMessage =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Sorry, I had trouble processing that. Try again!';

    // TODO: Query Supabase for matching tradies based on the parsed search intent
    return NextResponse.json({
      message: mojoMessage,
      tradies: [],
    });
  } catch (error) {
    console.error('Mojo API error:', error);
    return NextResponse.json(
      {
        message:
          "G'day! I'm having a bit of trouble right now. Try searching by category below, or give me another go in a sec!",
        tradies: [],
      },
      { status: 500 }
    );
  }
}
