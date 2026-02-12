import { NextRequest, NextResponse } from 'next/server';
import { validatePWAFromURL } from '@/lib/app-validator';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate server-side to avoid CORS issues when fetching manifest
    const result = await validatePWAFromURL(url.trim());
    return NextResponse.json(result);
  } catch (error) {
    console.error('Validate PWA error:', error);
    return NextResponse.json(
      { valid: false, error: 'Validation failed' },
      { status: 500 }
    );
  }
}
