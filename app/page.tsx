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

  const featured = content.filter((c) => c.is_curator_pick).slice(0, 3);
  const rest = content.filter((c) => !c.is_curator_pick || !featured.some((f) => f.id === c.id));
  // If no curator picks, take first 3 as featured
  const featuredItems = featured.length > 0 ? featured : content.slice(0, 3);
  const restItems = featured.length > 0 ? rest : content.slice(3);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-nytti-pink/5 via-transparent to-transparent" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-nytti-pink/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Nytti
              </h1>
              <p className="mt-3 font-body text-lg sm:text-xl text-muted max-w-lg">
                Kultur og samfunnsnyttig innhold for Norge – dikt, kunstverk, apper og spill.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex shrink-0 items-center justify-center gap-2 bg-nytti-pink hover:bg-nytti-pink-dark text-white px-6 py-3.5 rounded-xl font-semibold shadow-card hover:shadow-card-hover transition-all duration-200 active:scale-[0.98]"
            >
              <span>Last opp</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4">
            <p className="font-semibold mb-2">Feil ved lasting:</p>
            <p>{error.message}</p>
            <p className="text-sm mt-2">
              Kjør migrasjonene i Supabase (001, 002, 003) hvis du nettopp har oppgradert.
            </p>
          </div>
        ) : content.length === 0 ? (
          <div className="rounded-2xl bg-surface border border-border p-12 text-center shadow-card">
            <p className="font-display text-xl text-foreground mb-4">Ingen innhold ennå</p>
            <p className="text-muted mb-6">Vær den første som laster opp innhold til Nytti!</p>
            <Link
              href="/upload"
              className="inline-flex bg-nytti-pink hover:bg-nytti-pink-dark text-white px-6 py-3 rounded-xl font-semibold"
            >
              Last opp innhold
            </Link>
          </div>
        ) : (
          <>
            {/* Featured section */}
            {featuredItems.length > 0 && (
              <section className="mb-14">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-6">
                  Kurators utvalg
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredItems.map((item, i) => (
                    <ContentCard key={item.id} content={item} index={i} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Rest of feed */}
            <section>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-6">
                Alt innhold
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                {restItems.map((item, i) => (
                  <ContentCard key={item.id} content={item} index={featuredItems.length + i} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
