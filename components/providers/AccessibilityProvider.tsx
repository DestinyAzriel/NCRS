'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getStatus } from '@/lib/api-client';
import { getArchiveFallbackAudioUrl } from '@/lib/audio-fallback';

type TextSize = 'normal' | 'large' | 'xlarge';
type Language = 'en' | 'sena';
type AudioPlaybackState = 'idle' | 'buffering' | 'playing' | 'paused' | 'stream_down' | 'reconnecting';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  cycleTextSize: () => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  toggleHighContrast: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;

  // Persistent Broadcast Audio Engine
  isPlaying: boolean;
  audioState: AudioPlaybackState;
  streamUrl: string;
  setStreamUrl: (url: string) => void;
  isFallbackStream: boolean;
  togglePlay: () => void;
  playStream: () => void;
  pauseStream: () => void;
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  toggleMute: () => void;
  currentTrack: {
    title: string;
    presenter: string;
    isLive: boolean;
  };
  setCurrentTrack: (track: { title: string; presenter: string; isLive: boolean }) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>('normal');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [language, setLanguageState] = useState<Language>('en');

  // Audio State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioState, setAudioState] = useState<AudioPlaybackState>('idle');
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isFallbackStream, setIsFallbackStream] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [muted, setMuted] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Morning Shire Horizon (Kutcha kwa Shire)',
    presenter: 'Chifundo Banda & Maria Nyasulu',
    isLive: true,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load preferences and dynamic stream URL from backend
  useEffect(() => {
    try {
      const savedSize = localStorage.getItem('nyanthepa_text_size') as TextSize;
      if (savedSize && ['normal', 'large', 'xlarge'].includes(savedSize)) {
        setTextSizeState(savedSize);
        document.documentElement.setAttribute('data-text-size', savedSize);
      }

      const savedContrast = localStorage.getItem('nyanthepa_contrast');
      if (savedContrast === 'true') {
        setHighContrastState(true);
        document.documentElement.classList.add('high-contrast');
      }

      const savedLang = localStorage.getItem('nyanthepa_lang') as Language;
      if (savedLang && ['en', 'sena'].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    } catch {}

    // Fetch live stream configuration
    async function loadStreamConfig() {
      try {
        const st = await getStatus();
        if (st?.stream_url && st.stream_url.startsWith('http') && !st.stream_url.includes('example.com')) {
          setStreamUrl(st.stream_url);
          setIsFallbackStream(false);
        } else {
          // Resolve Internet Archive fallback audio stream
          const archiveUrl = await getArchiveFallbackAudioUrl();
          if (archiveUrl) {
            setStreamUrl(archiveUrl);
            setIsFallbackStream(true);
          }
        }
        if (st) {
          setCurrentTrack({
            title: st.on_air_show_title || 'Morning Shire Horizon',
            presenter: st.on_air_presenter || 'Chifundo Banda & Maria Nyasulu',
            isLive: true,
          });
        }
      } catch (err) {
        // Fallback to Internet Archive
        const archiveUrl = await getArchiveFallbackAudioUrl();
        if (archiveUrl) {
          setStreamUrl(archiveUrl);
          setIsFallbackStream(true);
        }
      }
    }
    loadStreamConfig();
  }, []);

  // HTML5 Audio Event Handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleWaiting = () => setAudioState('buffering');
    const handlePlaying = () => {
      setAudioState('playing');
      setIsPlaying(true);
    };
    const handlePause = () => {
      setAudioState('paused');
      setIsPlaying(false);
    };
    const handleError = async () => {
      // If direct stream failed, try Internet Archive fallback
      if (!isFallbackStream) {
        try {
          const archiveUrl = await getArchiveFallbackAudioUrl();
          if (archiveUrl && audioRef.current) {
            setIsFallbackStream(true);
            setStreamUrl(archiveUrl);
            audioRef.current.src = archiveUrl;
            audioRef.current.loop = true;
            audioRef.current.load();
            audioRef.current.play().catch(() => setAudioState('stream_down'));
            return;
          }
        } catch {}
      }

      setAudioState('stream_down');
      setIsPlaying(false);

      // Auto reconnect attempt after 8 seconds
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setTimeout(() => {
        if (audioRef.current && isPlaying) {
          setAudioState('reconnecting');
          audioRef.current.load();
          audioRef.current.play().catch(() => setAudioState('stream_down'));
        }
      }, 8000);
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [isPlaying, isFallbackStream]);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    try {
      localStorage.setItem('nyanthepa_text_size', size);
      document.documentElement.setAttribute('data-text-size', size);
    } catch {}
  };

  const cycleTextSize = () => {
    const next: Record<TextSize, TextSize> = {
      normal: 'large',
      large: 'xlarge',
      xlarge: 'normal',
    };
    setTextSize(next[textSize]);
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    try {
      localStorage.setItem('nyanthepa_contrast', val ? 'true' : 'false');
      if (val) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    } catch {}
  };

  const toggleHighContrast = () => setHighContrast(!highContrast);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('nyanthepa_lang', lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sena' : 'en');
  };

  // Audio Controls
  const playStream = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioState('buffering');

    // Ensure we have a valid stream URL before playing
    if (!audio.src || audio.src === window.location.href || audio.src === '') {
      const archiveUrl = await getArchiveFallbackAudioUrl();
      if (archiveUrl) {
        setStreamUrl(archiveUrl);
        setIsFallbackStream(true);
        audio.src = archiveUrl;
        audio.loop = true;
      }
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setAudioState('playing');
      })
      .catch(async (e) => {
        console.warn('Audio stream primary play error, switching to Internet Archive CC0 stream:', e);
        try {
          const archiveUrl = await getArchiveFallbackAudioUrl();
          if (archiveUrl && audioRef.current) {
            setIsFallbackStream(true);
            setStreamUrl(archiveUrl);
            audioRef.current.src = archiveUrl;
            audioRef.current.loop = true;
            audioRef.current.load();
            audioRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                setAudioState('playing');
              })
              .catch(() => setAudioState('stream_down'));
            return;
          }
        } catch {}
        setAudioState('stream_down');
      });
  };

  const pauseStream = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setAudioState('paused');
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseStream();
    } else {
      playStream();
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        cycleTextSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        language,
        setLanguage,
        toggleLanguage,
        isPlaying,
        audioState,
        streamUrl,
        setStreamUrl,
        isFallbackStream,
        togglePlay,
        playStream,
        pauseStream,
        volume,
        setVolume,
        muted,
        toggleMute,
        currentTrack,
        setCurrentTrack,
      }}
    >
      {/* Central Persistent Broadcast Audio Element */}
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="none"
        aria-hidden="true"
        className="hidden"
      />
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
