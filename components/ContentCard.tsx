'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FeedItem } from '@/lib/mockFeed';
import { MEDIA_ICONS, MEDIA_LABELS, formatMediumDate } from '@/lib/content-utils';
import { cardReveal } from '@/lib/motion';

interface ContentCardProps {
  content: FeedItem;
  index?: number;
}

function formatTimeAgo(iso: string): string {
  const sec = (Date.now() - new Date(iso).getTime()) / 1000;
  if (sec < 60) return 'nå';
  if (sec < 3600) return `${Math.floor(sec / 60)} m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} t`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} d`;
  return `${Math.floor(sec / 604800)} u`;
}

function Avatar({ name }: { name: string }) {
  const initial = (name || 'N').charAt(0).toUpperCase();
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nytti-pink to-nytti-pink-dark text-sm font-bold text-white shadow-sm">
      {initial}
    </div>
  );
}

export default function ContentCard({ content, index = 0 }: ContentCardProps) {
  const typeLabel = MEDIA_LABELS[content.type] || content.type;
  const typeIcon = MEDIA_ICONS[content.type] || '📄';
  const author = content.author_name || 'Nytti';
  const likes = content.likes_count ?? 0;
  const comments = content.comments_count ?? 0;
  const timeAgo = formatTimeAgo(content.created_at);

  const href = content.type === 'app' && content.app_id
    ? `/app/${content.app_id}`
    : `/content/${content.id}`;

  return (
    <Link href={href}>
      <motion.article
        variants={cardReveal}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.35), ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.99 }}
        className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-300 hover:border-nytti-pink/30 hover:bg-surface-hover hover:shadow-card-hover"
      >
        {/* Post header - social style */}
        <div className="flex items-center gap-3 p-4 pb-0">
          <Avatar name={author} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-foreground truncate">{author}</span>
              {content.is_curator_pick && (
                <span className="shrink-0 rounded-full bg-nytti-pink/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-nytti-pink">
                  Kurators utvalg
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-contrast">
              <span>{typeIcon} {typeLabel}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Content area - varies by type */}
        <div className="p-4 pt-3">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-nytti-pink transition-colors">
            {content.title}
          </h3>

          {/* Artwork: compact image (max 192px height) */}
          {content.type === 'artwork' && content.image_url && (
            <div className="relative mt-3 h-48 w-full overflow-hidden rounded-xl sm:max-w-xs">
              <Image
                src={content.image_url}
                alt={content.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 320px, 384px"
                unoptimized={content.image_url?.includes('placeholder')}
              />
              {content.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="line-clamp-2 text-sm text-white">{content.description}</p>
                </div>
              )}
            </div>
          )}
          {content.type === 'artwork' && !content.image_url && content.description && (
            <p className="mt-3 line-clamp-3 text-sm text-muted">{content.description}</p>
          )}

          {/* Poem: typography block */}
          {content.type === 'poem' && (
            <div className="mt-3 rounded-xl border-l-4 border-nytti-pink/50 bg-nytti-pink/5 px-4 py-3">
              <p className="font-body text-muted line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed">
                {content.body_text || content.description}
              </p>
            </div>
          )}

          {/* App / Game: icon + description + play button */}
          {(content.type === 'app' || content.type === 'game') && (
            <div className="mt-3 flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-nytti-pink/20 to-nytti-pink/10 text-3xl">
                {typeIcon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm text-muted">
                  {content.description || 'Ingen beskrivelse'}
                </p>
                {content.category && (
                  <span className="mt-2 inline-block rounded-full bg-nytti-pink/15 px-2.5 py-0.5 text-xs font-medium text-nytti-pink">
                    {content.category}
                  </span>
                )}
                {content.url && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(content.url as string, '_blank', 'noopener,noreferrer');
                    }}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nytti-pink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-nytti-pink-dark"
                  >
                    {content.type === 'game' ? '▶ Spill' : 'Åpne app'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Idea: text card */}
          {content.type === 'idea' && (
            <p className="mt-3 line-clamp-3 text-sm text-muted">
              {content.description || content.body_text}
            </p>
          )}

          {/* Article: editorial teaser */}
          {content.type === 'article' && (
            <div className="mt-3 rounded-xl border border-border bg-background/60 p-4">
              <p className="line-clamp-3 text-sm text-muted">{content.description || content.body_text}</p>
              <span className="mt-3 inline-flex items-center rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-contrast">
                Les artikkel
              </span>
            </div>
          )}

          {/* Dugnad/Event: location and time preview */}
          {(content.type === 'dugnad' || content.type === 'event') && (
            <div className="mt-3 rounded-xl border border-nytti-pink/20 bg-nytti-pink/5 p-4">
              <p className="line-clamp-2 text-sm text-muted">
                {content.description || content.body_text || 'Ingen beskrivelse tilgjengelig ennå.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-contrast">
                {content.location_name && (
                  <span className="rounded-full bg-white/70 px-2.5 py-1 dark:bg-black/20">📍 {content.location_name}</span>
                )}
                {formatMediumDate(content.starts_at) && (
                  <span className="rounded-full bg-white/70 px-2.5 py-1 dark:bg-black/20">🕒 {formatMediumDate(content.starts_at)}</span>
                )}
                {content.capacity ? (
                  <span className="rounded-full bg-white/70 px-2.5 py-1 dark:bg-black/20">👥 {content.capacity}</span>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Engagement bar */}
        <div className="flex items-center gap-6 border-t border-border px-4 py-3">
          <button className="flex items-center gap-1.5 text-contrast transition-colors hover:text-nytti-pink" onClick={(e) => e.preventDefault()}>
            <span className="text-lg">❤️</span>
            <span className="text-sm font-medium">{likes > 0 ? likes : 'Lik'}</span>
          </button>
          <button className="flex items-center gap-1.5 text-contrast transition-colors hover:text-nytti-pink" onClick={(e) => e.preventDefault()}>
            <span className="text-lg">💬</span>
            <span className="text-sm font-medium">{comments > 0 ? comments : 'Kommenter'}</span>
          </button>
          <button className="flex items-center gap-1.5 text-contrast transition-colors hover:text-nytti-pink ml-auto" onClick={(e) => e.preventDefault()}>
            <span className="text-lg">↗️</span>
            <span className="text-sm font-medium">Del</span>
          </button>
        </div>
      </motion.article>
    </Link>
  );
}
