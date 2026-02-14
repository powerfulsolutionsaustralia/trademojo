import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { constructWebhookEvent } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const event = await constructWebhookEvent(body, signature);
    const supabase = createAdminClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const tradieId = session.metadata?.tradie_id;

        if (tradieId && session.mode === 'setup') {
          // Mark tradie as having a payment method
          await supabase
            .from('tradies')
            .update({
              has_payment_method: true,
              stripe_customer_id: session.customer as string,
            })
            .eq('id', tradieId);

          console.log(`Payment method added for tradie ${tradieId}`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const tradieId = paymentIntent.metadata?.tradie_id;

        if (tradieId) {
          // Update billing run status
          await supabase
            .from('billing_runs')
            .update({ status: 'success' })
            .eq('stripe_payment_intent_id', paymentIntent.id);

          // Mark billing events as charged
          await supabase
            .from('billing_events')
            .update({
              status: 'charged',
              stripe_payment_intent_id: paymentIntent.id,
              charged_at: new Date().toISOString(),
            })
            .eq('tradie_id', tradieId)
            .eq('status', 'processing');

          console.log(`Payment succeeded for tradie ${tradieId}: ${paymentIntent.id}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const tradieId = paymentIntent.metadata?.tradie_id;

        if (tradieId) {
          // Mark billing run as failed
          await supabase
            .from('billing_runs')
            .update({ status: 'failed' })
            .eq('stripe_payment_intent_id', paymentIntent.id);

          // Revert billing events to pending so they can be retried
          await supabase
            .from('billing_events')
            .update({ status: 'pending' })
            .eq('tradie_id', tradieId)
            .eq('status', 'processing');

          console.error(`Payment failed for tradie ${tradieId}: ${paymentIntent.id}`);
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'setup_intent.succeeded': {
        // Handle additional events as needed
        console.log(`Received event: ${event.type}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed.' },
      { status: 400 }
    );
  }
}
