import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tradie profile
    const { data: tradie, error: tradieError } = await supabase
      .from('tradies')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tradieError || !tradie) {
      return NextResponse.json({ error: 'Tradie profile not found' }, { status: 404 });
    }

    // Get tradie site settings
    const { data: site } = await supabase
      .from('tradie_sites')
      .select('*')
      .eq('tradie_id', tradie.id)
      .single();

    // Get leads
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('tradie_id', tradie.id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get lead stats
    const allLeads = leads || [];
    const newLeads = allLeads.filter((l) => l.status === 'new');
    const thisWeekLeads = allLeads.filter((l) => {
      const created = new Date(l.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    });

    // Get review requests
    const { data: reviews } = await supabase
      .from('review_requests')
      .select('*')
      .eq('tradie_id', tradie.id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('tradie_id', tradie.id)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      tradie,
      site,
      leads: allLeads,
      reviews: reviews || [],
      bookings: bookings || [],
      stats: {
        total_leads: allLeads.length,
        new_leads: newLeads.length,
        this_week_leads: thisWeekLeads.length,
        total_reviews: (reviews || []).length,
        completed_reviews: (reviews || []).filter((r) => r.status === 'completed').length,
        total_bookings: (bookings || []).length,
        upcoming_bookings: (bookings || []).filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
        conversion_rate: allLeads.length > 0
          ? Math.round((allLeads.filter((l) => l.status === 'won').length / allLeads.length) * 100)
          : 0,
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
