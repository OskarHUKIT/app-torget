'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center h-10">
              <Image
                src="/brand/Nytti profil-1.png"
                alt="Nytti"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowInstallModal(true)}
              className="bg-nytti-pink hover:bg-nytti-pink-dark text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shrink-0"
            >
              <span>📲</span>
              <span className="hidden sm:inline">Last ned app</span>
              <span className="sm:hidden">Last ned</span>
            </button>
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Feed
            </Link>
            {user ? (
              <>
                <Link
                  href="/upload"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Last opp app
                </Link>
                <Link
                  href="/submit"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Send inn
                </Link>
                <Link
                  href="/curator"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Kurator
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logg ut
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logg inn
                </Link>
                <Link
                  href="/signup"
                  className="bg-nytti-pink hover:bg-nytti-pink-dark text-white px-4 py-2 rounded-md text-sm font-medium"
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
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-0 sm:p-4"
          onClick={() => setShowInstallModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Add Nytti to Your Phone
              </h3>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {isIOS ? (
              <ol className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
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
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Tap the menu (⋮) in your browser and look for <strong>Install app</strong> or <strong>Add to Home screen</strong>.
              </p>
            )}
            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full mt-6 bg-nytti-pink hover:bg-nytti-pink-dark text-white font-semibold py-3 rounded-lg"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
