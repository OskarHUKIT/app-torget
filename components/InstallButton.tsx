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
      // Note: This is a simple approach - in production you'd want to track actual installs
      await supabase.rpc('increment_app_installs', { app_id: app.id }).catch(() => {
        // Fallback if RPC doesn't exist - update directly
        supabase
          .from('apps')
          .update({ install_count: app.install_count + 1 })
          .eq('id', app.id)
          .then(() => {});
      });

      // Give user instructions
      setTimeout(() => {
        if (appWindow) {
          alert('The app has opened in a new window. Look for the "Add to Home Screen" option in your browser menu to install it as a PWA.');
        }
      }, 500);
    } catch (error) {
      console.error('Error installing app:', error);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleInstall}
        disabled={installing}
        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {installing ? 'Opening...' : '📱 Install App'}
      </button>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Click to open the app. Then use your browser&apos;s &quot;Add to Home Screen&quot; option to install it.
      </p>
    </div>
  );
}
