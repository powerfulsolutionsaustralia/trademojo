import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tradie record
    const { data: tradie, error: tradieError } = await supabase
      .from('tradies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (tradieError || !tradie) {
      return NextResponse.json({ error: 'Tradie not found' }, { status: 404 });
    }

    // Fetch reviews (both public and private)
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('tradie_id', tradie.id)
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({ reviews: reviews || [] });
  } catch (error) {
    console.error('Reviews list error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
