import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Laget av</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <a
              href="https://gamechanging.itch.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Gamechanging"
            >
              <Image
                src="/brand/gclogo.png"
                alt="Gamechanging"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </a>
            <a
              href="https://kit.no"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Kit"
            >
              <Image
                src="/brand/kit.png"
                alt="Kit"
                width={80}
                height={40}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
