import { PWAManifest } from './types';

/**
 * Validates if a URL points to a valid PWA by checking for manifest.json
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

    // Try to fetch manifest.json
    const manifestUrl = `${baseUrl}/manifest.json`;
    const response = await fetch(manifestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        valid: false,
        error: `Could not fetch manifest.json: ${response.statusText}`,
      };
    }

    const manifest: PWAManifest = await response.json();

    // Basic validation
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
