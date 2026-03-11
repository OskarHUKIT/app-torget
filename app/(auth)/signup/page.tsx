'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passordene stemmer ikke');
      return;
    }

    if (password.length < 6) {
      setError('Passord må være minst 6 tegn');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        window.location.href = '/';
        return;
      }
      window.location.href = '/login?message=check-email';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'En feil oppstod';
      setError(
        message.includes('Failed to fetch') || message.includes('fetch failed')
          ? 'Kunne ikke kontakte Supabase. Sjekk at NEXT_PUBLIC_SUPABASE_URL er riktig i .env.local.'
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 dark:bg-[#0f0f12]">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-medium text-contrast dark:text-gray-200">
            Opprett konto på <span className="font-nytti text-2xl text-nytti-pink">Nytti</span>
          </h2>
          <p className="mt-2 text-sm text-muted">
            Eller{' '}
            <Link href="/login" className="font-medium text-contrast hover:underline dark:text-[#6b6fb8]">
              logg inn
            </Link>
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSignup}>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-foreground placeholder:text-gray-400 focus:border-nytti-pink focus:outline-none focus:ring-1 focus:ring-nytti-pink dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-contrast dark:text-gray-300">
              Bekreft passord
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-nytti-pink py-3 text-sm font-semibold text-white transition-colors hover:bg-nytti-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Oppretter...' : 'Opprett konto'}
          </button>
        </form>
      </div>
    </div>
  );
}
