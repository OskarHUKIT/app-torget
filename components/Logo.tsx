'use client';

/** Your logo at public/brand/Nytti profil-1.png — fallback to logo.svg if missing */
export default function Logo({ className = 'h-[60px] w-auto' }: { className?: string }) {
  return (
    <img
      src="/brand/Nytti%20profil-1.png"
      alt="Nytti"
      className={`object-contain ${className}`}
      width={100}
      height={60}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/brand/logo.svg';
      }}
    />
  );
}
