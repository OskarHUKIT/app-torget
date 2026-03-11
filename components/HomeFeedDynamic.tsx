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

const showcaseItems = [
  {
    id: 'tegnspill',
    title: 'Tegnspill',
    badge: '1. Vises nå',
    description:
      'Interaktivt tegnespill for kreativitet, fokus og mestring. Bygget for å fungere godt i live-demo.',
    cta: 'Åpne i bibliotek',
    href: '/browse?q=tegnspill',
    accent: 'from-fuchsia-500/20 via-rose-500/10 to-transparent',
  },
  {
    id: 'boly',
    title: 'Boly',
    badge: '2. Kommer snart',
    description:
      'Reservert lanseringsplass for Boly. Viser tydelig hva som ligger i neste steg av produktløpet.',
    cta: 'Se app-plass',
    href: '/browse?q=boly',
    accent: 'from-indigo-500/20 via-sky-500/10 to-transparent',
  },
  {
    id: 'clothes',
    title: 'Sirkulær mote',
    badge: '3. Investorfokus',
    description:
      'Et premium varemerke for bærekraftig bruk av klær: smartere gjenbruk, lengre levetid og lavere klimaavtrykk. Miks dine kolleksjoner, finn enkelplagg og kjøp med trygghet.',
    cta: 'Utforsk konsept',
    href: '/clothes',
    accent: 'from-emerald-500/25 via-teal-500/15 to-cyan-500/10',
  },
] as const;

export default function HomeFeedDynamic({ items }: HomeFeedDynamicProps) {
  const byType = LIBRARY_ORDER.reduce<Record<string, FeedItem[]>>((acc, type) => {
    acc[type] = items.filter((item) => item.type === type).slice(0, 4);
    return acc;
  }, {});

  const curated = items.filter((item) => item.is_curator_pick).slice(0, 5);
  const bolyItem = items.find(
    (item) =>
      (item.type === 'app' || item.type === 'game') &&
      item.title.toLowerCase().includes('boly')
  );
  const bolyHref = bolyItem
    ? bolyItem.type === 'app' && bolyItem.app_id
      ? `/app/${bolyItem.app_id}`
      : `/content/${bolyItem.id}`
    : '/upload';
  const topShowcase = [
    showcaseItems[0],
    {
      id: 'boly-live',
      title: bolyItem?.title || 'Boly',
      badge: bolyItem ? '2. Live nå' : '2. Kommer snart',
      description:
        bolyItem?.description ||
        'Reservert lanseringsplass for Boly. Når appen er godkjent i Nytti, vises den automatisk her.',
      cta: bolyItem ? 'Åpne Boly' : 'Legg til Boly',
      href: bolyHref,
      accent: 'from-indigo-500/20 via-sky-500/10 to-transparent',
    },
  ] as const;

  return (
    <motion.div variants={pageFadeIn} initial="initial" animate="animate" className="relative mx-auto max-w-6xl px-4 py-6 md:py-10">
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Showcase</h2>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-contrast">
            Investor-klar
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {topShowcase.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className={`rounded-2xl border border-border bg-gradient-to-br ${item.accent} p-5 shadow-card`}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-contrast">{item.badge}</p>
              <h3 className="font-display text-2xl font-extrabold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground hover:border-nytti-pink/50"
              >
                {item.cta}
              </Link>
            </motion.div>
          ))}
          <motion.div
            whileHover={{ y: -2 }}
            className={`rounded-2xl border border-emerald-400/30 bg-gradient-to-br ${showcaseItems[2].accent} p-6 shadow-nytti md:col-span-2`}
          >
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                  {showcaseItems[2].badge}
                </p>
                <h3 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                  {showcaseItems[2].title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm text-muted md:text-base">{showcaseItems[2].description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 md:max-w-md">
                  <div className="rounded-xl border border-emerald-300/40 bg-background/80 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted">Månedlige aktive brukere</p>
                    <p className="mt-1 text-lg font-bold text-foreground">3.2K</p>
                  </div>
                  <div className="rounded-xl border border-emerald-300/40 bg-background/80 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted">Plagg i omløp</p>
                    <p className="mt-1 text-lg font-bold text-foreground">9,480</p>
                  </div>
                  <div className="rounded-xl border border-emerald-300/40 bg-background/80 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted">Reparasjonsbookinger</p>
                    <p className="mt-1 text-lg font-bold text-foreground">+28%</p>
                  </div>
                  <div className="rounded-xl border border-emerald-300/40 bg-background/80 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted">CO2-reduksjon</p>
                    <p className="mt-1 text-lg font-bold text-foreground">-14.6t</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    AI-garderobeinnsikt
                  </span>
                  <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Lokalt reparasjonskart
                  </span>
                  <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Sirkulær markedsplass
                  </span>
                </div>

                <Link
                  href={showcaseItems[2].href}
                  className="mt-5 inline-flex rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-background hover:opacity-90"
                >
                  {showcaseItems[2].cta}
                </Link>
              </div>

              <div className="rounded-2xl border border-emerald-300/30 bg-background/75 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
                    App-forhåndsvisning
                  </p>
                  <span className="rounded-full border border-emerald-300/40 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    v1-konsept
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl border border-border bg-white/80 p-3 dark:bg-gray-900/50">
                    <p className="text-sm font-semibold text-foreground">Min garderobehelse</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <div className="h-2 w-[72%] rounded-full bg-emerald-500" />
                    </div>
                    <p className="mt-2 text-xs text-muted">72% sirkulærscore denne måneden</p>
                  </div>

                  <div className="rounded-xl border border-border bg-white/80 p-3 dark:bg-gray-900/50">
                    <p className="text-sm font-semibold text-foreground">Foreslått neste tiltak</p>
                    <p className="mt-1 text-xs text-muted">Reparer denimjakken og forleng levetiden med ca. 18 måneder.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border bg-white/80 p-3 text-center dark:bg-gray-900/50">
                      <p className="text-xs text-muted">Bytte-treff</p>
                      <p className="mt-1 text-base font-bold text-foreground">12</p>
                    </div>
                    <div className="rounded-xl border border-border bg-white/80 p-3 text-center dark:bg-gray-900/50">
                      <p className="text-xs text-muted">Sparte kroner</p>
                      <p className="mt-1 text-base font-bold text-foreground">4,350</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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

