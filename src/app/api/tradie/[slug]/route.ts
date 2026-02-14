import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: tradie, error } = await supabase
      .from('tradies')
      .select('business_name, google_review_link')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !tradie) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(tradie);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
