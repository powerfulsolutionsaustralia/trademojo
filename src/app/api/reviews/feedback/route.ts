import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendReviewFeedbackEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, rating, feedback, customer_name } = body;

    if (!slug || !rating || !feedback) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = await createClient();

    // Find the tradie by slug
    const { data: tradie, error: tradieError } = await supabase
      .from('tradies')
      .select('id, business_name, email, owner_name')
      .eq('slug', slug)
      .single();

    if (tradieError || !tradie) {
      return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
    }

    // Save review to database (private feedback)
    const { error: reviewError } = await supabase.from('reviews').insert({
      tradie_id: tradie.id,
      customer_name: customer_name || 'Anonymous',
      customer_email: '',
      rating,
      comment: feedback,
      is_public: false,
      source: 'website',
    });

    if (reviewError) {
      console.error('Review insert error:', reviewError);
    }

    // Email the tradie owner with the feedback
    try {
      await sendReviewFeedbackEmail(tradie.email, {
        businessName: tradie.business_name,
        customerName: customer_name || 'Anonymous',
        rating,
        feedback,
      });
    } catch (emailErr) {
      console.error('Review email error:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Review feedback error:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
