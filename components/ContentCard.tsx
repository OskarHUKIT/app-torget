'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Content } from '@/lib/types';

interface ContentCardProps {
  content: Content;
  index?: number;
  featured?: boolean;
}

export default function ContentCard({ content, index = 0, featured = false }: ContentCardProps) {
  const typeLabels: Record<string, string> = {
    app: 'App',
    game: 'Spill',
    poem: 'Dikt',
    artwork: 'Kunstverk',
    idea: 'Ide',
  };

  if (content.type === 'app' && content.app_id) {
    return (
      <Link href={`/app/${content.app_id}`}>
        <Card content={content} index={index} featured={featured} typeLabel={typeLabels[content.type] || content.type} />
      </Link>
    );
  }

  return (
    <Link href={`/content/${content.id}`}>
      <Card content={content} index={index} featured={featured} typeLabel={typeLabels[content.type] || content.type} />
    </Link>
  );
}

function Card({
  content,
  index,
  featured,
  typeLabel,
}: {
  content: Content;
  index: number;
  featured: boolean;
  typeLabel: string;
}) {
  const hasImage = !!content.image_url;
  const isArtwork = content.type === 'artwork';
  const isPoem = content.type === 'poem';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: featured ? -8 : -4,
        transition: { duration: 0.2 },
      }}
      className={`group relative overflow-hidden rounded-2xl bg-surface dark:bg-surface transition-all duration-300 hover:bg-surface-hover
        ${featured ? 'shadow-card-hover' : 'shadow-card hover:shadow-card-hover'}
        ${featured && hasImage ? 'aspect-[4/3]' : ''}
        ${!featured && isArtwork && hasImage ? 'aspect-square' : ''}
      `}
    >
      {/* Artwork: full-bleed image */}
      {isArtwork && hasImage && (
        <div className={`relative ${featured ? 'h-full min-h-[280px]' : 'aspect-square'}`}>
          <Image
            src={content.image_url!}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="text-xs font-medium uppercase tracking-wider text-white/80">{typeLabel}</span>
            {content.is_curator_pick && (
              <span className="ml-2 inline-flex items-center rounded-full bg-nytti-pink/90 px-2.5 py-0.5 text-xs font-medium text-white">
                Kurators utvalg
              </span>
            )}
            <h3 className="mt-1 font-display text-xl font-semibold text-white md:text-2xl">{content.title}</h3>
            {content.description && (
              <p className="mt-1 line-clamp-2 text-sm text-white/90">{content.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Poem: typographic focus */}
      {isPoem && (
        <div className={`p-6 ${featured ? 'py-10' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium uppercase tracking-widest text-muted">{typeLabel}</span>
            {content.is_curator_pick && (
              <span className="rounded-full bg-nytti-pink/15 px-2.5 py-0.5 text-xs font-medium text-nytti-pink">
                Kurators utvalg
              </span>
            )}
          </div>
          <h3 className={`font-display font-semibold text-foreground ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
            {content.title}
          </h3>
          {content.body_text && (
            <p className={`mt-4 font-body leading-relaxed text-muted line-clamp-4 ${featured ? 'text-lg' : 'text-sm'}`}>
              {content.body_text}
            </p>
          )}
          {content.description && !content.body_text && (
            <p className="mt-3 text-sm text-muted line-clamp-2">{content.description}</p>
          )}
        </div>
      )}

      {/* App / Game / Idea: standard card */}
      {!isArtwork && !isPoem && (
        <div className={`flex gap-5 p-6 ${featured ? 'flex-col sm:flex-row' : ''}`}>
          <div className={`relative flex-shrink-0 overflow-hidden rounded-xl bg-foreground/5 ${featured ? 'aspect-video sm:w-64 sm:aspect-auto' : 'w-20 h-20'}`}>
            {content.image_url ? (
              <Image
                src={content.image_url}
                alt={content.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">
                {content.type === 'app' ? '📱' : content.type === 'game' ? '🎮' : '💡'}
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium uppercase tracking-widest text-muted">{typeLabel}</span>
              {content.is_curator_pick && (
                <span className="rounded-full bg-nytti-pink/15 px-2.5 py-0.5 text-xs font-medium text-nytti-pink">
                  Kurators utvalg
                </span>
              )}
            </div>
            <h3 className={`font-display font-semibold text-foreground ${featured ? 'text-2xl' : 'text-lg'}`}>
              {content.title}
            </h3>
            <p className="mt-2 text-sm text-muted line-clamp-2">
              {content.description || content.body_text || 'Ingen beskrivelse'}
            </p>
            {content.category && (
              <span className="mt-3 inline-flex w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted">
                {content.category}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Hover indicator */}
      <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground shadow-lg dark:bg-foreground/10 dark:text-foreground">
          Åpne →
        </span>
      </div>
    </motion.div>
  );
}
