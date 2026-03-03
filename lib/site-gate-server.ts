import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

type SiteGateCredentials = {
  password?: string;
  secret?: string;
};

function normalizeEnvValue(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseDotEnvValue(content: string, key: string): string | undefined {
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`));
  if (!line) return undefined;
  return normalizeEnvValue(line.slice(key.length + 1));
}

async function findEnvLocalPath(): Promise<string | null> {
  const roots = [process.cwd(), process.env.INIT_CWD].filter(Boolean) as string[];
  const checked = new Set<string>();

  for (const root of roots) {
    let current = path.resolve(root);
    while (!checked.has(current)) {
      checked.add(current);
      const candidate = path.join(current, '.env.local');
      try {
        await access(candidate);
        return candidate;
      } catch {
        // Continue walking up.
      }
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }

  return null;
}

export async function getSiteGateCredentials(): Promise<SiteGateCredentials> {
  let password = process.env.SITE_PASSWORD?.trim();
  let secret = process.env.SITE_GATE_SECRET?.trim();

  if (password && secret) {
    return { password, secret };
  }

  try {
    const envPath = await findEnvLocalPath();
    if (!envPath) return { password, secret };
    const envContent = await readFile(envPath, 'utf8');
    password = password || parseDotEnvValue(envContent, 'SITE_PASSWORD');
    secret = secret || parseDotEnvValue(envContent, 'SITE_GATE_SECRET');
  } catch {
    // No local env file in this environment.
  }

  return { password, secret };
}
