import { createClient } from '@/lib/supabase/server';
import AppGrid from '@/components/AppGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let apps = [];
  let error: Error | null = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
    }

    const supabase = await createClient();

    const result = await supabase
      .from('apps')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(20);

    apps = result.data || [];
    error = result.error ? new Error(result.error.message) : null;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    const isFetchFailed = message.includes('fetch failed') || (err instanceof TypeError && err.message === 'fetch failed');

    error = new Error(
      isFetchFailed
        ? 'Could not connect to Supabase. Common causes: (1) Supabase project is paused - go to supabase.com dashboard and resume it, (2) Wrong URL/key in environment variables, (3) Network/firewall blocking the connection.'
        : message
    );
    console.error('Error fetching apps:', err);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Discover Apps
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find and install web applications directly to your phone
            </p>
          </div>
          <Link
            href="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Upload App
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4">
            <p className="font-semibold mb-2">Error loading apps:</p>
            <p>{error.message}</p>
            <ul className="text-sm mt-2 list-disc list-inside space-y-1">
              <li>Supabase project paused? Check dashboard and resume it</li>
              <li>On Vercel? Add env vars in Project Settings</li>
              <li>Locally? Check .env.local has correct credentials</li>
              <li>Run the database migration in Supabase SQL Editor</li>
            </ul>
            <a href="/debug" className="text-sm mt-2 inline-block underline">Check connection at /debug</a>
          </div>
        ) : apps.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
              No apps available yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              Be the first to upload an app to the marketplace!
            </p>
            <Link
              href="/upload"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Upload Your First App
            </Link>
          </div>
        ) : (
          <AppGrid apps={apps} />
        )}
      </div>
    </main>
  );
}
