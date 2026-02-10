import { App } from '@/lib/types';
import AppCard from './AppCard';

interface AppGridProps {
  apps: App[];
}

export default function AppGrid({ apps }: AppGridProps) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No apps found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
