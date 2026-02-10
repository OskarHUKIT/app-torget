import Link from 'next/link';
import { App } from '@/lib/types';
import Image from 'next/image';

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/app/${app.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col">
        {app.icon_url ? (
          <div className="w-16 h-16 mb-4 relative">
            <Image
              src={app.icon_url}
              alt={app.name}
              fill
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-16 h-16 mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{app.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-2">
          {app.description || 'No description'}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{app.install_count} installs</span>
          {app.category && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              {app.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
