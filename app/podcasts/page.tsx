'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getPodcasts } from '@/lib/api-client';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import {
  extractYouTubeVideoId,
  getArchiveFallbackAudioUrl,
} from '@/lib/audio-fallback';
import {
  Headphones, Play, Pause, Download, ExternalLink, ShieldCheck,
  Search, ShieldAlert, Radio, Clock, User, AlertCircle, Video,
  Volume2, VolumeX, Sparkles, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

type PlaybackTier = 'direct_audio' | 'youtube_embed' | 'archive_fallback' | 'failed';

interface PodcastState {
  tier: PlaybackTier;
  fallbackAudioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Active episode ID being played
  const [activeEpisodeId, setActiveEpisodeId] = useState<number | null>(null);
  const [episodeStates, setEpisodeStates] = useState<Record<number, PodcastState>>({});

  const { setCurrentTrack, pauseStream } = useAccessibility();
  const audioElementsRef = useRef<Record<number, HTMLAudioElement | null>>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getPodcasts();
        setPodcasts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = [
    'all',
    ...Array.from(new Set(podcasts.map((p) => p.category).filter(Boolean))),
  ];

  const filtered = podcasts.filter((p) => {
    const matchCat =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.presenter.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Handle Play Request for an episode
  const handlePlayToggle = async (pod: any) => {
    const id = pod.id;
    const currentState = episodeStates[id] || {
      tier: 'direct_audio',
      fallbackAudioUrl: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    };

    // Pause broadcast live stream so audio doesn't overlap
    pauseStream();

    // If currently playing, pause it
    if (activeEpisodeId === id && currentState.isPlaying) {
      const audio = audioElementsRef.current[id];
      if (audio) audio.pause();
      setEpisodeStates((prev) => ({
        ...prev,
        [id]: { ...currentState, isPlaying: false },
      }));
      return;
    }

    // Pause any other playing episode
    if (activeEpisodeId && activeEpisodeId !== id) {
      const prevAudio = audioElementsRef.current[activeEpisodeId];
      if (prevAudio) prevAudio.pause();
      setEpisodeStates((prev) => ({
        ...prev,
        [activeEpisodeId]: {
          ...(prev[activeEpisodeId] || {}),
          isPlaying: false,
        } as PodcastState,
      }));
    }

    setActiveEpisodeId(id);

    // Update global on-air ticker
    setCurrentTrack({
      title: pod.title,
      presenter: pod.presenter,
      isLive: false,
    });

    // Check Tier 1: Is direct audio URL provided?
    const hasDirectAudio =
      Boolean(pod.audio_url) && pod.audio_url.trim() !== '';

    if (hasDirectAudio && currentState.tier !== 'archive_fallback') {
      const audio = audioElementsRef.current[id];
      if (audio) {
        audio.src = pod.audio_url;
        audio
          .play()
          .then(() => {
            setEpisodeStates((prev) => ({
              ...prev,
              [id]: {
                tier: 'direct_audio',
                fallbackAudioUrl: null,
                isPlaying: true,
                currentTime: audio.currentTime,
                duration: audio.duration || 0,
              },
            }));
          })
          .catch(() => {
            // Tier 1 failed -> Trigger Tier 2 or 3 fallback
            triggerFallback(pod);
          });
      } else {
        triggerFallback(pod);
      }
    } else {
      // Missing audio_url -> Trigger Tier 2 or 3
      triggerFallback(pod);
    }
  };

  // Fallback engine: Tier 2 (YouTube) -> Tier 3 (Internet Archive CC0)
  const triggerFallback = async (pod: any) => {
    const id = pod.id;
    const ytId = extractYouTubeVideoId(pod.youtube_url);

    // Tier 2: YouTube Embed
    if (ytId) {
      setEpisodeStates((prev) => ({
        ...prev,
        [id]: {
          tier: 'youtube_embed',
          fallbackAudioUrl: null,
          isPlaying: true,
          currentTime: 0,
          duration: 0,
        },
      }));
      return;
    }

    // Tier 3: Internet Archive CC0 Audio Fallback
    try {
      const archiveUrl = await getArchiveFallbackAudioUrl();
      if (archiveUrl) {
        const audio = audioElementsRef.current[id];
        if (audio) {
          audio.src = archiveUrl;
          audio.load();
          audio
            .play()
            .then(() => {
              setEpisodeStates((prev) => ({
                ...prev,
                [id]: {
                  tier: 'archive_fallback',
                  fallbackAudioUrl: archiveUrl,
                  isPlaying: true,
                  currentTime: audio.currentTime,
                  duration: audio.duration || 0,
                },
              }));
            })
            .catch(() => {
              // Both direct and archive failed
              setEpisodeStates((prev) => ({
                ...prev,
                [id]: {
                  tier: 'failed',
                  fallbackAudioUrl: null,
                  isPlaying: false,
                  currentTime: 0,
                  duration: 0,
                },
              }));
            });
          return;
        }
      }
    } catch (e) {
      console.warn('Archive fallback failed:', e);
    }

    // If completely offline/failed
    setEpisodeStates((prev) => ({
      ...prev,
      [id]: {
        tier: 'failed',
        fallbackAudioUrl: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      },
    }));
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-gold uppercase tracking-wider mb-2">
          <Headphones className="w-4 h-4" />
          <span>Cultural Audio Archives & Song Uploads</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Podcasts & Audio Library
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Recorded community dialogues, traditional Sena oral literature, agricultural clinics, and licensed Malawian music available on-demand.
        </p>
      </div>

      {/* Explicit Legal Copyright Notice Banner per RFP Section 5 */}
      <div className="bg-station-sand/50 border-l-4 border-accent-gold p-4 rounded-r-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm text-xs font-sans">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-station-ink font-bold">
            <ShieldCheck className="w-4 h-4 text-accent-community" />
            <span>Broadcast Copyright Notice & Audio Licensing</span>
          </div>
          <p className="text-station-subtle leading-relaxed">
            All audio files uploaded are station-produced, licensed, or broadcast under public community domain permissions. If you hold copyright for any content broadcast here and wish to submit a takedown request, please use our verified rights route.
          </p>
        </div>
        <Link
          href="/feedback"
          className="shrink-0 font-semibold text-accent-live underline hover:text-station-ink"
        >
          Submit Takedown Request →
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-station-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-sans font-semibold transition-colors capitalize ${
                selectedCategory === cat
                  ? 'bg-station-ink text-white shadow-sm'
                  : 'bg-station-sand/50 text-station-ink hover:bg-station-sand'
              }`}
            >
              {cat === 'all' ? 'All Episodes' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-station-subtle" />
          <input
            type="text"
            placeholder="Search audio or presenter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 border border-station-border rounded bg-station-bg outline-none w-full md:w-56 font-sans text-xs"
          />
        </div>
      </div>

      {/* Episodes List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-station-subtle font-sans">
          Loading audio episodes from station archive...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-station-subtle font-sans bg-white border border-station-border rounded-lg">
          No matching podcast episodes found.
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((pod) => {
            const state = episodeStates[pod.id] || {
              tier: 'direct_audio',
              fallbackAudioUrl: null,
              isPlaying: false,
              currentTime: 0,
              duration: 0,
            };
            const isPlaying = state.isPlaying && activeEpisodeId === pod.id;
            const ytId = extractYouTubeVideoId(pod.youtube_url);

            return (
              <article
                key={pod.id}
                className={`bg-white border rounded-lg p-5 shadow-sm transition-all space-y-4 ${
                  activeEpisodeId === pod.id
                    ? 'border-accent-live ring-1 ring-accent-live/30'
                    : 'border-station-border hover:shadow-md'
                }`}
              >
                {/* Hidden Audio Tag for direct or archive audio */}
                <audio
                  ref={(el) => {
                    audioElementsRef.current[pod.id] = el;
                  }}
                  preload="none"
                  onEnded={() => {
                    setEpisodeStates((prev) => ({
                      ...prev,
                      [pod.id]: {
                        ...(prev[pod.id] || {}),
                        isPlaying: false,
                      } as PodcastState,
                    }));
                  }}
                  onError={() => {
                    // Audio loading failed -> trigger fallback
                    if (state.tier === 'direct_audio') {
                      triggerFallback(pod);
                    }
                  }}
                  onTimeUpdate={(e) => {
                    const target = e.currentTarget;
                    setEpisodeStates((prev) => ({
                      ...prev,
                      [pod.id]: {
                        ...(prev[pod.id] || {}),
                        currentTime: target.currentTime,
                        duration: target.duration || 0,
                      } as PodcastState,
                    }));
                  }}
                />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                      <span className="px-2 py-0.5 rounded bg-station-sand text-accent-community font-semibold">
                        {pod.category}
                      </span>
                      <span className="text-station-subtle font-mono">
                        Duration: {pod.duration}
                      </span>
                      <span className="text-station-subtle font-mono">
                        • {pod.broadcast_date}
                      </span>

                      {/* Tier 3 Archive Fallback Label Required by User */}
                      {state.tier === 'archive_fallback' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-gold/20 border border-accent-gold/40 text-accent-gold font-sans font-bold text-[11px] animate-in fade-in">
                          <Sparkles className="w-3 h-3" />
                          <span>Sample track — full episode coming soon</span>
                        </span>
                      )}

                      {/* Tier 2 YouTube Fallback Pill */}
                      {state.tier === 'youtube_embed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-live/10 border border-accent-live/30 text-accent-live font-sans font-bold text-[11px]">
                          <Video className="w-3 h-3" />
                          <span>Playing Video Recording</span>
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-xl font-bold text-station-ink">
                      {pod.title}
                    </h2>

                    <p className="text-xs text-station-subtle font-sans leading-relaxed">
                      {pod.description}
                    </p>

                    <div className="text-xs text-station-ink font-sans pt-1">
                      Presenter / Contributor: <strong>{pod.presenter}</strong>
                    </div>
                  </div>

                  {/* Play & Download Action Buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <button
                      onClick={() => handlePlayToggle(pod)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all shadow-sm ${
                        isPlaying
                          ? 'bg-accent-live text-white'
                          : 'bg-station-ink hover:bg-station-ink/90 text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>
                            {state.tier === 'youtube_embed'
                              ? 'Watch Episode'
                              : 'Play Episode'}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Download Button (Supports direct audio or archive fallback) */}
                    {(pod.audio_url || state.fallbackAudioUrl) && (
                      <a
                        href={pod.audio_url || state.fallbackAudioUrl || '#'}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-station-border bg-white text-station-ink hover:bg-station-sand text-xs font-semibold transition-colors"
                        title="Download MP3 for offline listening"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download MP3</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Tier 2: Inline YouTube Player Embed if active on YouTube tier */}
                {state.tier === 'youtube_embed' && ytId && (
                  <div className="pt-3 border-t border-station-border/60">
                    <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-station-border shadow-inner bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                        title={pod.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}

                {/* Optional YouTube Video Link (when not already embedded) */}
                {pod.youtube_url && state.tier !== 'youtube_embed' && (
                  <div className="pt-3 border-t border-station-border/50 flex items-center justify-between text-xs font-sans text-station-subtle bg-station-sand/20 p-2.5 rounded">
                    <span>Also available as video recording:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEpisodeStates((prev) => ({
                          ...prev,
                          [pod.id]: {
                            tier: 'youtube_embed',
                            fallbackAudioUrl: null,
                            isPlaying: true,
                            currentTime: 0,
                            duration: 0,
                          },
                        }));
                        setActiveEpisodeId(pod.id);
                        const audio = audioElementsRef.current[pod.id];
                        if (audio) audio.pause();
                      }}
                      className="text-accent-live hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Watch Embedded Video</span>
                    </button>
                  </div>
                )}

                {/* Offline / Failure Graceful Notice */}
                {state.tier === 'failed' && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      Audio archive connecting soon — digital master is currently being digitized.
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
