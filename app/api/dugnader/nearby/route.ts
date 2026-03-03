import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { type FeedItem } from '@/lib/mockFeed';

export const dynamic = 'force-dynamic';

interface NearbyRow {
  content_id: string;
  distance_km: number;
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams;
    const lat = Number(search.get('lat'));
    const lng = Number(search.get('lng'));
    const radiusKm = Number(search.get('radiusKm') || '30');
    const q = search.get('q') || null;
    const limit = Number(search.get('limit') || '60');

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: 'Ugyldige koordinater' }, { status: 400 });
    }

    const supabase = await createClient();
    const rpc = await supabase.rpc('get_nearby_dugnader', {
      input_lat: lat,
      input_lng: lng,
      input_radius_km: radiusKm,
      input_query: q,
      input_limit: limit,
    });

    if (rpc.error) {
      return NextResponse.json({ error: rpc.error.message }, { status: 500 });
    }

    const rows = (rpc.data || []) as NearbyRow[];
    if (rows.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const ids = rows.map((r) => r.content_id);
    const distanceById = new Map(rows.map((r) => [r.content_id, r.distance_km]));

    const contentResult = await supabase
      .from('content')
      .select('*')
      .in('id', ids)
      .eq('status', 'approved')
      .in('type', ['dugnad', 'event']);

    if (contentResult.error) {
      return NextResponse.json({ error: contentResult.error.message }, { status: 500 });
    }

    const order = new Map(ids.map((id, i) => [id, i]));
    const items = ((contentResult.data || []) as FeedItem[])
      .map((item) => ({ ...item, distanceKm: distanceById.get(item.id) ?? undefined }))
      .sort((a, b) => (order.get(a.id) ?? 9999) - (order.get(b.id) ?? 9999));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Nearby dugnader API error:', error);
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}

