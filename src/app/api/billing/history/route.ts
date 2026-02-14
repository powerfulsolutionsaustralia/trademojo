import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
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
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (tradieError || !tradie) {
      return NextResponse.json({ error: 'Tradie not found' }, { status: 404 });
    }

    // Fetch billing events (recent 50)
    const { data: events } = await supabase
      .from('billing_events')
      .select('*')
      .eq('tradie_id', tradie.id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Fetch billing runs (recent 20)
    const { data: runs } = await supabase
      .from('billing_runs')
      .select('*')
      .eq('tradie_id', tradie.id)
      .order('run_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      events: events || [],
      runs: runs || [],
    });
  } catch (error) {
    console.error('Billing history error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
