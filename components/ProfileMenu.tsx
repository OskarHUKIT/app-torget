'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface ProfileMenuProps {
  user: { email?: string } | null;
  onClose?: () => void;
  variant?: 'desktop' | 'mobile';
}

export default function ProfileMenu({ user, onClose, variant = 'desktop' }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  const icon = (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        variant === 'mobile'
          ? 'bg-foreground/10 text-contrast hover:bg-foreground/15'
          : 'bg-white/20 text-white hover:bg-white/30'
      }`}
      aria-label="Profilmeny"
      aria-expanded={open}
    >
      <span className="text-lg">👤</span>
    </button>
  );

  const dropdown = open && (
    <div
      ref={menuRef}
      className={`absolute right-0 z-50 mt-2 min-w-[180px] rounded-xl border border-border bg-surface py-2 shadow-lg ${
        variant === 'mobile' ? 'bottom-full mb-2' : 'top-full'
      }`}
    >
      {user ? (
        <>
          <p className="truncate px-4 py-2 text-xs text-muted">{user.email}</p>
          <Link
            href="/profile"
            className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/5"
            onClick={() => setOpen(false)}
          >
            Profil
          </Link>
          <Link
            href="/curator"
            className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/5"
            onClick={() => setOpen(false)}
          >
            Kurator
          </Link>
          <button
            onClick={() => {
              handleSignOut();
              onClose?.();
            }}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            Logg ut
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="block px-4 py-2.5 text-sm font-medium text-contrast hover:bg-foreground/5"
            onClick={() => setOpen(false)}
          >
            Logg inn
          </Link>
          <Link
            href="/signup"
            className="block px-4 py-2.5 text-sm font-medium text-nytti-pink hover:bg-nytti-pink/10"
            onClick={() => setOpen(false)}
          >
            Registrer
          </Link>
        </>
      )}
    </div>
  );

  return (
    <div className="relative">
      {icon}
      {dropdown}
    </div>
  );
}
