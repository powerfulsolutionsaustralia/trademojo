import { NextResponse } from 'next/server';
import { tradeCategoryLabel } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

function generateSlug(businessName: string, area: string): string {
  return `${businessName}-${area}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generatePassword(): string {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      business_name,
      owner_name,
      email,
      phone,
      trade_category,
      abn,
      state,
      service_areas,
      description,
      services_list,
      hero_headline,
      primary_color,
      about_text,
    } = body;

    // Validate required fields
    if (!business_name || !owner_name || !email || !phone || !trade_category || !state) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const slug = generateSlug(business_name, service_areas?.[0] || state);
    const tempPassword = generatePassword();
    const tradeLabel = tradeCategoryLabel(trade_category as TradeCategory);

    // TODO: When Supabase is live, do all of this:
    // 1. Create auth user
    // const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    //   email, password: tempPassword, email_confirm: true
    // });

    // 2. Create tradie record
    // const { data: tradie } = await supabase.from('tradies').insert({
    //   user_id: authUser.user.id, business_name, slug, owner_name, email, phone,
    //   abn, trade_category, description, short_description: `${tradeLabel} serving ${service_areas?.join(', ') || state}`,
    //   service_areas: service_areas || [], state, plan_tier: 'free', is_active: true,
    // }).select().single();

    // 3. Create tradie_site record
    // const autoHeadline = hero_headline || `Your Trusted Local ${tradeLabel}`;
    // await supabase.from('tradie_sites').insert({
    //   tradie_id: tradie.id, primary_color: primary_color || '#F97316',
    //   hero_headline: autoHeadline, hero_subheadline: `Licensed, insured ${tradeLabel.toLowerCase()} serving ${service_areas?.join(', ') || state}. Get a free quote today.`,
    //   cta_text: 'Get a Free Quote', services_list: services_list || [],
    //   about_text: about_text || description || `${business_name} is a trusted ${tradeLabel.toLowerCase()} serving ${service_areas?.join(', ') || state}.`,
    //   meta_title: `${business_name} - ${tradeLabel} in ${service_areas?.[0] || state}`,
    //   meta_description: `${business_name} is a licensed ${tradeLabel.toLowerCase()} serving ${service_areas?.join(', ') || state}. Get a free quote today.`,
    // });

    // 4. Create directory listing
    // await supabase.from('directory_listings').insert({
    //   tradie_id: tradie.id, trade_category, title: `${business_name} - ${tradeLabel}`,
    //   description: `Licensed ${tradeLabel.toLowerCase()} serving ${service_areas?.join(', ') || state}.`,
    //   suburbs: service_areas || [], state, keywords: [tradeLabel.toLowerCase(), ...service_areas || []],
    // });

    console.log('New tradie onboarded:', { business_name, slug, trade_category, email });

    return NextResponse.json({
      success: true,
      slug,
      website_url: `https://trademojo.com.au/t/${slug}`,
      dashboard_url: 'https://trademojo.com.au/dashboard',
      temp_password: tempPassword,
      message: `Website created for ${business_name}!`,
    });
  } catch (error) {
    console.error('Onboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to create website. Please try again.' },
      { status: 500 }
    );
  }
}
