import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import InstallButton from '@/components/InstallButton';
import Image from 'next/image';
import Link from 'next/link';

export default async function AppDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: app, error } = await supabase
    .from('apps')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !app) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user && app.author_id === user.id;

  if (app.status !== 'approved' && !isOwner) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {app.icon_url ? (
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-foreground/5">
                  <Image
                    src={app.icon_url}
                    alt={app.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-2xl bg-foreground/5 text-5xl">
                  📱
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                  {app.name}
                </h1>
                {app.description && (
                  <p className="text-muted mb-4">{app.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {app.category && (
                    <span className="rounded-full bg-nytti-pink/15 px-3 py-1 text-sm font-medium text-nytti-pink">
                      {app.category}
                    </span>
                  )}
                  {app.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-foreground/5 px-3 py-1 text-sm font-medium text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span>{app.install_count} installasjoner</span>
                  {app.rating > 0 && <span>⭐ {app.rating.toFixed(1)}</span>}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <InstallButton app={app} />
            </div>

            {app.screenshots && app.screenshots.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Skjermbilder</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {app.screenshots.map((screenshot: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-video overflow-hidden rounded-xl bg-foreground/5"
                    >
                      <Image
                        src={screenshot}
                        alt={`Skjermbilde ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-border px-8 sm:px-10 py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-medium text-muted transition-colors hover:text-foreground"
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
