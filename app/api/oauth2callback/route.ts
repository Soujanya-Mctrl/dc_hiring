import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCodeForTokens, isGoogleOAuthConfigured } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.json(
      {
        error: 'Server configuration error',
        details: 'Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI',
      },
      { status: 500 }
    );
  }

  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error) {
    return NextResponse.json({ error: 'Google OAuth denied', details: error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  try {
    const tokens = await exchangeGoogleCodeForTokens(code);

    return NextResponse.json(
      {
        success: true,
        message: 'OAuth tokens exchanged successfully. Copy GOOGLE_REFRESH_TOKEN into your environment.',
        refreshToken: tokens.refresh_token || null,
        accessToken: tokens.access_token || null,
        expiryDate: tokens.expiry_date || null,
        scope: tokens.scope || null,
        tokenType: tokens.token_type || null,
      },
      { status: 200 }
    );
  } catch (tokenError: any) {
    console.error('❌ OAuth callback error:', tokenError.message);
    return NextResponse.json(
      { error: 'Failed to exchange Google auth code', details: tokenError.message },
      { status: 500 }
    );
  }
}