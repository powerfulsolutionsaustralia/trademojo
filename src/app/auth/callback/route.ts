import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Handles Supabase auth callbacks (email confirmations, OAuth, magic links, etc.)
 * Supabase redirects here with auth tokens in the URL hash or query params.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle error redirects from Supabase (e.g., expired OTP)
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    const redirectUrl = new URL('/login', origin);
    redirectUrl.searchParams.set('error', errorDescription || error);
    return NextResponse.redirect(redirectUrl);
  }

  // Exchange the auth code for a session
  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Auth code exchange error:', exchangeError);
      const redirectUrl = new URL('/login', origin);
      redirectUrl.searchParams.set('error', 'Failed to verify email. Please try logging in.');
      return NextResponse.redirect(redirectUrl);
    }

    // Successfully authenticated — redirect to dashboard
    return NextResponse.redirect(new URL(next, origin));
  }

  // No code or error — redirect to login
  return NextResponse.redirect(new URL('/login', origin));
}
