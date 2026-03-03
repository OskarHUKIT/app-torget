'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSessionReady(Boolean(data.session));
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setSessionReady(Boolean(session));
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError('Passord må være minst 6 tegn.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passordene matcher ikke.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Passord oppdatert. Du kan nå logge inn.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke oppdatere passord');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 dark:bg-[#0f0f12]">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-xl font-medium text-contrast dark:text-gray-200">Sett nytt passord</h1>
        <p className="mt-2 text-sm text-muted">
          Bruk lenken fra e-posten for å åpne denne siden, og velg et nytt passord.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}
        {message && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
            {message}{' '}
            <Link href="/login" className="font-semibold underline">
              Gå til innlogging
            </Link>
          </div>
        )}

        {!sessionReady ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            Ingen aktiv reset-sesjon funnet. Åpne lenken du fikk på e-post på nytt.
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-contrast dark:text-gray-300">
                Nytt passord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-foreground placeholder:text-gray-400 focus:border-nytti-pink focus:outline-none focus:ring-1 focus:ring-nytti-pink dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500"
                placeholder="Minst 6 tegn"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-contrast dark:text-gray-300">
                Bekreft nytt passord
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-foreground placeholder:text-gray-400 focus:border-nytti-pink focus:outline-none focus:ring-1 focus:ring-nytti-pink dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500"
                placeholder="Gjenta passord"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-nytti-pink py-3 text-sm font-semibold text-white transition-colors hover:bg-nytti-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Oppdaterer...' : 'Oppdater passord'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/login" className="font-medium text-contrast hover:underline dark:text-[#6b6fb8]">
            Tilbake til innlogging
          </Link>
        </p>
      </div>
    </div>
  );
}
