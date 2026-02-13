import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import InstallButton from '@/components/InstallButton';

export default async function ContentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: content, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !content || content.status !== 'approved') {
    notFound();
  }

  let app = null;
  if (content.type === 'app' && content.app_id) {
    const { data } = await supabase.from('apps').select('*').eq('id', content.app_id).single();
    app = data;
  }

  const typeLabels: Record<string, string> = {
    app: 'App',
    game: 'Spill',
    poem: 'Dikt',
    artwork: 'Kunstverk',
    idea: 'Ide',
  };

  const isApp = content.type === 'app' && app;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-muted">
                {typeLabels[content.type] || content.type}
              </span>
              {content.is_curator_pick && (
                <span className="rounded-full bg-nytti-pink/15 px-2.5 py-0.5 text-xs font-medium text-nytti-pink">
                  Kurators utvalg
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              {content.title}
            </h1>
            {content.description && (
              <p className="text-lg text-muted mb-6">{content.description}</p>
            )}
            {content.image_url && (
              <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-foreground/5">
                <Image
                  src={content.image_url}
                  alt={content.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            {content.body_text && (
              <div className="font-body text-foreground leading-relaxed whitespace-pre-wrap mb-6">
                {content.body_text}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {content.url && !isApp && (
                <a
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-nytti-pink hover:bg-nytti-pink-dark text-white font-semibold py-3 px-6"
                >
                  Åpne lenke
                  <span aria-hidden>→</span>
                </a>
              )}
              {isApp && app && <InstallButton app={app} />}
              {content.category && (
                <span className="inline-flex rounded-full bg-foreground/5 px-3 py-1.5 text-sm font-medium text-muted">
                  {content.category}
                </span>
              )}
            </div>
          </div>
          <div className="border-t border-border px-8 sm:px-10 py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted hover:text-foreground font-medium transition-colors"
            >
              <span aria-hidden>←</span>
              Tilbake til feed
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
