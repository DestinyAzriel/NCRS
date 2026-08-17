'use client';

import React from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { Play, Pause, Radio, Volume2, VolumeX, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export function OnAirBar() {
  const { isPlaying, audioState, togglePlay, currentTrack, language, muted, toggleMute, isFallbackStream } =
    useAccessibility();

  return (
    <aside
      aria-label="Live Broadcast Player"
      className="sticky top-0 z-50 w-full bg-station-ink text-station-bg border-b border-station-border/20 shadow-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-2 sm:gap-4">
        {/* Live Station Brand & Pulse Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className={`flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-sans tracking-wide font-semibold text-station-bg border transition-colors ${
              audioState === 'stream_down'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : audioState === 'buffering'
                ? 'bg-accent-gold/20 border-accent-gold/40 text-accent-gold'
                : 'bg-accent-live/20 border-accent-live/40 text-white'
            }`}
          >
            {audioState === 'buffering' ? (
              <>
                <Loader2 className="w-2.5 h-2.5 animate-spin text-accent-gold" />
                <span className="font-bold text-[10px] sm:text-[11px]">BUFFERING</span>
              </>
            ) : audioState === 'stream_down' ? (
              <>
                <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
                <span className="font-bold text-[10px] sm:text-[11px]">BACK SHORTLY</span>
              </>
            ) : (
              <>
                <span
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                    isPlaying ? 'bg-accent-live animate-live-pulse' : 'bg-station-bg/40'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-bold text-[10px] sm:text-[11px]">ON AIR</span>
              </>
            )}
          </div>

          <Link
            href="/live"
            className="flex items-center gap-1.5 sm:gap-2 hover:text-accent-gold transition-colors focus-visible:outline-accent-gold"
          >
            <span className="font-display font-bold tracking-tight text-xs sm:text-base text-white">
              Nyanthepa 107.6 FM
            </span>
            <span className="hidden md:inline text-xs font-sans text-station-bg/60">
              | Nsanje & Lower Shire
            </span>
          </Link>
        </div>

        {/* Current Program info or stream down message / fallback label */}
        <div className="hidden sm:flex items-center gap-2 overflow-hidden text-xs truncate">
          {audioState === 'stream_down' ? (
            <span className="text-amber-300 font-sans font-medium flex items-center gap-1.5">
              <span>Studio signal reconnecting — broadcast resumes momentarily.</span>
            </span>
          ) : isFallbackStream ? (
            <span className="inline-flex items-center gap-1.5 text-accent-gold font-sans font-semibold">
              <Radio className="w-3.5 h-3.5 text-accent-gold shrink-0" />
              <span className="px-2 py-0.5 rounded bg-accent-gold/20 border border-accent-gold/40 text-[11px]">
                Live stream connecting soon — preview
              </span>
              <span className="text-station-bg/80 truncate">
                • {currentTrack.title}
              </span>
            </span>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5 text-accent-gold shrink-0" />
              <span className="text-station-bg/70 shrink-0 font-medium font-sans">
                {language === 'en' ? 'Now Playing:' : 'Chomwe Chikukamba:'}
              </span>
              <span className="font-semibold text-station-bg truncate font-sans">
                {currentTrack.title}
              </span>
            </>
          )}
        </div>

        {/* Listen Live CTA & Player Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause live radio stream' : 'Listen live to Nyanthepa 107.6 FM'}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold tracking-wide shadow transition-all transform active:scale-95 focus-visible:outline-white ${
              audioState === 'stream_down'
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : audioState === 'buffering'
                ? 'bg-accent-gold text-station-ink font-bold'
                : 'bg-accent-live hover:bg-accent-live/90 text-white'
            }`}
          >
            {audioState === 'buffering' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>CONNECTING...</span>
              </>
            ) : audioState === 'stream_down' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RETRY SIGNAL</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>LISTEN LIVE</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              onClick={toggleMute}
              className="p-1.5 text-station-bg/80 hover:text-white rounded hover:bg-white/10 transition-colors"
              title={muted ? 'Unmute' : 'Mute'}
              aria-label={muted ? 'Unmute stream' : 'Mute stream'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-accent-live" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          <Link
            href="/live"
            className="p-1.5 text-station-bg/50 hover:text-accent-gold rounded hover:bg-white/10 transition-colors hidden sm:inline-flex items-center"
            title="Open Live Studio page"
            aria-label="Open Live Studio page"
          >
            <Radio className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
