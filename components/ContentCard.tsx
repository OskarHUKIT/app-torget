import Link from 'next/link';
import Image from 'next/image';
import { Content } from '@/lib/types';

interface ContentCardProps {
  content: Content;
}

export default function ContentCard({ content }: ContentCardProps) {
  const typeEmoji: Record<string, string> = {
    app: '📱',
    game: '🎮',
    poem: '📜',
    artwork: '🎨',
    idea: '💡',
  };
  const emoji = typeEmoji[content.type] || '📄';

  if (content.type === 'app' && content.app_id) {
    return (
      <Link href={`/app/${content.app_id}`}>
        <Card content={content} emoji={emoji} />
      </Link>
    );
  }

  return (
    <Link href={`/content/${content.id}`}>
      <Card content={content} emoji={emoji} />
    </Link>
  );
}

function Card({ content, emoji }: { content: Content; emoji: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col">
      <div className="flex items-start gap-4">
        {content.image_url ? (
          <div className="w-16 h-16 flex-shrink-0 relative">
            <Image
              src={content.image_url}
              alt={content.title}
              fill
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-16 h-16 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
            {emoji}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {content.type}
            </span>
            {content.is_curator_pick && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                Kurators utvalg
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {content.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {content.description || content.body_text || 'Ingen beskrivelse'}
          </p>
          {content.category && (
            <span className="inline-block mt-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              {content.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
