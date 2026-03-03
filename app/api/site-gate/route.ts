import { NextRequest, NextResponse } from 'next/server';
import { createSiteGateToken, isSiteGateConfigured, SITE_GATE_COOKIE, SITE_GATE_TTL_SECONDS } from '@/lib/site-gate';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!isSiteGateConfigured()) {
      return NextResponse.json({ error: 'Site-gate er ikke konfigurert på serveren.' }, { status: 500 });
    }

    const body = await request.json();
    const password = String(body?.password || '');
    const redirectTo = typeof body?.redirectTo === 'string' && body.redirectTo.startsWith('/') ? body.redirectTo : '/';

    const expectedPassword = process.env.SITE_PASSWORD as string;
    const secret = process.env.SITE_GATE_SECRET as string;

    if (password !== expectedPassword) {
      return NextResponse.json({ error: 'Feil passord' }, { status: 401 });
    }

    const token = await createSiteGateToken(expectedPassword, secret);
    const response = NextResponse.json({ ok: true, redirectTo });

    response.cookies.set({
      name: SITE_GATE_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SITE_GATE_TTL_SECONDS,
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

