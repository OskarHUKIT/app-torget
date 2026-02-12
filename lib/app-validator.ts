import { PWAManifest } from './types';

const MANIFEST_PATHS = [
  '/manifest.json',
  '/manifest.webmanifest',
  '/site.webmanifest',
  '/app.webmanifest',
];

/**
 * Validates if a URL points to a valid PWA by checking for a manifest file
 */
export async function validatePWAFromURL(url: string): Promise<{
  valid: boolean;
  manifest?: PWAManifest;
  manifestUrl?: string;
  error?: string;
}> {
  try {
    // Ensure URL has protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const baseUrl = new URL(fullUrl).origin;

    let lastError = '';

    // Try common manifest paths
    for (const path of MANIFEST_PATHS) {
      const manifestUrl = `${baseUrl}${path}`;
      try {
        const response = await fetch(manifestUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json, application/manifest+json',
          },
        });

        if (!response.ok) {
          lastError = `${path}: ${response.statusText}`;
          continue;
        }

        const manifest: PWAManifest = await response.json();

        if (!manifest.name) {
          return {
            valid: false,
            error: 'Manifest missing required field: name',
          };
        }

        return {
          valid: true,
          manifest,
          manifestUrl,
        };
      } catch {
        lastError = `${path}: not found`;
        continue;
      }
    }

    // Try to find manifest link in HTML as fallback
    try {
      const pageResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: { Accept: 'text/html' },
      });
      if (pageResponse.ok) {
        const html = await pageResponse.text();
        const manifestMatch = html.match(/<link[^>]+rel=["']manifest["'][^>]+href=["']([^"']+)["']/i)
          || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']manifest["']/i);
        if (manifestMatch) {
          const manifestHref = manifestMatch[1];
          const linkedUrl = manifestHref.startsWith('http')
            ? manifestHref
            : new URL(manifestHref, baseUrl).href;
          const mResponse = await fetch(linkedUrl, {
            headers: { Accept: 'application/json, application/manifest+json' },
          });
          if (mResponse.ok) {
            const manifest: PWAManifest = await mResponse.json();
            if (manifest.name) {
              return { valid: true, manifest, manifestUrl: linkedUrl };
            }
          }
        }
      }
    } catch {
      // Ignore HTML parse errors
    }

    return {
      valid: false,
      error: `Could not find a PWA manifest. Tried ${MANIFEST_PATHS.join(', ')}. If your app uses a different path, use "Add Link" instead.`,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validates a PWA manifest object
 */
export function validateManifest(manifest: PWAManifest): {
  valid: boolean;
  error?: string;
} {
  if (!manifest.name) {
    return {
      valid: false,
      error: 'Manifest missing required field: name',
    };
  }

  return { valid: true };
}

/**
 * Extracts metadata from a PWA manifest
 */
export function extractMetadataFromManifest(
  manifest: PWAManifest,
  baseUrl: string
): {
  name: string;
  description: string | null;
  iconUrl: string | null;
} {
  const iconUrl = manifest.icons?.[0]?.src
    ? new URL(manifest.icons[0].src, baseUrl).href
    : null;

  return {
    name: manifest.name,
    description: manifest.description || null,
    iconUrl,
  };
}
