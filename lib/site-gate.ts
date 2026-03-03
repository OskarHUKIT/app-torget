const encoder = new TextEncoder();

export const SITE_GATE_COOKIE = 'nytti_site_gate';
export const SITE_GATE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function createSiteGateToken(password: string, secret: string): Promise<string> {
  const payload = `${password}::${secret}`;
  const buffer = encoder.encode(payload);
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function isSiteGateConfigured(): boolean {
  return Boolean(process.env.SITE_PASSWORD && process.env.SITE_GATE_SECRET);
}

