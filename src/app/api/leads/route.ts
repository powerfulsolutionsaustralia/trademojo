import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tradie_id, customer_name, customer_phone, service_needed, customer_email, description, urgency, source } = body;

    // Validate required fields
    if (!tradie_id || !customer_name || !customer_phone || !service_needed) {
      return NextResponse.json(
        { error: 'Name, phone, and service needed are required.' },
        { status: 400 }
      );
    }

    // TODO: Save to Supabase when DB is live
    // const supabase = await createClient();
    // const { data, error } = await supabase.from('leads').insert({
    //   tradie_id,
    //   customer_name,
    //   customer_phone,
    //   customer_email: customer_email || null,
    //   service_needed,
    //   description: description || null,
    //   urgency: urgency || 'medium',
    //   source: source || 'website',
    //   status: 'new',
    //   is_qualified: false,
    // }).select().single();

    // TODO: Send email notification to tradie
    // await sendEmail({ to: tradie.email, subject: `New lead: ${customer_name}`, ... })

    // TODO: Send SMS notification to tradie
    // await sendSMS({ to: tradie.phone, body: `New lead from ${customer_name}...` })

    // TODO: If PAYG plan, create billing event
    // await supabase.from('billing_events').insert({ tradie_id, event_type: 'lead_charge', amount_cents: 2500, lead_id: data.id })

    console.log('New lead received:', { tradie_id, customer_name, service_needed, source });

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.' },
      { status: 500 }
    );
  }
}
