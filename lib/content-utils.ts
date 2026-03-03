import { type ContentType } from './types';

export const MEDIA_LABELS: Record<ContentType, string> = {
  app: 'Apper',
  game: 'Spill',
  poem: 'Dikt',
  artwork: 'Kunst',
  idea: 'Forslag',
  article: 'Artikler',
  dugnad: 'Dugnader',
  event: 'Event',
};

export const MEDIA_ICONS: Record<ContentType, string> = {
  app: '📱',
  game: '🎮',
  poem: '✍️',
  artwork: '🎨',
  idea: '💡',
  article: '📰',
  dugnad: '🤝',
  event: '📅',
};

export const LIBRARY_ORDER: ContentType[] = [
  'app',
  'game',
  'poem',
  'artwork',
  'article',
  'idea',
  'dugnad',
  'event',
];

export function formatMediumDate(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('nb-NO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

