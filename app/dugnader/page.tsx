import { createClient } from '@/lib/supabase/server';
import DugnaderExplorer from '@/components/DugnaderExplorer';
import { PLACEHOLDER_FEED, type FeedItem } from '@/lib/mockFeed';

export const dynamic = 'force-dynamic';

export default async function DugnaderPage() {
  let items: FeedItem[] = [];
  let error: Error | null = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = await createClient();
      const result = await supabase
        .from('content')
        .select('*')
        .eq('status', 'approved')
        .in('type', ['dugnad', 'event'])
        .order('starts_at', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(60);

      if (result.data?.length) {
        items = result.data.map((item) => ({ ...item } as FeedItem));
      }
      error = result.error ? new Error(result.error.message) : null;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ukjent feil';
    error = new Error(message);
  }

  if (items.length === 0) {
    items = PLACEHOLDER_FEED.filter((item) => item.type === 'dugnad' || item.type === 'event');
  }

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      {error && (
        <div className="mx-auto mt-4 max-w-6xl rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Kunne ikke hente dugnader fra databasen. Viser eksempelinnhold.
        </div>
      )}
      <DugnaderExplorer items={items} />
    </main>
  );
}

