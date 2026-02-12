import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tradie_id, customer_name, customer_phone, customer_email, method } = body;

    if (!tradie_id || !customer_name || (!customer_phone && !customer_email)) {
      return NextResponse.json(
        { error: 'Tradie ID, customer name, and phone or email are required.' },
        { status: 400 }
      );
    }

    // TODO: Save review request to Supabase
    // const supabase = await createClient();
    // const { data, error } = await supabase.from('review_requests').insert({
    //   tradie_id,
    //   customer_name,
    //   customer_phone,
    //   customer_email,
    //   method: method || 'sms',
    //   status: 'pending',
    // }).select().single();

    // TODO: Send review request via SMS
    // if (method === 'sms' && customer_phone) {
    //   const reviewLink = `https://trademojo.com.au/t/${tradie.slug}/review`;
    //   await sendSMS({ to: customer_phone, body: `Hi ${customer_name}! Thanks for choosing ${tradie.business_name}. We'd love your feedback: ${reviewLink}` });
    //   await supabase.from('review_requests').update({ status: 'sent', sent_at: new Date() }).eq('id', data.id);
    // }

    // TODO: Send review request via Email
    // if (method === 'email' && customer_email) { ... }

    console.log('Review request created:', { tradie_id, customer_name, method });

    return NextResponse.json({
      success: true,
      message: 'Review request sent successfully',
    });
  } catch (error) {
    console.error('Review API error:', error);
    return NextResponse.json(
      { error: 'Failed to send review request.' },
      { status: 500 }
    );
  }
}
