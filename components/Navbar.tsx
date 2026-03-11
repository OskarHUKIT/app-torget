'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import ProfileMenu from './ProfileMenu';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const handler = () => setShowInstallModal(true);
    window.addEventListener('nytti-open-install', handler);
    return () => window.removeEventListener('nytti-open-install', handler);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <>
      {/* Desktop nav - #EF5B99 header */}
      <nav className="sticky top-0 z-40 hidden border-b border-[#EF5B99]/20 bg-[#EF5B99] md:block">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1">
            <Link href="/om" className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15">
              Om
            </Link>
            <Link href="/browse" className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15">
              Bibliotek
            </Link>
            <Link href="/dugnader" className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15">
              Dugnader
            </Link>
          </div>

          <Link href="/" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
            <Logo className="h-[60px] w-auto" />
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/upload" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#EF5B99] transition-colors hover:bg-white/90">
              Del
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInstallModal(true)}
              className="rounded-lg border border-white/50 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              Last ned
            </motion.button>
            <ProfileMenu user={user} variant="desktop" />
          </div>
        </div>
      </nav>

      {/* Install modal */}
      {showInstallModal && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm"
          onClick={() => setShowInstallModal(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface p-6 shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">Legg Nytti til telefonen</h3>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-2xl leading-none text-muted transition-colors hover:text-foreground"
                aria-label="Lukk"
              >
                ×
              </button>
            </div>
            {isIOS ? (
              <ol className="space-y-4 text-sm text-muted">
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nytti-pink/20 font-bold text-nytti-pink">1</span>
                  <span>Trykk <strong>Del</strong> (□↑) nederst i Safari</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nytti-pink/20 font-bold text-nytti-pink">2</span>
                  <span>Velg <strong>Legg til på startsiden</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nytti-pink/20 font-bold text-nytti-pink">3</span>
                  <span>Trykk <strong>Legg til</strong></span>
                </li>
              </ol>
            ) : (
              <p className="text-sm text-muted">
                Trykk på menyen (⋮) i nettleseren og finn <strong>Installer app</strong> eller <strong>Legg til på startsiden</strong>.
              </p>
            )}
            <button
              onClick={() => setShowInstallModal(false)}
              className="mt-6 w-full rounded-lg bg-nytti-pink py-3 font-semibold text-white hover:bg-nytti-pink-dark"
            >
              Har forstått
            </button>
          </div>
        </div>
      )}
    </>
  );
}
