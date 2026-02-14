import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail, sendAdminAlert } from '@/lib/email';
import { tradeCategoryLabel } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { business_name, email, password, phone, trade_category } = body;

    // Validate required fields
    if (!business_name || !email || !password || !phone || !trade_category) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const slug = generateSlug(business_name);
    const tradeLabel = tradeCategoryLabel(trade_category as TradeCategory);

    // 1. Check for duplicate slug and make unique if needed
    const { data: existingSlug } = await supabase
      .from('tradies')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    const finalSlug = existingSlug
      ? `${slug}-${Date.now().toString(36).slice(-4)}`
      : slug;

    // 2. Sign up the user (uses anon key — no service role needed)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name,
          trade_category,
        },
      },
    });

    if (authError || !authData.user) {
      console.error('Auth signup error:', authError);
      const msg = authError?.message?.toLowerCase() || '';
      if (msg.includes('already') || msg.includes('exists') || msg.includes('registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: authError?.message || 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 3. Create tradie + site + listing via SECURITY DEFINER function (bypasses RLS)
    const { data: rpcResult, error: rpcError } = await supabase.rpc('onboard_tradie', {
      p_user_id: userId,
      p_business_name: business_name,
      p_slug: finalSlug,
      p_email: email,
      p_phone: phone,
      p_trade_category: trade_category,
      p_trade_label: tradeLabel,
    });

    if (rpcError) {
      console.error('Onboard RPC error:', rpcError);
      return NextResponse.json(
        { error: `Failed to create business profile: ${rpcError.message}` },
        { status: 500 }
      );
    }

    console.log('Tradie created via RPC, id:', rpcResult);

    // 4. Send welcome email (non-blocking)
    sendWelcomeEmail(email, business_name, password, finalSlug).catch((err) =>
      console.error('Welcome email error:', err)
    );

    // 5. Send admin alert (non-blocking)
    sendAdminAlert(
      `New signup: ${business_name}`,
      `
        <p><strong>Business:</strong> ${business_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Trade:</strong> ${tradeLabel}</p>
        <p><strong>Slug:</strong> /t/${finalSlug}</p>
      `
    ).catch((err) => console.error('Admin alert error:', err));

    console.log('New tradie onboarded:', { business_name, slug: finalSlug, trade_category, email });

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      message: `Account created for ${business_name}!`,
    });
  } catch (error) {
    console.error('Onboard API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create account: ${message}` },
      { status: 500 }
    );
  }
}
