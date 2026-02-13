'use client';

import { App } from '@/lib/types';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface InstallButtonProps {
  app: App;
}

export default function InstallButton({ app }: InstallButtonProps) {
  const [installing, setInstalling] = useState(false);
  const supabase = createClient();

  const handleInstall = async () => {
    setInstalling(true);
    
    try {
      // Open app in new window
      const appWindow = window.open(app.install_url, '_blank');
      
      // Track install (increment count)
      try {
        await supabase
          .from('apps')
          .update({ install_count: app.install_count + 1 })
          .eq('id', app.id);
      } catch {
        // Ignore - install tracking is best-effort
      }

      // Give user instructions
      setTimeout(() => {
        if (appWindow && app.upload_type !== 'external_link') {
          alert('The app has opened in a new window. Look for the "Add to Home Screen" option in your browser menu to install it as a PWA.');
        }
      }, 500);
    } catch (error) {
      console.error('Error installing app:', error);
    } finally {
      setInstalling(false);
    }
  };

  const isExternalLink = app.upload_type === 'external_link';

  return (
    <div>
      <button
        onClick={handleInstall}
        disabled={installing}
        className="w-full rounded-xl bg-nytti-pink px-8 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-nytti-pink-dark disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
      >
        {installing ? 'Åpner...' : isExternalLink ? 'Åpne app' : '📱 Installer app'}
      </button>
      <p className="mt-3 text-sm text-muted">
        {isExternalLink
          ? 'Åpner appen i en ny fane. Du kan legge den til på startsiden.'
          : 'Klikk for å åpne appen. Bruk nettleserens «Legg til på startsiden» for å installere.'}
      </p>
    </div>
  );
}
