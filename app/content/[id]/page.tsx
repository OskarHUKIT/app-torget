import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import InstallButton from '@/components/InstallButton';
import { PLACEHOLDER_FEED } from '@/lib/mockFeed';
import { MEDIA_LABELS, formatMediumDate } from '@/lib/content-utils';

export default async function ContentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let content: any = null;

  let supabase = null;
  if (params.id.startsWith('placeholder-')) {
    content = PLACEHOLDER_FEED.find((p) => p.id === params.id) ?? null;
    if (!content) notFound();
  } else {
    supabase = await createClient();
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', params.id)
      .single();
    if (error || !data || data.status !== 'approved') notFound();
    content = data;
  }

  let app = null;
  if (content.type === 'app' && content.app_id && !content.is_placeholder && supabase) {
    const { data } = await supabase.from('apps').select('*').eq('id', content.app_id).single();
    app = data;
  }

  const isApp = content.type === 'app' && app;
  const isPlaceholder = content.is_placeholder;
  const contentTypeKey = content.type as keyof typeof MEDIA_LABELS;

  return (
    <main className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {isPlaceholder && (
          <div className="mb-4 rounded-2xl border border-nytti-pink/30 bg-nytti-pink/10 px-4 py-3 text-center text-sm font-medium text-nytti-pink">
            ✨ Dette er eksempelinnhold for å vise feed-layouten
          </div>
        )}
        <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <div className="p-8 sm:p-10">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-muted">
                {MEDIA_LABELS[contentTypeKey] || content.type}
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
            {(content.type === 'dugnad' || content.type === 'event') && (
              <div className="mb-6 grid gap-3 rounded-xl border border-border bg-background/60 p-4 text-sm">
                {content.location_name && (
                  <p className="text-foreground"><span className="font-semibold">Sted:</span> {content.location_name}</p>
                )}
                {content.address && (
                  <p className="text-muted"><span className="font-semibold text-foreground">Adresse:</span> {content.address}</p>
                )}
                {formatMediumDate(content.starts_at) && (
                  <p className="text-muted"><span className="font-semibold text-foreground">Starter:</span> {formatMediumDate(content.starts_at)}</p>
                )}
                {formatMediumDate(content.ends_at) && (
                  <p className="text-muted"><span className="font-semibold text-foreground">Slutter:</span> {formatMediumDate(content.ends_at)}</p>
                )}
                {content.organizer && (
                  <p className="text-muted"><span className="font-semibold text-foreground">Arrangør:</span> {content.organizer}</p>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {content.url && !isApp && !isPlaceholder && (
                <a
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nytti-pink to-nytti-pink-dark px-6 py-3 font-bold text-white"
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
              className="inline-flex items-center gap-2 font-medium text-muted transition-colors hover:text-nytti-pink"
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
