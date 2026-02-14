import { Resend } from 'resend';

// Lazy init — don't crash at build time when env var is missing
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = 'TradeMojo <team@trademojo.com.au>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'stuart@trademojo.com.au';

/**
 * Send welcome email to new tradie with their login credentials
 */
export async function sendWelcomeEmail(
  to: string,
  businessName: string,
  tempPassword: string,
  slug: string
) {
  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to TradeMojo — ${businessName} is live!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #1E293B; margin: 0;">
              Welcome to Trade<span style="color: #F97316;">Mojo</span>
            </h1>
          </div>

          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            G'day! Your listing for <strong>${businessName}</strong> has been submitted and is being reviewed.
          </p>

          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Once approved, your business will appear in our directory and you'll have access to your own professional website.
          </p>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="font-size: 14px; color: #64748B; margin: 0 0 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Your Dashboard Login</p>
            <p style="font-size: 15px; color: #334155; margin: 4px 0;"><strong>Email:</strong> ${to}</p>
            <p style="font-size: 15px; color: #334155; margin: 4px 0;"><strong>Password:</strong> ${tempPassword}</p>
            <p style="font-size: 13px; color: #94A3B8; margin: 12px 0 0;">Please change your password after your first login.</p>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="font-size: 14px; color: #64748B; margin: 0 0 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Your Links</p>
            <p style="font-size: 15px; color: #334155; margin: 4px 0;">
              <strong>Website:</strong>
              <a href="https://trademojo.com.au/t/${slug}" style="color: #F97316;">trademojo.com.au/t/${slug}</a>
            </p>
            <p style="font-size: 15px; color: #334155; margin: 4px 0;">
              <strong>Dashboard:</strong>
              <a href="https://trademojo.com.au/dashboard" style="color: #F97316;">trademojo.com.au/dashboard</a>
            </p>
          </div>

          <p style="font-size: 14px; color: #94A3B8; margin-top: 32px; text-align: center;">
            Questions? Reply to this email — we're here to help.<br />
            — The TradeMojo Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Welcome email error:', error);
      return { success: false, error };
    }
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Welcome email failed:', error);
    return { success: false, error };
  }
}

/**
 * Send approval notification to tradie
 */
export async function sendApprovalEmail(
  to: string,
  businessName: string,
  slug: string
) {
  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${businessName} has been approved on TradeMojo!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #1E293B; margin: 0;">
              Trade<span style="color: #F97316;">Mojo</span>
            </h1>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: #ECFDF5; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; font-size: 32px;">
              ✅
            </div>
          </div>

          <h2 style="font-size: 22px; color: #1E293B; text-align: center; margin: 0 0 16px;">
            You're Approved!
          </h2>

          <p style="font-size: 16px; color: #334155; line-height: 1.6; text-align: center;">
            <strong>${businessName}</strong> is now live on TradeMojo. Customers in your area can find you in our directory and contact you directly.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://trademojo.com.au/t/${slug}" style="display: inline-block; background: #F97316; color: white; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">
              View Your Website
            </a>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://trademojo.com.au/dashboard" style="display: inline-block; background: #8B5CF6; color: white; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">
              Go to Dashboard
            </a>
          </div>

          <p style="font-size: 14px; color: #94A3B8; margin-top: 32px; text-align: center;">
            — The TradeMojo Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Approval email error:', error);
      return { success: false, error };
    }
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Approval email failed:', error);
    return { success: false, error };
  }
}

/**
 * Send new lead notification to tradie
 */
export async function sendNewLeadNotification(
  to: string,
  leadData: {
    businessName: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    serviceNeeded: string;
    description?: string;
    urgency?: string;
  }
) {
  const urgencyColor =
    leadData.urgency === 'emergency'
      ? '#EF4444'
      : leadData.urgency === 'high'
        ? '#F97316'
        : '#3B82F6';

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New Lead: ${leadData.customerName} needs ${leadData.serviceNeeded}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 24px; color: #1E293B; margin: 0;">
              New Lead for <span style="color: #F97316;">${leadData.businessName}</span>
            </h1>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 16px 0;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="background: ${urgencyColor}; color: white; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">
                ${leadData.urgency || 'medium'}
              </span>
            </div>
            <p style="font-size: 15px; color: #334155; margin: 6px 0;"><strong>Customer:</strong> ${leadData.customerName}</p>
            <p style="font-size: 15px; color: #334155; margin: 6px 0;"><strong>Phone:</strong> <a href="tel:${leadData.customerPhone}" style="color: #F97316;">${leadData.customerPhone}</a></p>
            ${leadData.customerEmail ? `<p style="font-size: 15px; color: #334155; margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${leadData.customerEmail}" style="color: #F97316;">${leadData.customerEmail}</a></p>` : ''}
            <p style="font-size: 15px; color: #334155; margin: 6px 0;"><strong>Service:</strong> ${leadData.serviceNeeded}</p>
            ${leadData.description ? `<p style="font-size: 15px; color: #334155; margin: 6px 0;"><strong>Details:</strong> ${leadData.description}</p>` : ''}
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="tel:${leadData.customerPhone}" style="display: inline-block; background: #10B981; color: white; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">
              📞 Call ${leadData.customerName}
            </a>
          </div>

          <div style="text-align: center; margin: 16px 0;">
            <a href="https://trademojo.com.au/dashboard/leads" style="color: #8B5CF6; font-weight: 600; text-decoration: none; font-size: 14px;">
              View all leads in your dashboard →
            </a>
          </div>

          <p style="font-size: 14px; color: #94A3B8; margin-top: 32px; text-align: center;">
            — TradeMojo
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Lead notification email error:', error);
      return { success: false, error };
    }
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Lead notification email failed:', error);
    return { success: false, error };
  }
}

