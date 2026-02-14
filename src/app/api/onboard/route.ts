import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyBusiness } from '@/lib/ai-verify';
import { sendWelcomeEmail, sendAdminAlert } from '@/lib/email';
import { tradeCategoryLabel } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

function generateSlug(businessName: string, area: string): string {
  return `${businessName}-${area}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generatePassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
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

    const supabase = createAdminClient();
    const slug = generateSlug(business_name, service_areas?.[0] || state);
    const tempPassword = generatePassword();
    const tradeLabel = tradeCategoryLabel(trade_category as TradeCategory);

    // 1. Check for duplicate email
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const emailExists = existingUser?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in or use a different email.' },
        { status: 409 }
      );
    }

    // 2. Run AI verification
    let verification;
    try {
      verification = await verifyBusiness(
        business_name,
        abn,
        trade_category as TradeCategory,
        state,
        owner_name,
        description || ''
      );
    } catch (error) {
      console.error('Verification error (proceeding with manual review):', error);
      verification = {
        score: 50,
        recommendation: 'needs_review' as const,
        flags: ['Verification service error'],
        reasoning: 'Could not complete verification — manual review required',
      };
    }

    const isAutoApproved = verification.recommendation === 'auto_approve';
    const isSpam = verification.recommendation === 'likely_spam';

    if (isSpam) {
      // Send admin alert about spam but don't create the account
      await sendAdminAlert(
        `Spam signup blocked: ${business_name}`,
        `
          <p><strong>Business:</strong> ${business_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Score:</strong> ${verification.score}/100</p>
          <p><strong>Flags:</strong> ${verification.flags.join(', ')}</p>
          <p><strong>Reasoning:</strong> ${verification.reasoning}</p>
        `
      );

      return NextResponse.json(
        { error: 'We could not verify your business at this time. Please contact team@trademojo.com.au for assistance.' },
        { status: 422 }
      );
    }

    // 3. Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        business_name,
        owner_name,
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

    // 4. Create tradie record
    const { data: tradie, error: tradieError } = await supabase
      .from('tradies')
      .insert({
        user_id: userId,
        business_name,
        slug,
        owner_name,
        email,
        phone,
        abn: abn || null,
        trade_category,
        description: description || `${business_name} is a trusted ${tradeLabel.toLowerCase()} serving ${(service_areas || []).join(', ') || state}.`,
        short_description: `${tradeLabel} serving ${(service_areas || []).join(', ') || state}`,
        service_areas: service_areas || [],
        state,
        postcode: '',
        plan_tier: 'free',
        is_active: isAutoApproved,
        is_featured: false,
        is_approved: isAutoApproved,
        approved_at: isAutoApproved ? new Date().toISOString() : null,
        verification_notes: {
          score: verification.score,
          recommendation: verification.recommendation,
          flags: verification.flags,
          reasoning: verification.reasoning,
          verified_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (tradieError || !tradie) {
      console.error('Tradie record creation error:', tradieError);
      // Clean up auth user if tradie creation fails
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Failed to create business profile. Please try again.' },
        { status: 500 }
      );
    }

    // 5. Create tradie_site record
    const autoHeadline = hero_headline || `Your Trusted Local ${tradeLabel}`;
    const { error: siteError } = await supabase.from('tradie_sites').insert({
      tradie_id: tradie.id,
      primary_color: primary_color || '#F97316',
      secondary_color: '#1E293B',
      hero_headline: autoHeadline,
      hero_subheadline: `Licensed, insured ${tradeLabel.toLowerCase()} serving ${(service_areas || []).join(', ') || state}. Get a free quote today.`,
      cta_text: 'Get a Free Quote',
      services_list: services_list || [],
      about_text: about_text || description || `${business_name} is a trusted ${tradeLabel.toLowerCase()} serving ${(service_areas || []).join(', ') || state}. Contact us today for a free quote.`,
      show_booking: true,
      show_reviews: true,
      show_gallery: true,
      testimonials: [],
      meta_title: `${business_name} - ${tradeLabel} in ${service_areas?.[0] || state}`,
      meta_description: `${business_name} is a licensed ${tradeLabel.toLowerCase()} serving ${(service_areas || []).join(', ') || state}. Get a free quote today.`,
    });

    if (siteError) {
      console.error('Tradie site creation error:', siteError);
      // Non-critical — tradie can update this later
    }

    // 6. Create directory listing
    const { error: listingError } = await supabase.from('directory_listings').insert({
      tradie_id: tradie.id,
      trade_category,
      title: `${business_name} - ${tradeLabel}`,
      description: `Licensed ${tradeLabel.toLowerCase()} serving ${(service_areas || []).join(', ') || state}. Professional, reliable service.`,
      suburbs: service_areas || [],
      state,
      keywords: [
        tradeLabel.toLowerCase(),
        trade_category.replace(/_/g, ' '),
        ...(service_areas || []).map((s: string) => s.toLowerCase()),
      ],
      schema_markup: {},
      is_active: isAutoApproved,
    });

    if (listingError) {
      console.error('Directory listing creation error:', listingError);
      // Non-critical
    }

    // 7. Send welcome email
    await sendWelcomeEmail(email, business_name, tempPassword, slug);

    // 8. Send admin alert
    const approvalStatus = isAutoApproved
      ? '✅ Auto-approved'
      : '⏳ Needs manual review';

    await sendAdminAlert(
      `New signup: ${business_name} (${approvalStatus})`,
      `
        <p><strong>Business:</strong> ${business_name}</p>
        <p><strong>Owner:</strong> ${owner_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Trade:</strong> ${tradeLabel}</p>
        <p><strong>State:</strong> ${state}</p>
        <p><strong>ABN:</strong> ${abn || 'Not provided'}</p>
        <p><strong>Service Areas:</strong> ${(service_areas || []).join(', ')}</p>
        <hr />
        <p><strong>Verification Score:</strong> ${verification.score}/100</p>
        <p><strong>Recommendation:</strong> ${verification.recommendation}</p>
        <p><strong>Flags:</strong> ${verification.flags.length > 0 ? verification.flags.join(', ') : 'None'}</p>
        <p><strong>Reasoning:</strong> ${verification.reasoning}</p>
        ${!isAutoApproved ? '<p style="color: #F97316; font-weight: bold;">⚠️ Manual approval required — <a href="https://trademojo.com.au/dashboard">Review in admin</a></p>' : ''}
      `
    );

    console.log('New tradie onboarded:', {
      business_name,
      slug,
      trade_category,
      email,
      approved: isAutoApproved,
      verification_score: verification.score,
    });

    return NextResponse.json({
      success: true,
      slug,
      website_url: `https://trademojo.com.au/t/${slug}`,
      dashboard_url: 'https://trademojo.com.au/dashboard',
      temp_password: tempPassword,
      is_approved: isAutoApproved,
      message: isAutoApproved
        ? `Website created for ${business_name}! Your listing is live.`
        : `Application submitted for ${business_name}! Your listing is being reviewed and will be live shortly.`,
    });
  } catch (error) {
    console.error('Onboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to create website. Please try again.' },
      { status: 500 }
    );
  }
}
