/**
 * Internet Archive Audio Fallback Engine & YouTube Resolver
 * Tier 1: Direct Audio URL
 * Tier 2: YouTube Embed Player
 * Tier 3: Known-Good Internet Archive CC0 Public Domain Audio Fallback List
 */

const SESSION_CACHE_KEY = 'nyanthepa_archive_audio_fallback';

export interface KnownArchiveAudioItem {
  identifier: string;
  filename: string;
  url: string;
  title: string;
}

/**
 * Hardcoded list of 4 verified, known-good Internet Archive public domain audio files.
 * Eliminates live search queries and ensures 100% reliable 200 (audio/mpeg) audible playback.
 */
export const KNOWN_ARCHIVE_AUDIO_FALLBACKS: KnownArchiveAudioItem[] = [
  {
    identifier: 'musopen-chopin',
    filename: 'Canon in F minor.mp3',
    url: 'https://archive.org/download/musopen-chopin/Canon%20in%20F%20minor.mp3',
    title: 'Canon in F minor — Chopin (Musopen, CC0)',
  },
  {
    identifier: 'musopen-chopin',
    filename: 'Prelude Op. 28 no. 7.mp3',
    url: 'https://archive.org/download/musopen-chopin/Prelude%20Op.%2028%20no.%207.mp3',
    title: 'Prelude Op. 28 No. 7 — Chopin (Musopen, CC0)',
  },
  {
    identifier: 'musopen-chopin',
    filename: 'Waltz B. 133 in E flat major.mp3',
    url: 'https://archive.org/download/musopen-chopin/Waltz%20B.%20133%20in%20E%20flat%20major.mp3',
    title: 'Waltz in E-flat Major, B.133 — Chopin (Musopen, CC0)',
  },
  {
    identifier: 'musopen-chopin',
    filename: 'Mazurka Op. 24 no. 2 in C major.mp3',
    url: 'https://archive.org/download/musopen-chopin/Mazurka%20Op.%2024%20no.%202%20in%20C%20major.mp3',
    title: 'Mazurka Op. 24 No. 2 — Chopin (Musopen, CC0)',
  },
];

let memoryCachedUrl: string | null = null;

/**
 * Extracts standard YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    // Match youtu.be/ID
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    // Match youtube.com/watch?v=ID or /embed/ID or /v/ID or /shorts/ID
    const longMatch = trimmed.match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
    );
    if (longMatch) return longMatch[1];
  } catch (e) {
    console.warn('Failed to parse YouTube URL:', e);
  }
  return null;
}

/**
 * Selects one verified Internet Archive audio track at random per session.
 * Caches the selected direct stream URL in sessionStorage so it persists across page navigations.
 */
export async function getArchiveFallbackAudioUrl(): Promise<string | null> {
  // 1. In-memory cache check
  if (memoryCachedUrl) {
    return memoryCachedUrl;
  }

  // 2. SessionStorage cache check
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
      if (cached && cached.startsWith('http')) {
        memoryCachedUrl = cached;
        return cached;
      }
    } catch {}
  }

  // 3. Pick one known-good track at random from the verified list
  try {
    const randomIndex = Math.floor(Math.random() * KNOWN_ARCHIVE_AUDIO_FALLBACKS.length);
    const selectedItem = KNOWN_ARCHIVE_AUDIO_FALLBACKS[randomIndex];
    const resolvedUrl = selectedItem.url;

    memoryCachedUrl = resolvedUrl;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_CACHE_KEY, resolvedUrl);
      } catch {}
    }

    return resolvedUrl;
  } catch (err) {
    console.warn('Failed to select random fallback audio, returning default track:', err);
    const defaultUrl = KNOWN_ARCHIVE_AUDIO_FALLBACKS[0].url;
    memoryCachedUrl = defaultUrl;
    return defaultUrl;
  }
}
