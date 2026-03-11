'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { type FeedItem } from '@/lib/mockFeed';
import { haversineDistanceKm, isValidCoordinate } from '@/lib/geo';
import { formatMediumDate } from '@/lib/content-utils';
import { pageFadeIn } from '@/lib/motion';

const DugnaderMap = dynamic(() => import('./DugnaderMap'), { ssr: false });

interface DugnaderExplorerProps {
  items: FeedItem[];
}

function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation støttes ikke i denne nettleseren.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => reject(new Error('Kunne ikke hente posisjon.')),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export default function DugnaderExplorer({ items }: DugnaderExplorerProps) {
  const [query, setQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(30);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyItems, setNearbyItems] = useState<Array<FeedItem & { distanceKm?: number }> | null>(null);
  const [isNearbyLoading, setIsNearbyLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const withDistance = items
      .map((item) => {
        if (!userLocation || !isValidCoordinate(item.latitude, item.longitude)) return { ...item, distanceKm: undefined };
        const distanceKm = haversineDistanceKm(userLocation, {
          latitude: item.latitude as number,
          longitude: item.longitude as number,
        });
        return { ...item, distanceKm };
      })
      .filter((item) => {
        const matchQuery =
          !q ||
          [item.title, item.description || '', item.location_name || '', item.address || '', ...(item.tags || [])]
            .join(' ')
            .toLowerCase()
            .includes(q);
        if (!matchQuery) return false;
        if (!userLocation || item.distanceKm == null) return true;
        return item.distanceKm <= radiusKm;
      })
      .sort((a, b) => {
        const ad = a.distanceKm ?? Number.MAX_SAFE_INTEGER;
        const bd = b.distanceKm ?? Number.MAX_SAFE_INTEGER;
        if (ad !== bd) return ad - bd;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });

    return withDistance;
  }, [items, query, radiusKm, userLocation]);

  useEffect(() => {
    if (!userLocation) {
      setNearbyItems(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsNearbyLoading(true);
        const params = new URLSearchParams({
          lat: String(userLocation.latitude),
          lng: String(userLocation.longitude),
          radiusKm: String(radiusKm),
          limit: '60',
        });
        if (query.trim()) params.set('q', query.trim());

        const response = await fetch(`/api/dugnader/nearby?${params.toString()}`, {
          method: 'GET',
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Kunne ikke hente nearby-resultater');
        }
        const data = await response.json();
        setNearbyItems((data.items || []) as Array<FeedItem & { distanceKm?: number }>);
      } catch {
        // Silent fallback: local filtering remains active.
        setNearbyItems(null);
      } finally {
        setIsNearbyLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, radiusKm, userLocation]);

  const visibleItems = nearbyItems ?? filtered;

  const handleFindNearby = async () => {
    try {
      setLocationError(null);
      const coords = await getCurrentPosition();
      setUserLocation(coords);
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : 'Ukjent feil ved henting av posisjon.');
    }
  };

  return (
    <motion.main variants={pageFadeIn} initial="initial" animate="animate" className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <div className="mb-6 grid gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Dugnader</h1>
          <p className="text-sm text-muted">Finn meningsfulle dugnader i nærheten av der du bor. Søk i alle oppføringer og orienterer deg på kartet.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFindNearby}
            className="rounded-lg bg-nytti-pink px-4 py-2 text-sm font-semibold text-white transition hover:bg-nytti-pink-dark"
          >
            Finn i nærheten
          </button>
          <Link href="/browse" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-contrast transition hover:border-nytti-pink/50">
            Til bibliotek
          </Link>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[2fr_1fr]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søk etter dugnad, sted eller kategori ..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-nytti-pink focus:ring-2 focus:ring-nytti-pink/20"
        />
        <div className="rounded-xl border border-border bg-background px-4 py-3">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">Radius ({radiusKm} km)</label>
          <input
            type="range"
            min={5}
            max={100}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full accent-pink-500"
            disabled={!userLocation}
          />
        </div>
      </div>

      {locationError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {locationError}
        </div>
      )}
      {isNearbyLoading && (
        <div className="mb-4 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted">
          Henter oppdaterte resultater i nærheten ...
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <DugnaderMap
          items={visibleItems}
          center={userLocation}
          onSelect={(id) => {
            const target = document.getElementById(`dugnad-${id}`);
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />

        <section className="space-y-3">
          <p className="text-sm text-contrast">
            {visibleItems.length} treff
            {userLocation ? (
              <span className="ml-2 text-xs text-muted">
                {nearbyItems ? 'via Supabase nearby' : 'lokal fallback'}
              </span>
            ) : null}
          </p>
          <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
            {visibleItems.map((item) => (
              <motion.div
                id={`dugnad-${item.id}`}
                key={item.id}
                whileHover={{ y: -3 }}
                className="rounded-xl border border-border bg-surface p-4 shadow-card"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                  {item.distanceKm != null && (
                    <span className="rounded-full bg-nytti-pink/10 px-2 py-1 text-xs font-semibold text-nytti-pink">
                      {item.distanceKm.toFixed(1)} km
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 text-sm text-muted">{item.description || item.body_text || 'Ingen beskrivelse ennå.'}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-contrast">
                  {item.location_name && <span>📍 {item.location_name}</span>}
                  {formatMediumDate(item.starts_at) && <span>🕒 {formatMediumDate(item.starts_at)}</span>}
                </div>
                <Link href={`/content/${item.id}`} className="mt-3 inline-flex rounded-lg bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-foreground/10">
                  Se detaljer
                </Link>
              </motion.div>
            ))}
            {visibleItems.length === 0 && (
              <div className="rounded-xl border border-border bg-surface p-6 text-center">
                <p className="font-display text-lg font-bold text-foreground">Ingen treff</p>
                <p className="mt-2 text-sm text-muted">Prøv et annet søk eller større radius.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.main>
  );
}