/**
 * Send review feedback notification to tradie
 */
export async function sendReviewFeedbackEmail(
  to: string,
  data: {
    businessName: string;
    customerName: string;
    rating: number;
    feedback: string;
  }
) {
  const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);

  try {
    const { data: emailData, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Private Feedback: ${data.customerName} left a ${data.rating}-star review`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 24px; color: #1E293B; margin: 0;">
              Private Feedback for <span style="color: #F97316;">${data.businessName}</span>
            </h1>
          </div>

          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 20px; margin: 16px 0;">
            <p style="font-size: 24px; text-align: center; margin: 0 0 8px;">${stars}</p>
            <p style="font-size: 15px; color: #334155; margin: 6px 0;"><strong>Customer:</strong> ${data.customerName}</p>
            <p style="font-size: 15px; color: #334155; margin: 6px 0;"><strong>Rating:</strong> ${data.rating} out of 5</p>
            <p style="font-size: 15px; color: #334155; margin: 12px 0 0;"><strong>Feedback:</strong></p>
            <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 4px 0;">${data.feedback}</p>
          </div>

          <p style="font-size: 14px; color: #64748B; line-height: 1.6; margin: 16px 0;">
            This feedback was submitted privately through your TradeMojo review page. The customer rated below 5 stars, so they were given the option to send feedback directly to you instead of posting publicly.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://trademojo.com.au/dashboard/reviews" style="display: inline-block; background: #8B5CF6; color: white; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">
              View in Dashboard
            </a>
          </div>

          <p style="font-size: 14px; color: #94A3B8; margin-top: 32px; text-align: center;">
            — TradeMojo
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Review feedback email error:', error);
      return { success: false, error };
    }
    return { success: true, id: emailData?.id };
  } catch (error) {
    console.error('Review feedback email failed:', error);
    return { success: false, error };
  }
}

/**
 * Send admin alert (new signups, flagged businesses, etc.)
 */
export async function sendAdminAlert(subject: string, body: string) {
  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[TradeMojo Admin] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <h2 style="font-size: 20px; color: #1E293B; margin: 0 0 16px;">${subject}</h2>
          <div style="font-size: 15px; color: #334155; line-height: 1.6;">
            ${body}
          </div>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
          <p style="font-size: 13px; color: #94A3B8;">
            <a href="https://trademojo.com.au/dashboard" style="color: #8B5CF6;">Open Admin Dashboard</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Admin alert email error:', error);
      return { success: false, error };
    }
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Admin alert email failed:', error);
    return { success: false, error };
  }
}

/**
 * Send rejection email to tradie
 */
export async function sendRejectionEmail(
  to: string,
  businessName: string,
  reason?: string
) {
  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Update on your TradeMojo listing — ${businessName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #1E293B; margin: 0;">
              Trade<span style="color: #F97316;">Mojo</span>
            </h1>
          </div>

          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Thanks for your interest in listing <strong>${businessName}</strong> on TradeMojo.
          </p>

          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Unfortunately, we weren't able to approve your listing at this time.
            ${reason ? `<br /><br /><strong>Reason:</strong> ${reason}` : ''}
          </p>

          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            If you believe this was a mistake or would like to provide additional information, please reply to this email and we'll review your application again.
          </p>

          <p style="font-size: 14px; color: #94A3B8; margin-top: 32px; text-align: center;">
            — The TradeMojo Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Rejection email error:', error);
      return { success: false, error };
    }
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Rejection email failed:', error);
    return { success: false, error };
  }
}
