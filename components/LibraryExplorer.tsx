'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import ContentCard from './ContentCard';
import { type FeedItem } from '@/lib/mockFeed';
import { LIBRARY_ORDER, MEDIA_LABELS } from '@/lib/content-utils';
import { pageFadeIn, staggerContainer } from '@/lib/motion';
import { type ContentType } from '@/lib/types';

type LibraryFilter = 'all' | ContentType;

interface LibraryExplorerProps {
  items: FeedItem[];
  initialType?: string;
  initialQuery?: string;
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function normalizeFilter(value?: string): LibraryFilter {
  if (!value) return 'all';
  if (value === 'all') return 'all';
  return (LIBRARY_ORDER.includes(value as ContentType) ? value : 'all') as LibraryFilter;
}

export default function LibraryExplorer({ items, initialType, initialQuery }: LibraryExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');
  const [activeType, setActiveType] = useState<LibraryFilter>(normalizeFilter(initialType));

  const filtered = useMemo(() => {
    const search = normalize(query);
    return items.filter((item) => {
      const matchType = activeType === 'all' ? true : item.type === activeType;
      if (!matchType) return false;
      if (!search) return true;

      const haystack = [
        item.title,
        item.description || '',
        item.body_text || '',
        item.category || '',
        item.region || '',
        ...(item.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [items, query, activeType]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeType !== 'all') params.set('type', activeType);
    if (query.trim()) params.set('q', query.trim());
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(next, { scroll: false });
  }, [activeType, pathname, query, router]);

  return (
    <motion.section
      variants={pageFadeIn}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-6xl px-4 py-6 md:py-10"
    >
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Bibliotek</h1>
          <p className="text-sm text-muted">Søk og filtrer innhold på tvers av alle mediatyper.</p>
        </div>
        <div className="w-full md:max-w-sm">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Søk etter dikt, kunst, artikler, event ..."
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-nytti-pink focus:ring-2 focus:ring-nytti-pink/20"
          />
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveType('all')}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            activeType === 'all'
              ? 'bg-nytti-pink text-white shadow-nytti'
              : 'border border-border bg-surface text-contrast hover:border-nytti-pink/40 hover:text-foreground'
          }`}
        >
          Alle
        </button>
        {LIBRARY_ORDER.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              activeType === type
                ? 'bg-nytti-pink text-white shadow-nytti'
                : 'border border-border bg-surface text-contrast hover:border-nytti-pink/40 hover:text-foreground'
            }`}
          >
            {MEDIA_LABELS[type]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeType}-${query}`}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-5"
        >
          <p className="text-sm text-contrast">{filtered.length} treff</p>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
              <p className="font-display text-xl font-bold text-foreground">Ingen treff</p>
              <p className="mt-2 text-sm text-muted">Prøv et annet søk eller en annen mediatype.</p>
            </div>
          ) : (
            filtered.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

