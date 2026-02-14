import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { chargeForLeads } from '@/lib/stripe';

/**
 * Daily billing cron job — runs at midnight AEST (2pm UTC).
 * Groups pending billing events per tradie, charges a single PaymentIntent.
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results: { tradie_id: string; status: string; leads: number; amount: number; error?: string }[] = [];

  try {
    // Get all tradies with pending billing events who have a payment method
    const { data: pendingEvents, error: eventsError } = await supabase
      .from('billing_events')
      .select('tradie_id, id, amount_cents')
      .eq('status', 'pending')
      .eq('event_type', 'lead_charge');

    if (eventsError) {
      console.error('Error fetching pending events:', eventsError);
      return NextResponse.json({ error: 'Failed to fetch pending events' }, { status: 500 });
    }

    if (!pendingEvents || pendingEvents.length === 0) {
      return NextResponse.json({ message: 'No pending billing events', results: [] });
    }

    // Group by tradie_id
    const grouped: Record<string, { eventIds: string[]; totalCents: number; count: number }> = {};
    for (const event of pendingEvents) {
      if (!grouped[event.tradie_id]) {
        grouped[event.tradie_id] = { eventIds: [], totalCents: 0, count: 0 };
      }
      grouped[event.tradie_id].eventIds.push(event.id);
      grouped[event.tradie_id].totalCents += event.amount_cents;
      grouped[event.tradie_id].count += 1;
    }

    // Process each tradie
    for (const [tradieId, batch] of Object.entries(grouped)) {
      try {
        // Get tradie's Stripe customer ID
        const { data: tradie, error: tradieError } = await supabase
          .from('tradies')
          .select('stripe_customer_id, has_payment_method, business_name, email')
          .eq('id', tradieId)
          .single();

        if (tradieError || !tradie?.stripe_customer_id || !tradie.has_payment_method) {
          console.log(`Skipping tradie ${tradieId}: no payment method`);
          results.push({
            tradie_id: tradieId,
            status: 'skipped',
            leads: batch.count,
            amount: batch.totalCents,
            error: 'No payment method on file',
          });
          continue;
        }

        // Mark events as processing (to prevent double-charging)
        await supabase
          .from('billing_events')
          .update({ status: 'processing' })
          .in('id', batch.eventIds);

        // Charge via Stripe
        const paymentIntent = await chargeForLeads(
          tradie.stripe_customer_id,
          batch.count,
          batch.totalCents,
          tradieId
        );

        // Create billing run record
        await supabase.from('billing_runs').insert({
          tradie_id: tradieId,
          lead_count: batch.count,
          total_cents: batch.totalCents,
          stripe_payment_intent_id: paymentIntent.id,
          status: paymentIntent.status === 'succeeded' ? 'success' : 'pending',
        });

        // If payment succeeded immediately, mark events as charged
        if (paymentIntent.status === 'succeeded') {
          await supabase
            .from('billing_events')
            .update({
              status: 'charged',
              stripe_payment_intent_id: paymentIntent.id,
              charged_at: new Date().toISOString(),
            })
            .in('id', batch.eventIds);
        }

        results.push({
          tradie_id: tradieId,
          status: paymentIntent.status === 'succeeded' ? 'success' : 'pending',
          leads: batch.count,
          amount: batch.totalCents,
        });

        console.log(`Charged tradie ${tradieId} (${tradie.business_name}): ${batch.count} leads, $${(batch.totalCents / 100).toFixed(2)}`);
      } catch (chargeError) {
        console.error(`Charge failed for tradie ${tradieId}:`, chargeError);

        // Revert events to pending
        await supabase
          .from('billing_events')
          .update({ status: 'pending' })
          .in('id', batch.eventIds);

        // Record failed run
        await supabase.from('billing_runs').insert({
          tradie_id: tradieId,
          lead_count: batch.count,
          total_cents: batch.totalCents,
          status: 'failed',
        });

        results.push({
          tradie_id: tradieId,
          status: 'failed',
          leads: batch.count,
          amount: batch.totalCents,
          error: chargeError instanceof Error ? chargeError.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${Object.keys(grouped).length} tradies`,
      results,
    });
  } catch (error) {
    console.error('Daily billing cron error:', error);
    return NextResponse.json({ error: 'Billing cron failed' }, { status: 500 });
  }
}
