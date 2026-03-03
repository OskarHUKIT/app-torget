'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type FeedItem } from '@/lib/mockFeed';
import ContentCard from './ContentCard';
import { LIBRARY_ORDER, MEDIA_LABELS } from '@/lib/content-utils';
import { pageFadeIn, staggerContainer } from '@/lib/motion';

interface HomeFeedDynamicProps {
  items: FeedItem[];
}

export default function HomeFeedDynamic({ items }: HomeFeedDynamicProps) {
  const byType = LIBRARY_ORDER.reduce<Record<string, FeedItem[]>>((acc, type) => {
    acc[type] = items.filter((item) => item.type === type).slice(0, 4);
    return acc;
  }, {});

  const curated = items.filter((item) => item.is_curator_pick).slice(0, 5);

  return (
    <motion.div variants={pageFadeIn} initial="initial" animate="animate" className="relative mx-auto max-w-6xl px-4 py-6 md:py-10">
      <section className="mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-nytti-pink/10 p-6 shadow-card md:p-8">
        <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-nytti-pink">Dynamisk Nytti</p>
            <h1 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
              Oppdag meningsfullt innhold
              <span className="block text-contrast">fra kultur, samfunn og lokalmiljø.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              Feeden tilpasser seg mediaformater som artikler, dikt, kunst, apper og lokale aktiviteter. Utforsk biblioteket
              eller finn dugnader i nærheten.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/browse" className="rounded-full bg-nytti-pink px-5 py-2.5 text-sm font-semibold text-white hover:bg-nytti-pink-dark">
                Gå til bibliotek
              </Link>
              <Link href="/dugnader" className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-nytti-pink/40">
                Se dugnader
              </Link>
            </div>
          </div>
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-3">
            {LIBRARY_ORDER.slice(0, 6).map((type, i) => (
              <motion.div
                key={type}
                variants={staggerContainer}
                className="rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm font-medium text-contrast"
                style={{ transitionDelay: `${i * 45}ms` }}
              >
                {MEDIA_LABELS[type]}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Kuratorens utvalg</h2>
          <Link href="/browse" className="text-sm font-medium text-nytti-pink hover:underline">Se alt</Link>
        </div>
        <div className="space-y-5">
          {curated.length > 0
            ? curated.map((item, i) => <ContentCard key={item.id} content={item} index={i} />)
            : items.slice(0, 4).map((item, i) => <ContentCard key={item.id} content={item} index={i} />)}
        </div>
      </section>

      {LIBRARY_ORDER.map((type) => {
        const list = byType[type];
        if (!list || list.length === 0) return null;
        return (
          <section key={type} className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">{MEDIA_LABELS[type]}</h3>
              <Link href={`/browse?type=${type}`} className="text-xs font-semibold uppercase tracking-wide text-contrast hover:text-nytti-pink">
                Utforsk
              </Link>
            </div>
            <div className="space-y-5">
              {list.map((item, i) => (
                <ContentCard key={item.id} content={item} index={i} />
              ))}
            </div>
          </section>
        );
      })}
    </motion.div>
  );
}

