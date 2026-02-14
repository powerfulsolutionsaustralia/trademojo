import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
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

    const supabase = createAdminClient();
    const slug = generateSlug(business_name);
    const tradeLabel = tradeCategoryLabel(trade_category as TradeCategory);

    // 1. Check for duplicate email
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const emailExists = existingUser?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    // 2. Create Supabase auth user with their chosen password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        business_name,
        trade_category,
      },
    });

    if (authError || !authData.user) {
      console.error('Auth user creation error:', authError);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 3. Create tradie record (minimal — they fill the rest in dashboard)
    const { data: tradie, error: tradieError } = await supabase
      .from('tradies')
      .insert({
        user_id: userId,
        business_name,
        slug,
        owner_name: '',
        email,
        phone,
        abn: null,
        trade_category,
        description: `${business_name} is a trusted ${tradeLabel.toLowerCase()}.`,
        short_description: tradeLabel,
        service_areas: [],
        state: '',
        postcode: '',
        plan_tier: 'free',
        is_active: true,
        is_featured: false,
        is_approved: true,
        approved_at: new Date().toISOString(),
        verification_notes: {},
      })
      .select()
      .single();

    if (tradieError || !tradie) {
      console.error('Tradie record creation error:', tradieError);
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Failed to create business profile. Please try again.' },
        { status: 500 }
      );
    }

    // 4. Create tradie_site record with auto-generated content
    const { error: siteError } = await supabase.from('tradie_sites').insert({
      tradie_id: tradie.id,
      primary_color: '#F97316',
      secondary_color: '#1E293B',
      hero_headline: `Your Trusted Local ${tradeLabel}`,
      hero_subheadline: `Licensed, insured ${tradeLabel.toLowerCase()}. Get a free quote today.`,
      cta_text: 'Get a Free Quote',
      services_list: [],
      about_text: '',
      show_booking: true,
      show_reviews: true,
      show_gallery: true,
      testimonials: [],
      meta_title: `${business_name} - ${tradeLabel}`,
      meta_description: `${business_name} is a licensed ${tradeLabel.toLowerCase()}. Get a free quote today.`,
    });

    if (siteError) {
      console.error('Tradie site creation error:', siteError);
    }

    // 5. Create directory listing
    const { error: listingError } = await supabase.from('directory_listings').insert({
      tradie_id: tradie.id,
      trade_category,
      title: `${business_name} - ${tradeLabel}`,
      description: `Licensed ${tradeLabel.toLowerCase()}. Professional, reliable service.`,
      suburbs: [],
      state: '',
      keywords: [tradeLabel.toLowerCase(), trade_category.replace(/_/g, ' ')],
      schema_markup: {},
      is_active: true,
    });

    if (listingError) {
      console.error('Directory listing creation error:', listingError);
    }

    // 6. Send welcome email (non-blocking)
    sendWelcomeEmail(email, business_name, password, slug).catch((err) =>
      console.error('Welcome email error:', err)
    );

    // 7. Send admin alert (non-blocking)
    sendAdminAlert(
      `New signup: ${business_name}`,
      `
        <p><strong>Business:</strong> ${business_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Trade:</strong> ${tradeLabel}</p>
        <p><strong>Slug:</strong> /t/${slug}</p>
      `
    ).catch((err) => console.error('Admin alert error:', err));

    console.log('New tradie onboarded:', { business_name, slug, trade_category, email });

    return NextResponse.json({
      success: true,
      slug,
      message: `Account created for ${business_name}!`,
    });
  } catch (error) {
    console.error('Onboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
