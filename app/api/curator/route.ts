import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const curatorEmail = process.env.CURATOR_EMAIL;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Server miskonfigurert' },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Må være logget inn' }, { status: 401 });
    }

    const supabaseAuth = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Ugyldig sesjon' }, { status: 401 });
    }

    if (curatorEmail && user.email !== curatorEmail) {
      return NextResponse.json({ error: 'Ingen kuratortilgang' }, { status: 403 });
    }

    const body = await request.json();
    const { action, contentId, isCuratorPick } = body;
    if (!action || !contentId) {
      return NextResponse.json({ error: 'Mangler action eller contentId' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    if (action === 'approve') {
      const { error } = await supabase
        .from('content')
        .update({
          status: 'approved',
          is_curator_pick: isCuratorPick ?? false,
        })
        .eq('id', contentId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (action === 'reject') {
      const { error } = await supabase
        .from('content')
        .update({ status: 'rejected' })
        .eq('id', contentId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Ukjent action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Curator API error:', err);
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}
