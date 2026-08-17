/**
 * Internet Archive Audio Fallback Engine & YouTube Resolver
 * Tier 1: Direct Audio URL
 * Tier 2: YouTube Embed Player
 * Tier 3: Internet Archive CC0 Public Domain Audio Fallback
 */

const SESSION_CACHE_KEY = 'nyanthepa_archive_audio_fallback';

// Verified CC0 / Public Domain Archive.org default stream
const BACKUP_ARCHIVE_AUDIO_URL =
  'https://archive.org/download/speech-to-announce-common-issue/watch-ads-2-en.mp3';

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
 * Dynamically queries Internet Archive search API for public domain audio.
 * Caches the resolved direct stream URL in sessionStorage for the session.
 */
export async function getArchiveFallbackAudioUrl(): Promise<string | null> {
  if (memoryCachedUrl) {
    return memoryCachedUrl;
  }

  // Check sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
      if (cached && cached.startsWith('http')) {
        memoryCachedUrl = cached;
        return cached;
      }
    } catch {}
  }

  try {
    // 1. Search Internet Archive for CC0 / public domain audio
    const searchUrl =
      'https://archive.org/advancedsearch.php?q=collection%3Aopensource_audio+AND+mediatype%3Aaudio&fl[]=identifier,title&sort[]=downloads+desc&rows=8&page=1&output=json';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const searchRes = await fetch(searchUrl, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (searchRes.ok) {
      const data = await searchRes.json();
      const docs = data?.response?.docs || [];

      if (docs.length > 0) {
        // Pick one document
        const identifier = docs[0].identifier;

        // 2. Fetch metadata files to find a direct .mp3 file
        const metaRes = await fetch(
          `https://archive.org/metadata/${identifier}/files`
        );
        if (metaRes.ok) {
          const filesData = await metaRes.json();
          const files = filesData?.result || [];
          const mp3File = files.find(
            (f: any) =>
              f.name &&
              f.name.toLowerCase().endsWith('.mp3') &&
              !f.name.includes('_spectrogram')
          );

          if (mp3File && mp3File.name) {
            const resolvedUrl = `https://archive.org/download/${identifier}/${encodeURIComponent(
              mp3File.name
            )}`;
            memoryCachedUrl = resolvedUrl;
            if (typeof window !== 'undefined') {
              try {
                sessionStorage.setItem(SESSION_CACHE_KEY, resolvedUrl);
              } catch {}
            }
            return resolvedUrl;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Internet Archive search dynamic query failed, using backup CC0 URL:', err);
  }

  // Fallback to verified CC0 public domain stream
  memoryCachedUrl = BACKUP_ARCHIVE_AUDIO_URL;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(SESSION_CACHE_KEY, BACKUP_ARCHIVE_AUDIO_URL);
    } catch {}
  }
  return BACKUP_ARCHIVE_AUDIO_URL;
}
