'use client';

import React, { useEffect, useState } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { getStatus, getSchedule } from '@/lib/api-client';
import {
  Radio, Play, Pause, Volume2, VolumeX, Share2, MessageSquare,
  Clock, ShieldCheck, Waves, Users, Sparkles, Send, CheckCircle2
} from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function LiveStudioPage() {
  const { isPlaying, togglePlay, currentTrack, language } = useAccessibility();
  const [status, setStatus] = useState<any>(null);
  const [todayShows, setTodayShows] = useState<any[]>([]);
  const [muted, setMuted] = useState(false);
  const [shoutoutName, setShoutoutName] = useState('');
  const [shoutoutLocation, setShoutoutLocation] = useState('Nsanje Boma');
  const [shoutoutMessage, setShoutoutMessage] = useState('');
  const [submittedShoutout, setSubmittedShoutout] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const currentDay = DAYS[new Date().getDay()];
        const [st, sched] = await Promise.all([
          getStatus().catch(() => null),
          getSchedule().catch(() => []),
        ]);
        if (st) setStatus(st);
        const filtered = sched.filter((s: any) => s.day_of_week === currentDay || s.day_of_week === 'Monday');
        setTodayShows(filtered);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleShoutout = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedShoutout(true);
    setTimeout(() => {
      setShoutoutName('');
      setShoutoutMessage('');
      setSubmittedShoutout(false);
    }, 4000);
  };

  return (
    <div className="space-y-12">
      {/* Studio Header Banner */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-live uppercase tracking-wider mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-live animate-live-pulse" />
          <span>Live Broadcast Studio • 107.6 MHz FM</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Nyanthepa Live Airwaves
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Broadcasting uninterrupted from Nsanje Boma across the Lower Shire river valley. Listen live, view current anchor notes, and interact with the on-air presenters.
        </p>
      </div>

      {/* Main Studio Player Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Big Master Player */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-station-ink text-station-bg rounded-lg p-6 sm:p-10 border border-station-border shadow-md relative overflow-hidden">
            {/* Waveform Visualization Mock */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent-live animate-live-pulse" />
                <span className="font-mono text-xs font-bold text-accent-gold uppercase tracking-wider">
                  TRANSMITTER: NSANJE BOMA (107.6 MHz)
                </span>
              </div>
              <div className="text-xs font-mono text-white/60">
                STATUS: {status?.stream_status?.toUpperCase() || 'ONLINE (320kbps)'}
              </div>
            </div>

            {/* Current Show Title */}
            <div className="py-8 space-y-3">
              <span className="text-xs font-sans font-semibold text-accent-live uppercase tracking-wider">
                {language === 'en' ? 'Currently Broadcasting' : 'Chomwe Chikukamba'}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
                {status?.on_air_show_title || currentTrack.title}
              </h2>
              <p className="text-sm text-white/80 font-sans">
                Anchored by: <strong className="text-accent-gold">{status?.on_air_presenter || currentTrack.presenter}</strong>
              </p>
            </div>

            {/* Big Listen Controls */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-accent-live hover:bg-accent-live/90 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 focus:outline-none"
                  aria-label={isPlaying ? 'Pause broadcast stream' : 'Play broadcast stream'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>
                <div>
                  <div className="font-display text-lg font-bold text-white">
                    {isPlaying ? 'Live Stream Active' : 'Stream Paused'}
                  </div>
                  <div className="text-xs font-sans text-white/60">
                    {isPlaying ? 'Playing 107.6 FM digital feed' : 'Click to connect to audio transmission'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label={muted ? 'Unmute stream' : 'Mute stream'}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="px-3 py-1 rounded bg-white/10 text-xs font-mono text-white/80">
                  FM 107.6 MHz
                </div>
              </div>
            </div>
          </div>

          {/* Interactive On-Air Studio Shoutout & Song Request */}
          <div className="bg-white border border-station-border rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-accent-community border-b border-station-border pb-3">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-display text-lg font-bold text-station-ink">
                Send Live Shoutout or Song Request to Presenters
              </h3>
            </div>
            <p className="text-xs text-station-subtle font-sans">
              Your message is sent directly to the studio monitor in Nsanje Boma during live programming.
            </p>

            {submittedShoutout ? (
              <div className="p-4 rounded bg-accent-community/10 border border-accent-community/30 text-xs text-accent-community font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Zikomo kwambiri! Your message has been sent to the on-air presenters.</span>
              </div>
            ) : (
              <form onSubmit={handleShoutout} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-station-ink mb-1">
                      Your Name / Village *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chimwemwe from Tengani"
                      value={shoutoutName}
                      onChange={(e) => setShoutoutName(e.target.value)}
                      className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-station-ink mb-1">
                      Catchment Area
                    </label>
                    <select
                      value={shoutoutLocation}
                      onChange={(e) => setShoutoutLocation(e.target.value)}
                      className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                    >
                      <option value="Nsanje Boma">Nsanje Boma</option>
                      <option value="Bangula">Bangula</option>
                      <option value="Marka">Marka</option>
                      <option value="Tengani">Tengani</option>
                      <option value="Chiromo">Chiromo</option>
                      <option value="Online / Diaspora">Online / Diaspora</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Message / Song Request *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Greetings to family in Bangula, request for Lucius Banda song..."
                    value={shoutoutMessage}
                    onChange={(e) => setShoutoutMessage(e.target.value)}
                    className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-station-ink hover:bg-station-ink/90 text-white rounded font-bold shadow-sm inline-flex items-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Studio</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Today's Lineup & Studio Contacts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-station-border rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-station-border pb-3">
              <span className="text-xs font-sans font-bold text-accent-community uppercase tracking-wider">
                Today's Broadcast Lineup
              </span>
              <Clock className="w-4 h-4 text-station-subtle" />
            </div>

            <div className="divide-y divide-station-border/60">
              {todayShows.map((show, i) => (
                <div key={show.id || i} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-accent-live">
                      {show.start_time} - {show.end_time}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-station-sand font-medium">
                      {show.language}
                    </span>
                  </div>
                  <div className="font-display font-bold text-station-ink text-sm">
                    {show.program_name}
                  </div>
                  <div className="text-xs text-station-subtle font-sans">
                    Presenter: {show.presenter}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-station-sand/40 border border-station-border rounded-lg p-5 shadow-sm space-y-3 text-xs font-sans">
            <h4 className="font-display font-bold text-station-ink text-sm">
              Studio Hotline & WhatsApp
            </h4>
            <p className="text-station-subtle">
              Call into live phone-ins or report local breaking incidents:
            </p>
            <div className="p-3 bg-white rounded border border-station-border/70 font-mono text-station-ink font-bold">
              +265 (0) 888 000 107
            </div>
            <div className="text-[11px] text-station-subtle">
              On-air studio lines open during interactive programming.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
