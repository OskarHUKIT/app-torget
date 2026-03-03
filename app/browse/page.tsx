import { createClient } from '@/lib/supabase/server';
import LibraryExplorer from '@/components/LibraryExplorer';
import { PLACEHOLDER_FEED, type FeedItem } from '@/lib/mockFeed';

export const dynamic = 'force-dynamic';

interface BrowsePageProps {
  searchParams?: { type?: string; q?: string };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  let content: FeedItem[] = [];
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
        .order('created_at', { ascending: false })
        .limit(50);

      if (result.data?.length) {
        content = result.data.map((c) => ({ ...c } as FeedItem));
      } else {
        const appsResult = await supabase
          .from('apps')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(30);
        if (appsResult.data?.length) {
          content = appsResult.data.map((app: any) => ({
            id: app.id,
            type: 'app',
            title: app.name,
            description: app.description,
            author_id: app.author_id,
            app_id: app.id,
            url: app.install_url,
            image_url: app.icon_url,
            body_text: null,
            metadata: {},
            category: app.category,
            tags: app.tags || [],
            region: null,
            created_at: app.created_at,
            updated_at: app.updated_at,
            status: 'approved',
            curator_notes: null,
            is_curator_pick: false,
          })) as FeedItem[];
        }
      }
      error = result.error ? new Error(result.error.message) : null;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ukjent feil';
    error = new Error(
      message.includes('fetch failed') || (err instanceof TypeError && (err as Error).message === 'fetch failed')
        ? 'Kunne ikke koble til Supabase.'
        : message
    );
  }

  const mergedFeed: FeedItem[] =
    content.length > 0
      ? content
      : (() => {
          const withImages = PLACEHOLDER_FEED.filter((p) => p.type === 'artwork' && p.image_url);
          const noImages = PLACEHOLDER_FEED.filter((p) => p.type !== 'artwork' || !p.image_url);
          return [...noImages, ...withImages.slice(0, 1)];
        })();
  mergedFeed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <main className="relative min-h-screen pb-24 md:pb-0">
      {error && mergedFeed.length > 0 && (
        <div className="mx-auto mt-4 max-w-6xl rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Viser eksempelinnhold
        </div>
      )}
      {error && mergedFeed.length === 0 && (
        <div className="mx-auto mt-4 max-w-6xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error.message}
        </div>
      )}
      <LibraryExplorer items={mergedFeed} initialType={searchParams?.type} initialQuery={searchParams?.q} />
    </main>
  );
}
