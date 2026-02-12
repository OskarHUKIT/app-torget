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
        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {installing ? 'Opening...' : isExternalLink ? 'Open App' : '📱 Install App'}
      </button>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {isExternalLink
          ? 'Opens the app in a new tab. You can bookmark it or add a shortcut to your home screen.'
          : 'Click to open the app. Then use your browser\'s "Add to Home Screen" option to install it.'}
      </p>
    </div>
  );
}
