'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroOverlay from './IntroOverlay';

const STORAGE_KEY = 'nytti-intro-seen';

interface IntroShellProps {
  children: React.ReactNode;
  forceIntro?: boolean;
}

export default function IntroShell({ children, forceIntro = false }: IntroShellProps) {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (forceIntro) {
      setShowIntro(true);
      return;
    }
    const seen = localStorage.getItem(STORAGE_KEY);
    setShowIntro(!seen);
  }, [forceIntro]);

  const handleSkip = () => {
    if (typeof window !== 'undefined' && !forceIntro) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setShowIntro(false);
  };

  // Default to showing intro until we've checked localStorage (avoids flash of feed for first-time visitors)
  const shouldShowIntro = showIntro === null ? true : showIntro;

  return (
    <>
      {children}
      <AnimatePresence mode="wait">
        {shouldShowIntro && <IntroOverlay onSkip={handleSkip} key="intro" />}
      </AnimatePresence>
    </>
  );
}
