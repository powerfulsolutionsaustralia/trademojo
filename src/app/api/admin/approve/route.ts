import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { sendApprovalEmail, sendRejectionEmail, sendAdminAlert } from '@/lib/email';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'stuart@trademojo.com.au';

export async function POST(request: Request) {
  try {
    // Verify the caller is authenticated and is an admin
    const supabaseUser = await createClient();
    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (by email)
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { tradie_id, action, reason } = body;

    if (!tradie_id || !action) {
      return NextResponse.json(
        { error: 'Missing tradie_id or action' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get the tradie
    const { data: tradie, error: fetchError } = await supabase
      .from('tradies')
      .select('*')
      .eq('id', tradie_id)
      .single();

    if (fetchError || !tradie) {
      return NextResponse.json(
        { error: 'Tradie not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Approve the tradie
      const { error: updateError } = await supabase
        .from('tradies')
        .update({
          is_approved: true,
          is_active: true,
          approved_at: new Date().toISOString(),
        })
        .eq('id', tradie_id);

      if (updateError) {
        console.error('Approval update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to approve tradie' },
          { status: 500 }
        );
      }

      // Activate directory listing
      await supabase
        .from('directory_listings')
        .update({ is_active: true })
        .eq('tradie_id', tradie_id);

      // Send approval email
      await sendApprovalEmail(tradie.email, tradie.business_name, tradie.slug);

      return NextResponse.json({
        success: true,
        message: `${tradie.business_name} has been approved and is now live.`,
      });
    } else {
      // Reject the tradie
      const { error: updateError } = await supabase
        .from('tradies')
        .update({
          is_approved: false,
          is_active: false,
          verification_notes: {
            ...(tradie.verification_notes || {}),
            rejection_reason: reason || 'Did not meet verification criteria',
            rejected_at: new Date().toISOString(),
          },
        })
        .eq('id', tradie_id);

      if (updateError) {
        console.error('Rejection update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to reject tradie' },
          { status: 500 }
        );
      }

      // Deactivate directory listing
      await supabase
        .from('directory_listings')
        .update({ is_active: false })
        .eq('tradie_id', tradie_id);

      // Send rejection email
      await sendRejectionEmail(tradie.email, tradie.business_name, reason);

      // Notify admin
      await sendAdminAlert(
        `Tradie rejected: ${tradie.business_name}`,
        `<p><strong>${tradie.business_name}</strong> (${tradie.email}) was rejected.</p>
         <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>`
      );

      return NextResponse.json({
        success: true,
        message: `${tradie.business_name} has been rejected.`,
      });
    }
  } catch (error) {
    console.error('Admin approve error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
