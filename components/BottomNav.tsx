'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileMenu from './ProfileMenu';
import UploadMenu from './UploadMenu';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, [supabase]);

  const isFeed = pathname === '/';
  const isBrowse = pathname.startsWith('/browse');
  const isDugnader = pathname.startsWith('/dugnader');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around gap-2 px-4 py-3 safe-area-pb">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-2 transition-colors ${
            isFeed ? 'text-nytti-pink font-semibold' : 'text-contrast'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Feed</span>
        </Link>
        <Link
          href="/browse"
          className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-2 transition-colors ${
            isBrowse ? 'text-nytti-pink font-semibold' : 'text-contrast'
          }`}
        >
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-medium">Bibliotek</span>
        </Link>
        <Link
          href="/dugnader"
          className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 transition-colors ${
            isDugnader ? 'text-nytti-pink font-semibold' : 'text-contrast'
          }`}
        >
          <span className="text-xl">📍</span>
          <span className="text-[10px] font-medium">Dugnader</span>
        </Link>
        <div className="-mt-4 flex flex-col items-center gap-0.5">
          <UploadMenu />
          <span className="text-[10px] font-medium text-contrast">Del</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="scale-110">
            <ProfileMenu user={user} variant="mobile" />
          </div>
          <span className="text-[10px] font-medium text-contrast">Profil</span>
        </div>
      </div>
    </nav>
  );
}
