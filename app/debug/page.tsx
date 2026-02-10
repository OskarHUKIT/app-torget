import { createClient } from '@/lib/supabase/server';

export default async function DebugPage() {
  const supabase = await createClient();

  // Test connection
  const { data: { user } } = await supabase.auth.getUser();
  
  // Test database query
  const { data: apps, error: appsError } = await supabase
    .from('apps')
    .select('count')
    .limit(1);

  // Test storage
  const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">SUPABASE_URL:</span>{' '}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </p>
              <p>
                <span className="font-medium">SUPABASE_ANON_KEY:</span>{' '}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <p className="text-sm">
              {user ? `✅ Logged in as: ${user.email}` : '❌ Not logged in'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
            {appsError ? (
              <div className="text-red-600 dark:text-red-400">
                <p className="font-semibold">❌ Error:</p>
                <p className="text-sm mt-2">{appsError.message}</p>
                <p className="text-sm mt-2">Code: {appsError.code}</p>
                <p className="text-sm mt-2">Details: {appsError.details}</p>
                <p className="text-sm mt-2">Hint: {appsError.hint}</p>
              </div>
            ) : (
              <p className="text-green-600 dark:text-green-400">✅ Database connection successful</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Storage</h2>
            {storageError ? (
              <div className="text-red-600 dark:text-red-400">
                <p className="font-semibold">❌ Error:</p>
                <p className="text-sm mt-2">{storageError.message}</p>
              </div>
            ) : (
              <div>
                <p className="text-green-600 dark:text-green-400 mb-2">✅ Storage connection successful</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Buckets: {buckets?.map(b => b.name).join(', ') || 'None'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
