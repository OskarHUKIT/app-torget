import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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

  const typeLabels: Record<string, string> = {
    app: 'App',
    game: 'Spill',
    poem: 'Dikt',
    artwork: 'Kunstverk',
    idea: 'Ide',
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">
              {typeLabels[content.type] || content.type}
            </span>
            {content.is_curator_pick && (
              <span className="ml-2 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                Kurators utvalg
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {content.title}
          </h1>
          {content.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              {content.description}
            </p>
          )}
          {content.image_url && (
            <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
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
            <div className="prose dark:prose-invert max-w-none mb-6 whitespace-pre-wrap">
              {content.body_text}
            </div>
          )}
          {content.url && (
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Åpne lenke
            </a>
          )}
          {content.category && (
            <div className="mt-6">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                {content.category}
              </span>
            </div>
          )}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              ← Tilbake til feed
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
