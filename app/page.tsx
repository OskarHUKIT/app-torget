import { createClient } from '@/lib/supabase/server';
import ContentCard from '@/components/ContentCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let content: any[] = [];
  let error: Error | null = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Mangler Supabase-oppsett. Legg til NEXT_PUBLIC_SUPABASE_URL og NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    const supabase = await createClient();

    const result = await supabase
      .from('content')
      .select('*')
      .eq('status', 'approved')
      .order('is_curator_pick', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30);

    content = result.data || [];
    error = result.error ? new Error(result.error.message) : null;

    if (content.length === 0 && !error) {
      const appsResult = await supabase
        .from('apps')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20);
      if (appsResult.data && appsResult.data.length > 0) {
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
        }));
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ukjent feil';
    const isFetchFailed =
      message.includes('fetch failed') ||
      (err instanceof TypeError && (err as Error).message === 'fetch failed');
    error = new Error(
      isFetchFailed
        ? 'Kunne ikke koble til Supabase. Sjekk at prosjektet er aktivt og at env-variablene er riktige.'
        : message
    );
    console.error('Error fetching feed:', err);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Nytti
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kultur og samfunnsnyttig innhold for Norge
            </p>
          </div>
          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shrink-0"
          >
            Last opp
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4">
            <p className="font-semibold mb-2">Feil ved lasting:</p>
            <p>{error.message}</p>
            <p className="text-sm mt-2">
              Kjør migrasjonene i Supabase (001, 002, 003) hvis du nettopp har oppgradert.
            </p>
          </div>
        ) : content.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
              Ingen innhold ennå
            </p>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              Vær den første som laster opp innhold til Nytti!
            </p>
            <Link
              href="/upload"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Last opp innhold
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
