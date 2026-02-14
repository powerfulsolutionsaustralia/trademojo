import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-01-28.clover',
    });
  }
  return stripeInstance;
}

/**
 * Create a Stripe Checkout session in setup mode (add card on file).
 */
export async function createCheckoutSession(tradieId: string, email: string, returnUrl: string) {
  const stripe = getStripe();

  // Find or create Stripe customer
  const customers = await stripe.customers.list({ email, limit: 1 });
  let customer = customers.data[0];

  if (!customer) {
    customer = await stripe.customers.create({
      email,
      metadata: { tradie_id: tradieId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'setup',
    customer: customer.id,
    payment_method_types: ['card'],
    success_url: `${returnUrl}?setup=success`,
    cancel_url: `${returnUrl}?setup=cancelled`,
    metadata: { tradie_id: tradieId },
  });

  return { sessionUrl: session.url, customerId: customer.id };
}

/**
 * Charge a tradie for leads.
 */
export async function chargeForLeads(
  stripeCustomerId: string,
  leadCount: number,
  amountCents: number,
  tradieId: string
) {
  const stripe = getStripe();

  // Get the customer's default payment method
  const customer = await stripe.customers.retrieve(stripeCustomerId);
  if (customer.deleted) throw new Error('Customer deleted');

  const paymentMethods = await stripe.paymentMethods.list({
    customer: stripeCustomerId,
    type: 'card',
  });

  const paymentMethod = paymentMethods.data[0];
  if (!paymentMethod) throw new Error('No payment method on file');

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'aud',
    customer: stripeCustomerId,
    payment_method: paymentMethod.id,
    off_session: true,
    confirm: true,
    description: `TradeMojo: ${leadCount} lead${leadCount === 1 ? '' : 's'} @ $10 each`,
    metadata: {
      tradie_id: tradieId,
      lead_count: String(leadCount),
    },
  });

  return paymentIntent;
}

/**
 * Construct a Stripe webhook event.
 */
export async function constructWebhookEvent(body: string, signature: string) {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );
}

export { getStripe };
