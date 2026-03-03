import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { createSiteGateToken, isSiteGateConfigured, SITE_GATE_COOKIE } from '@/lib/site-gate';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: { path?: string } }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  if (!isSiteGateConfigured()) {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  const isGatePath = pathname.startsWith('/site-gate');
  const isGateApi = pathname.startsWith('/api/site-gate');

  if (!isGatePath && !isGateApi) {
    const cookieToken = request.cookies.get(SITE_GATE_COOKIE)?.value;
    const expectedToken = await createSiteGateToken(
      process.env.SITE_PASSWORD as string,
      process.env.SITE_GATE_SECRET as string
    );

    if (!cookieToken || cookieToken !== expectedToken) {
      const url = new URL('/site-gate', request.url);
      const redirect = `${request.nextUrl.pathname}${request.nextUrl.search}`;
      url.searchParams.set('redirect', redirect);
      return NextResponse.redirect(url);
    }
  } else if (isGatePath) {
    const cookieToken = request.cookies.get(SITE_GATE_COOKIE)?.value;
    const expectedToken = await createSiteGateToken(
      process.env.SITE_PASSWORD as string,
      process.env.SITE_GATE_SECRET as string
    );
    if (cookieToken && cookieToken === expectedToken) {
      const redirect = request.nextUrl.searchParams.get('redirect');
      const target = redirect && redirect.startsWith('/') ? redirect : '/';
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
