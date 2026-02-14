import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendNewLeadNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tradie_id,
      customer_name,
      customer_phone,
      service_needed,
      customer_email,
      description,
      urgency,
      source,
    } = body;

    // Validate required fields
    if (!tradie_id || !customer_name || !customer_phone || !service_needed) {
      return NextResponse.json(
        { error: 'Name, phone, and service needed are required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get the tradie info for email notification
    const { data: tradie, error: tradieError } = await supabase
      .from('tradies')
      .select('email, business_name, phone, plan_tier')
      .eq('id', tradie_id)
      .single();

    if (tradieError || !tradie) {
      console.error('Tradie lookup error:', tradieError);
      // Still save the lead even if we can't find the tradie
    }

    // Save lead to Supabase
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        tradie_id,
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        service_needed,
        description: description || null,
        urgency: urgency || 'medium',
        source: source || 'website',
        status: 'new',
        is_qualified: false,
      })
      .select()
      .single();

    if (leadError) {
      console.error('Lead insert error:', leadError);
      return NextResponse.json(
        { error: 'Failed to submit lead. Please try again.' },
        { status: 500 }
      );
    }

    // Send email notification to tradie
    if (tradie?.email) {
      await sendNewLeadNotification(tradie.email, {
        businessName: tradie.business_name,
        customerName: customer_name,
        customerPhone: customer_phone,
        customerEmail: customer_email,
        serviceNeeded: service_needed,
        description,
        urgency: urgency || 'medium',
      });
    }

    // TODO: If PAYG plan, create billing event
    // if (tradie?.plan_tier === 'payg') {
    //   await supabase.from('billing_events').insert({
    //     tradie_id,
    //     event_type: 'lead_charge',
    //     amount_cents: 2500,
    //     lead_id: lead.id,
    //   });
    // }

    console.log('New lead saved:', {
      lead_id: lead.id,
      tradie_id,
      customer_name,
      service_needed,
      source: source || 'website',
    });

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      lead_id: lead.id,
    });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.' },
      { status: 500 }
    );
  }
}
