import { NextRequest, NextResponse } from 'next/server';
import { createSiteGateToken, SITE_GATE_COOKIE } from '@/lib/site-gate';
import { getSiteGateCredentials } from '@/lib/site-gate-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = String(body?.password || '');
    const redirectTo = typeof body?.redirectTo === 'string' && body.redirectTo.startsWith('/') ? body.redirectTo : '/';
    const { password: expectedPassword, secret } = await getSiteGateCredentials();

    if (expectedPassword && password !== expectedPassword) {
      return NextResponse.json({ error: 'Feil passord' }, { status: 401 });
    }

    // Fallback for local/dev setups where private env vars are unavailable in runtime.
    // In that case, the gate still requires a manual unlock and stores a session cookie.
    if (!expectedPassword && password.length < 1) {
      return NextResponse.json({ error: 'Passord kan ikke være tomt' }, { status: 400 });
    }

    const tokenBase = expectedPassword || password;
    const tokenSecret = secret || 'nytti-site-gate-fallback';
    const token = await createSiteGateToken(tokenBase, tokenSecret);
    const response = NextResponse.json({ ok: true, redirectTo });

    response.cookies.set({
      name: SITE_GATE_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SITE_GATE_COOKIE,
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}

