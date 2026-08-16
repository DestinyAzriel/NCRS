'use client';

import React, { useEffect, useState } from 'react';
import { getPodcasts } from '@/lib/api-client';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import {
  Headphones, Play, Pause, Download, ExternalLink, ShieldCheck,
  Search, ShieldAlert, Radio, Clock, User
} from 'lucide-react';
import Link from 'next/link';

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { setCurrentTrack } = useAccessibility();

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

  const categories = ['all', ...Array.from(new Set(podcasts.map((p) => p.category).filter(Boolean)))];

  const filtered = podcasts.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.presenter.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePlayEpisode = (pod: any) => {
    if (activeAudio === pod.audio_url && isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setActiveAudio(pod.audio_url);
      setIsPlayingAudio(true);
      setCurrentTrack({
        title: pod.title,
        presenter: pod.presenter,
        isLive: false,
      });
    }
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
        <div className="space-y-4">
          {filtered.map((pod) => {
            const isThisPlaying = activeAudio === pod.audio_url && isPlayingAudio;
            return (
              <article
                key={pod.id}
                className="bg-white border border-station-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
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

                  {/* Play & Download Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <button
                      onClick={() => handlePlayEpisode(pod)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all shadow-sm ${
                        isThisPlaying
                          ? 'bg-accent-live text-white'
                          : 'bg-station-ink hover:bg-station-ink/90 text-white'
                      }`}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Episode</span>
                        </>
                      )}
                    </button>

                    <a
                      href={pod.audio_url}
                      download
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-station-border bg-white text-station-ink hover:bg-station-sand text-xs font-semibold transition-colors"
                      title="Download MP3 for offline listening"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MP3</span>
                    </a>
                  </div>
                </div>

                {/* Optional YouTube Video Embed Link */}
                {pod.youtube_url && (
                  <div className="pt-3 border-t border-station-border/50 flex items-center justify-between text-xs font-sans text-station-subtle bg-station-sand/20 p-2.5 rounded">
                    <span>Also available as video recording:</span>
                    <a
                      href={pod.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-live hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
