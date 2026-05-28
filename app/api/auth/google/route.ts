import { NextResponse } from 'next/server';
import { getGoogleAuthUrl, isGoogleOAuthConfigured } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.json(
      {
        error: 'Server configuration error',
        details: 'Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI',
      },
      { status: 500 }
    );
  }

  return NextResponse.redirect(getGoogleAuthUrl());
}
