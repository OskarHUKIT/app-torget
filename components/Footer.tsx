import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted">Laget av</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <a
              href="https://gamechanging.itch.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label="Gamechanging"
            >
              <Image src="/brand/gclogo.png" alt="Gamechanging" width={100} height={34} className="h-8 w-auto object-contain" unoptimized />
            </a>
            <a
              href="https://kit.no"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label="Kit"
            >
              <Image src="/brand/kit.png" alt="Kit" width={64} height={32} className="h-8 w-auto object-contain" unoptimized />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
