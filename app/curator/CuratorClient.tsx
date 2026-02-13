'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';

interface Content {
  id: string;
  type: string;
  title: string;
  description: string | null;
  body_text: string | null;
  image_url: string | null;
  url: string | null;
  category: string | null;
  tags: string[];
  author_id: string | null;
  created_at: string;
}

export default function CuratorClient({ pending }: { pending: Content[] }) {
  const [items, setItems] = useState(pending);
  const [loading, setLoading] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s?.access_token ?? null);
    });
  }, [supabase]);

  const curatorAction = async (
    id: string,
    action: 'approve' | 'reject',
    isCuratorPick?: boolean
  ) => {
    if (!session) return;
    setLoading(id);
    const res = await fetch('/api/curator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({
        action,
        contentId: id,
        isCuratorPick: action === 'approve' ? isCuratorPick : undefined,
      }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
    setLoading(null);
  };

  const handleApprove = async (id: string, isCuratorPick?: boolean) => {
    await curatorAction(id, 'approve', isCuratorPick);
  };

  const handleReject = async (id: string) => {
    await curatorAction(id, 'reject');
  };

  const typeLabels: Record<string, string> = {
    poem: 'Dikt',
    artwork: 'Kunstverk',
    idea: 'Ide',
  };

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Ingen ventende innhold</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Tilbake til feed
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-500 uppercase">
                {typeLabels[item.type] || item.type}
              </span>
              <h2 className="text-xl font-semibold mt-1">{item.title}</h2>
              {item.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {item.description}
                </p>
              )}
              {item.body_text && (
                <pre className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans max-h-40 overflow-y-auto">
                  {item.body_text}
                </pre>
              )}
              {item.image_url && (
                <div className="relative w-48 h-32 mt-4">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>
              )}
              {item.category && (
                <span className="inline-block mt-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {item.category}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleApprove(item.id, true)}
                disabled={loading === item.id}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              >
                Godkjenn + kurators utvalg
              </button>
              <button
                onClick={() => handleApprove(item.id, false)}
                disabled={loading === item.id}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              >
                Godkjenn
              </button>
              <button
                onClick={() => handleReject(item.id)}
                disabled={loading === item.id}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              >
                Avvis
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
