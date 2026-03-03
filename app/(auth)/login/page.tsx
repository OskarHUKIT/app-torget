'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();
  const checkEmailMessage = searchParams.get('message') === 'check-email';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const redirect = searchParams.get('redirect') || '/';
      window.location.href = redirect;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'En feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 dark:bg-[#0f0f12]">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-medium text-contrast dark:text-gray-200">
            Logg inn på <span className="font-nytti text-2xl text-nytti-pink">Nytti</span>
          </h2>
          <p className="mt-2 text-sm text-muted">
            Eller{' '}
            <Link href="/signup" className="font-medium text-contrast hover:underline dark:text-[#6b6fb8]">
              opprett konto
            </Link>
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          {checkEmailMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              Sjekk e-posten for å bekrefte kontoen, og logg inn nedenfor.
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-contrast dark:text-gray-300">
              E-post
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-foreground placeholder:text-gray-400 focus:border-nytti-pink focus:outline-none focus:ring-1 focus:ring-nytti-pink dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500"
              placeholder="deg@eksempel.no"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-contrast dark:text-gray-300">
              Passord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-foreground placeholder:text-gray-400 focus:border-nytti-pink focus:outline-none focus:ring-1 focus:ring-nytti-pink dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-nytti-pink py-3 text-sm font-semibold text-white transition-colors hover:bg-nytti-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Logger inn...' : 'Logg inn'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Laster...</div>}>
      <LoginForm />
    </Suspense>
  );
}
