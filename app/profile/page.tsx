import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AppGrid from '@/components/AppGrid';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: apps } = await supabase
    .from('apps')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Apps</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Manage your uploaded applications
          </p>
          <Link
            href="/upload"
            className="inline-block bg-nytti-pink hover:bg-nytti-pink-dark text-white px-6 py-3 rounded-lg font-medium"
          >
            Upload New App
          </Link>
        </div>

        {apps && apps.length > 0 ? (
          <AppGrid apps={apps} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven&apos;t uploaded any apps yet.</p>
            <Link
              href="/upload"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Upload your first app →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
