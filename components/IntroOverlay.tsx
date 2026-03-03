'use client';

import { motion } from 'framer-motion';
import Logo from './Logo';

const VALUE_PROPS = [
  {
    title: 'Nytti',
    text: 'Våre tjenester skal løse fornuftige behov og gi hverdagen noen gode opplevelser.',
  },
  {
    title: 'Datahåndtering',
    text: 'Data lagres på europeiske servere underlagt GDPR. Ingen overføring til tredjeland.',
  },
  {
    title: 'Norske verdier',
    text: 'Tillit, åpenhet og likeverd er vår grunnmur.',
  },
  {
    title: 'Samskapt',
    text: 'Utviklere, brukere og lokalsamfunn skaper tjenester sammen.',
  },
  {
    title: 'Bærekraftig',
    text: 'Vi involverer mennesker og lokalsamfunn i alt vi gjør.',
  },
] as const;

interface IntroOverlayProps {
  onSkip: () => void;
}

export default function IntroOverlay({ onSkip }: IntroOverlayProps) {
  const handleSkipClick = () => {
    onSkip();
  };

  const handleInstallClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nytti-open-install'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-x-0 bottom-0 top-0 z-[70] overflow-y-auto bg-background/98 backdrop-blur-sm md:top-[73px]"
    >
        {/* Header with Hopp over */}
        <header className="sticky top-0 z-20 flex justify-end border-b border-border/50 bg-background/90 px-4 py-3 backdrop-blur-sm">
          <button
            type="button"
            onClick={handleSkipClick}
            className="pointer-events-auto rounded-lg px-4 py-2 text-sm font-semibold text-muted transition-colors hover:bg-border/50 hover:text-foreground"
          >
            Hopp over
          </button>
        </header>

        {/* Scrollable content */}
        <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-3xl flex-col px-6 pb-24 pt-6 md:pt-10">
          {/* Hero: large logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex min-h-[24vh] flex-col items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Logo className="h-32 w-auto md:h-40" />
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10 text-center font-display text-xl font-semibold text-foreground md:text-2xl"
          >
            Last ned noe meningsfyllt.
          </motion.p>

          {/* Value propositions */}
          <div className="mx-auto max-w-xl space-y-5">
            {VALUE_PROPS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + i * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="rounded-xl border border-border bg-surface/50 px-4 py-3 shadow-sm"
              >
                <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Download CTA section */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-14 flex flex-col items-center"
          >
            <p className="mb-4 text-center text-sm text-muted">
              Legg Nytti på telefonen for rask tilgang
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstallClick}
              className="rounded-full bg-gradient-to-r from-nytti-pink to-nytti-pink-dark px-8 py-4 font-display text-lg font-semibold text-white shadow-glow"
            >
              Last ned Nytti
            </motion.button>
            <button
              type="button"
              onClick={handleSkipClick}
              className="mt-6 text-sm text-muted underline-offset-2 hover:underline"
            >
              Fortsett uten å laste ned
            </button>
          </motion.section>
      </div>
    </motion.div>
  );
}
