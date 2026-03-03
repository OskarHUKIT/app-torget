'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UploadMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 text-muted shadow-sm transition-colors hover:bg-surface hover:text-contrast"
        aria-label="Last opp"
        aria-expanded={open}
      >
        <span className="text-xl">+</span>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute bottom-full right-0 z-50 mb-2 flex flex-col gap-1 rounded-xl border border-border bg-surface py-2 shadow-lg">
            <Link
              href="/submit"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-contrast hover:bg-foreground/5"
              onClick={() => setOpen(false)}
            >
              <span>✍️</span> Send inn
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-contrast hover:bg-foreground/5"
              onClick={() => setOpen(false)}
            >
              <span>📱</span> Last opp app
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
