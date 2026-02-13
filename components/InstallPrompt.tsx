'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandaloneMode = (window as any).navigator?.standalone === true;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const dismissed = localStorage.getItem('nytti-install-dismissed');

    setIsIOS(isIOSDevice);
    setIsStandalone(isStandaloneMode);

    if (isMobile && !isStandaloneMode && !dismissed) {
      setShow(true);
    }
  }, []);

  const handleInstall = () => {
    if (isIOS) {
      setShowInstructions(true);
    } else {
      if ((window as any).deferredPrompt) {
        (window as any).deferredPrompt.prompt();
        (window as any).deferredPrompt.userChoice.then(() => {
          setShow(false);
        });
      } else {
        setShowInstructions(true);
      }
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setShowInstructions(false);
    localStorage.setItem('nytti-install-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
        <div className="bg-gradient-to-r from-nytti-pink to-nytti-pink-dark text-white rounded-xl shadow-lg p-4 border border-nytti-pink/30">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📱</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Få Nytti på iPhone</p>
              <p className="text-xs text-white/90 mt-0.5">
                Add to home screen for quick access
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-white text-nytti-pink font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white/90 transition-colors"
                >
                  Add to iPhone
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 text-white/80 hover:text-white text-sm"
                  aria-label="Dismiss"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInstructions && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center p-4"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-t-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Legg til Nytti på hjemskjerm
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {isIOS ? (
              <ol className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-nytti-pink/20 text-nytti-pink rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                  <span>Tap the <strong>Share</strong> button at the bottom of Safari (the square with arrow pointing up)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-nytti-pink/20 text-nytti-pink rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-nytti-pink/20 text-nytti-pink rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                  <span>Tap <strong>Add</strong> in the top right</span>
                </li>
              </ol>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Look for the install icon in your browser&apos;s address bar, or use the menu to find &quot;Install App&quot; / &quot;Add to Home Screen&quot;.
              </p>
            )}
            <button
              onClick={() => {
                setShowInstructions(false);
                handleDismiss();
              }}
              className="w-full mt-6 bg-nytti-pink hover:bg-nytti-pink-dark text-white font-semibold py-3 rounded-lg"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
