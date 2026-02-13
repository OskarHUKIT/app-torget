import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CuratorClient from './CuratorClient';

const CURATOR_EMAIL = process.env.CURATOR_EMAIL || '';

export default async function CuratorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/curator');
  }

  if (CURATOR_EMAIL && user.email !== CURATOR_EMAIL) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ingen tilgang
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kun kuratorer har tilgang til denne siden. Legg til CURATOR_EMAIL i .env.local for å begrense tilgang.
          </p>
        </div>
      </div>
    );
  }

  const { data: pending } = await supabase
    .from('content')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Kurator-dashboard</h1>
        <CuratorClient pending={pending || []} />
      </div>
    </main>
  );
}
