import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tradie record
    const { data: tradie, error: tradieError } = await supabase
      .from('tradies')
      .select('id, email, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (tradieError || !tradie) {
      return NextResponse.json({ error: 'Tradie not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const returnUrl = body.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://trademojo.com.au'}/dashboard/billing`;

    const { sessionUrl, customerId } = await createCheckoutSession(
      tradie.id,
      tradie.email || user.email || '',
      returnUrl
    );

    // Save Stripe customer ID if this is a new customer
    if (!tradie.stripe_customer_id && customerId) {
      await supabase
        .from('tradies')
        .update({ stripe_customer_id: customerId })
        .eq('id', tradie.id);
    }

    return NextResponse.json({ url: sessionUrl });
  } catch (error) {
    console.error('Billing checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
