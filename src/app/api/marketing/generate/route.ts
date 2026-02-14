import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

let anthropicInstance: import('@anthropic-ai/sdk').default | null = null;

function getAnthropic() {
  if (!anthropicInstance) {
    const Anthropic = require('@anthropic-ai/sdk').default;
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicInstance!;
}

const toolPrompts: Record<string, string> = {
  social: `Generate an engaging social media post for Instagram/Facebook. Include:
- An attention-grabbing opening line
- The main message about the topic
- Relevant hashtags (5-8)
- A call to action
Keep it casual, friendly, and professional. Around 150-200 words.`,
  ad: `Generate ad copy for Google Ads or Facebook Ads. Include:
- A compelling headline (max 30 characters for Google, or attention-grabbing for Facebook)
- 2-3 description lines
- A strong call to action
- Key selling points
Create both a Google Ads version and a Facebook Ads version.`,
  flyer: `Generate text for a promotional flyer or letterbox drop. Include:
- A bold headline
- Key benefits (3-4 bullet points)
- Service details
- Contact information placeholder
- A special offer or call to action
Keep it concise and impactful for print format.`,
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tool, topic, businessName, tradeCategory } = body;

    if (!tool || !topic) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const toolPrompt = toolPrompts[tool];
    if (!toolPrompt) {
      return NextResponse.json({ error: 'Invalid tool' }, { status: 400 });
    }

    const anthropic = getAnthropic();

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a marketing copywriter for Australian trade businesses.

Business: ${businessName}
Trade: ${tradeCategory}
Topic/Promotion: ${topic}

${toolPrompt}

Write the content now. Be authentic and avoid generic filler. Use Australian English spelling.`,
        },
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Marketing generate error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
