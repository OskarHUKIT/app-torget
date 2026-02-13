'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SubmitContentPage() {
  const [contentType, setContentType] = useState<'poem' | 'artwork' | 'idea'>('poem');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);
      if (!user) {
        window.location.href = '/login?redirect=/submit';
      }
    };
    checkUser();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) throw new Error('Du må være logget inn');
      if (!title.trim()) throw new Error('Tittel er påkrevd');

      const { data, error: dbError } = await supabase
        .from('content')
        .insert({
          type: contentType,
          title: title.trim(),
          description: description.trim() || null,
          body_text: bodyText.trim() || null,
          image_url: imageUrl.trim() || null,
          url: url.trim() || null,
          category: category.trim() || null,
          tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          author_id: user.id,
          status: 'pending',
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);
      if (!data) throw new Error('Kunne ikke opprette innhold');

      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Sjekker innlogging...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Send inn innhold</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex gap-2 mb-6">
            {(['poem', 'artwork', 'idea'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setContentType(t)}
                className={`flex-1 py-2 px-4 rounded ${
                  contentType === t
                    ? 'bg-nytti-pink text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t === 'poem' ? 'Dikt' : t === 'artwork' ? 'Kunstverk' : 'Ide'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tittel *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="Tittel på innholdet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Beskrivelse</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="Kort beskrivelse"
              />
            </div>
            {(contentType === 'poem' || contentType === 'idea') && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {contentType === 'poem' ? 'Dikttekst' : 'Ide / tekst'}
                </label>
                <textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  placeholder={contentType === 'poem' ? 'Skriv diktet her...' : 'Beskriv ideen...'}
                />
              </div>
            )}
            {contentType === 'artwork' && (
              <div>
                <label className="block text-sm font-medium mb-2">Bildelenke</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  placeholder="https://eksempel.no/bilde.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lim inn URL til et bilde på internett
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Ekstern lenke (valgfritt)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="F.eks. Natur, Samfunn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stikkord (kommaseparert)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="dikt, natur, norsk"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-nytti-pink hover:bg-nytti-pink-dark text-white py-3 rounded-md font-medium disabled:opacity-50"
            >
              {loading ? 'Sender inn...' : 'Send inn'}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            Innholdet blir vurdert av kurator før det vises i feeden.
          </p>
        </div>
        <Link href="/" className="block mt-6 text-blue-600 hover:underline">← Tilbake</Link>
      </div>
    </div>
  );
}
