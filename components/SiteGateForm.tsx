'use client';

import { useState } from 'react';

interface SiteGateFormProps {
  redirectTo: string;
}

export default function SiteGateForm({ redirectTo }: SiteGateFormProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/site-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, redirectTo }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || 'Kunne ikke verifisere passord');
      }

      const payload = await response.json();
      window.location.href = payload.redirectTo || '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div>
        <label htmlFor="site-password" className="block text-sm font-medium text-contrast">
          Passord
        </label>
        <input
          id="site-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:border-nytti-pink focus:outline-none focus:ring-1 focus:ring-nytti-pink"
          placeholder="Skriv passord"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-nytti-pink py-3 text-sm font-semibold text-white transition-colors hover:bg-nytti-pink-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sjekker...' : 'Åpne siden'}
      </button>
    </form>
  );
}

