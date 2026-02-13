'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    }
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/80 dark:bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center h-10 group">
              <Image
                src="/brand/Nytti profil-1.png"
                alt="Nytti"
                width={120}
                height={40}
                className="h-10 w-auto object-contain transition-opacity group-hover:opacity-90"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInstallModal(true)}
              className="flex items-center gap-2 rounded-xl bg-nytti-pink hover:bg-nytti-pink-dark text-white px-4 py-2.5 text-sm font-semibold shrink-0"
            >
              <span aria-hidden>📲</span>
              <span className="hidden sm:inline">Last ned app</span>
              <span className="sm:hidden">Last ned</span>
            </motion.button>
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Feed
            </Link>
            {user ? (
              <>
                <Link
                  href="/upload"
                  className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Last opp
                </Link>
                <Link
                  href="/submit"
                  className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Send inn
                </Link>
                <Link
                  href="/curator"
                  className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Kurator
                </Link>
                <Link
                  href="/profile"
                  className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Profil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logg ut
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logg inn
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-nytti-pink hover:bg-nytti-pink-dark text-white px-4 py-2.5 text-sm font-semibold"
                >
                  Registrer
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {showInstallModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm"
          onClick={() => setShowInstallModal(false)}
        >
          <div
            className="rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto bg-surface border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">
                Legg Nytti til telefonen
              </h3>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-muted hover:text-foreground text-2xl leading-none w-8 h-8 transition-colors"
                aria-label="Lukk"
              >
                ×
              </button>
            </div>
            {isIOS ? (
              <ol className="space-y-4 text-muted text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-nytti-pink/20 text-nytti-pink rounded-full flex items-center justify-center font-bold">1</span>
                  <span>Tap the <strong>Share</strong> button (□↑) at the bottom of Safari</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-nytti-pink/20 text-nytti-pink rounded-full flex items-center justify-center font-bold">2</span>
                  <span>Tap <strong>Add to Home Screen</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-nytti-pink/20 text-nytti-pink rounded-full flex items-center justify-center font-bold">3</span>
                  <span>Tap <strong>Add</strong> in the top right</span>
                </li>
              </ol>
            ) : (
              <p className="text-muted text-sm">
                Trykk på menyen (⋮) i nettleseren og Finn <strong>Installer app</strong> eller <strong>Legg til på startsiden</strong>.
              </p>
            )}
            <button
              onClick={() => setShowInstallModal(false)}
              className="mt-6 w-full rounded-xl bg-nytti-pink hover:bg-nytti-pink-dark py-3 font-semibold text-white"
            >
              Har forstått
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
