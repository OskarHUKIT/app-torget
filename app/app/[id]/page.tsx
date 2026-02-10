import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import InstallButton from '@/components/InstallButton';
import Image from 'next/image';

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

  // Only show approved apps or apps owned by the user
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user && app.author_id === user.id;
  
  if (app.status !== 'approved' && !isOwner) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {app.icon_url ? (
              <div className="w-32 h-32 relative flex-shrink-0">
                <Image
                  src={app.icon_url}
                  alt={app.name}
                  fill
                  className="rounded-lg object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-5xl">📱</span>
              </div>
            )}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {app.name}
              </h1>
              {app.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">{app.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {app.category && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                    {app.category}
                  </span>
                )}
                {app.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{app.install_count} installs</span>
                {app.rating > 0 && <span>⭐ {app.rating.toFixed(1)}</span>}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <InstallButton app={app} />
          </div>

          {app.screenshots && app.screenshots.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {app.screenshots.map((screenshot: string, index: number) => (
                  <div key={index} className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
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
      </div>
    </main>
  );
}
