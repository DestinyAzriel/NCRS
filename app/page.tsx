'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { getStatus, getNews, getSchedule, getSports, getPodcasts } from '@/lib/api-client';
import {
  Radio, Calendar, Newspaper, Trophy, Headphones, ArrowRight,
  ShieldCheck, Waves, Play, Pause, AlertTriangle, ExternalLink
} from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function HomePage() {
  const { language, isPlaying, togglePlay, setCurrentTrack } = useAccessibility();
  const [status, setStatus] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [localLeague, setLocalLeague] = useState<any>(null);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const currentDay = DAYS[new Date().getDay()];
        const [st, newsData, schedData, sportsData, podData] = await Promise.all([
          getStatus().catch(() => null),
          getNews(3).catch(() => []),
          getSchedule().catch(() => []),
          getSports().catch(() => []),
          getPodcasts().catch(() => []),
        ]);

        if (st) {
          setStatus(st);
          setCurrentTrack({
            title: st.on_air_show_title,
            presenter: st.on_air_presenter,
            isLive: true,
          });
        }
        setNews(newsData.slice(0, 3));
        const filteredSched = schedData.filter((s: any) => s.day_of_week === currentDay || s.day_of_week === 'Monday');
        setTodaySchedule(filteredSched.slice(0, 4));
        const local = sportsData.find((l: any) => l.league_key === 'local_nsanje') || sportsData[0];
        setLocalLeague(local);
        setPodcasts(podData.slice(0, 2));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setCurrentTrack]);

  return (
    <div className="space-y-14">
      {/* 1. Live Shire Valley Advisory Banner */}
      {status?.advisory_active && (
        <div className="bg-accent-live/10 border-l-4 border-accent-live p-4 rounded-r-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-live animate-live-pulse" />
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-accent-live">
                {status.advisory_headline || (language === 'en' ? 'Live Shire Valley Advisory' : 'Chidziwitso cha Mumtsinje wa Shire')}
              </span>
            </div>
            <p className="text-sm font-medium text-station-ink mt-1">
              {status.advisory_message || (language === 'en'
                ? 'Water levels along Chiromo and Marka riverbanks remain steady. Tune into 107.6 FM every hour for localized weather and agricultural updates.'
                : 'Madzi a mumtsinje wa Shire ku Chiromo ndi Marka ali bwinobwino. Khalani omvetsera 107.6 FM nthawi iliyonse.')}
            </p>
          </div>
          <Link
            href="/news"
            className="shrink-0 text-xs font-sans text-accent-live font-bold underline hover:text-station-ink"
          >
            Read Bulletin →
          </Link>
        </div>
      )}

      {/* 2. Hero Broadcast Masthead */}
      <section className="bg-station-ink text-station-bg rounded-lg p-6 sm:p-10 border border-station-border/20 shadow-md relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-station-bg/10 text-accent-gold font-sans text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            <span>107.6 MHz FM — THE VOICE OF NSANJE & LOWER SHIRE</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {language === 'en'
              ? 'Proximity, Community Truth, and the Sena Voice.'
              : 'Mawu a Chifundo, Choonadi cha Anthu a ku Nsanje.'}
          </h1>
          <p className="text-sm sm:text-base text-station-bg/80 leading-relaxed font-sans max-w-2xl">
            {language === 'en'
              ? 'Broadcasting from Nsanje Boma to the far reaches of Bangula, Tengani, Chiromo, and Marka. Dedicated to community agriculture, local football leagues, flood preparedness, and cultural preservation.'
              : 'Kuwulutsa kuchokera ku Nsanje Boma kufikira ku Bangula, Tengani, Chiromo ndi Marka. Kudzipereka ku ulimi, mpira wa m’maboma, chitetezo cha kusefukira kwa madzi, ndi chikhalidwe cha Chisena.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-sans">
            <button
              onClick={togglePlay}
              className="bg-accent-live hover:bg-accent-live/90 text-white font-bold px-5 py-2.5 rounded transition-all inline-flex items-center gap-2 shadow"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE STREAM</span>
                </>
              ) : (
                <>
                  <Waves className="w-4 h-4" />
                  <span>LISTEN LIVE NOW (107.6 FM)</span>
                </>
              )}
            </button>
            <Link
              href="/programs"
              className="bg-station-bg/10 hover:bg-station-bg/20 text-station-bg border border-station-bg/20 font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-accent-gold" />
              <span>Today's Broadcast Timetable</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Grid of Structured Broadcast Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* News Card */}
        <div className="bg-white p-6 rounded-lg border border-station-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-sans text-station-subtle mb-3">
              <span className="flex items-center gap-1.5 font-bold text-accent-live uppercase tracking-wider">
                <Newspaper className="w-4 h-4" />
                <span>NSANJE DISPATCHES</span>
              </span>
              <span className="font-medium">Live Feed</span>
            </div>
            <h2 className="font-display text-xl font-bold text-station-ink mb-2">
              Lower Shire Agricultural & District News
            </h2>
            <p className="text-xs text-station-subtle leading-relaxed mb-4 font-sans">
              Verified local reporting on cotton auctions in Bangula, boreholes rehabilitation in Tengani, and disaster risk management.
            </p>
          </div>
          <Link
            href="/news"
            className="text-xs font-sans font-bold text-station-ink hover:text-accent-live inline-flex items-center gap-1 pt-3 border-t border-station-border/50"
          >
            <span>View All {news.length > 0 ? `${news.length}+` : ''} News Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Sports Log Card */}
        <div className="bg-white p-6 rounded-lg border border-station-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-sans text-station-subtle mb-3">
              <span className="flex items-center gap-1.5 font-bold text-accent-community uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>SPORTS LOG TABLES</span>
              </span>
              <span className="font-medium">FDH & District</span>
            </div>
            <h2 className="font-display text-xl font-bold text-station-ink mb-2">
              Nsanje District League & FDH Premiership
            </h2>
            <p className="text-xs text-station-subtle leading-relaxed mb-4 font-sans">
              Direct broadcast standings for Bango FC, Bangula Stars, and Tengani Youngsters alongside national football coverage.
            </p>
          </div>
          <Link
            href="/sports"
            className="text-xs font-sans font-bold text-station-ink hover:text-accent-community inline-flex items-center gap-1 pt-3 border-t border-station-border/50"
          >
            <span>Open Standings Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Podcasts & Cultural Archives */}
        <div className="bg-white p-6 rounded-lg border border-station-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-sans text-station-subtle mb-3">
              <span className="flex items-center gap-1.5 font-bold text-accent-gold uppercase tracking-wider">
                <Headphones className="w-4 h-4" />
                <span>ARCHIVED BROADCASTS</span>
              </span>
              <span className="font-medium">Audio + Video</span>
            </div>
            <h2 className="font-display text-xl font-bold text-station-ink mb-2">
              Sena Culture & Community Podcasts
            </h2>
            <p className="text-xs text-station-subtle leading-relaxed mb-4 font-sans">
              Stream recorded community dialogues, Nyau traditional songs, and health educational series on demand.
            </p>
          </div>
          <Link
            href="/podcasts"
            className="text-xs font-sans font-bold text-station-ink hover:text-accent-live inline-flex items-center gap-1 pt-3 border-t border-station-border/50"
          >
            <span>Browse Audio Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4. Latest News Dispatches Preview from API */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-station-border pb-3">
          <div>
            <span className="text-xs font-sans font-bold text-accent-live uppercase tracking-wider">
              Recent Broadcast Reports
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-station-ink">
              Shire Valley Dispatches
            </h2>
          </div>
          <Link
            href="/news"
            className="text-xs font-sans font-bold text-station-ink hover:text-accent-live inline-flex items-center gap-1"
          >
            <span>Read All Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((story) => (
            <article key={story.id} className="bg-white border border-station-border p-5 rounded-lg shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-xs text-accent-community font-semibold font-sans">
                  {story.category}
                </span>
                <h3 className="font-display text-lg font-bold text-station-ink leading-snug hover:text-accent-live transition-colors">
                  <Link href={`/news/${story.slug}`}>{story.title}</Link>
                </h3>
                <p className="text-xs text-station-subtle leading-relaxed font-sans line-clamp-3">
                  {story.summary}
                </p>
              </div>
              <div className="pt-3 text-xs text-station-subtle border-t border-station-border/50 flex justify-between items-center font-sans">
                <span className="font-mono">{new Date(story.published_at).toLocaleDateString()}</span>
                <Link href={`/news/${story.slug}`} className="font-bold text-station-ink hover:text-accent-live">
                  Read Full Story →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. On-Air Program Schedule Timetable (API-driven) */}
      <section className="bg-white border border-station-border p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-station-border pb-3">
          <div>
            <span className="text-xs font-sans font-bold text-accent-community uppercase tracking-wider">
              Broadcast Grid
            </span>
            <h2 className="font-display text-2xl font-bold text-station-ink">
              Today's Program Schedule
            </h2>
          </div>
          <Link
            href="/programs"
            className="text-xs font-sans font-bold text-accent-live hover:underline"
          >
            Full 7-Day Weekly Timetable →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-station-border font-sans font-semibold text-station-subtle bg-station-muted/40">
                <th className="py-2.5 px-3 w-36">Time</th>
                <th className="py-2.5 px-3">Program Title</th>
                <th className="py-2.5 px-3">Anchor / Presenters</th>
                <th className="py-2.5 px-3">Language</th>
                <th className="py-2.5 px-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-station-border/60">
              {todaySchedule.map((slot, idx) => (
                <tr key={slot.id || idx} className={idx === 0 ? 'bg-accent-live/5 font-medium' : 'hover:bg-station-sand/20'}>
                  <td className="py-3 px-3 font-mono font-bold text-accent-live">
                    {slot.start_time} - {slot.end_time}
                  </td>
                  <td className="py-3 px-3 font-sans font-bold text-station-ink">
                    {slot.program_name}
                    {idx === 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-accent-live font-bold font-sans">
                        <span className="w-2 h-2 rounded-full bg-accent-live animate-live-pulse" />
                        ON AIR NOW
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-sans text-station-ink">
                    {slot.presenter}
                  </td>
                  <td className="py-3 px-3 font-sans text-station-subtle">
                    {slot.language}
                  </td>
                  <td className="py-3 px-3 font-sans text-station-subtle">
                    <span className="px-2 py-0.5 rounded bg-station-sand text-station-ink font-medium">
                      {slot.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Sports Standings & Podcasts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sports Log Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-end justify-between border-b border-station-border pb-2">
            <div>
              <span className="text-xs font-sans font-bold text-accent-community uppercase tracking-wider">
                Lower Shire Football Standings
              </span>
              <h2 className="font-display text-2xl font-bold text-station-ink">
                {localLeague?.league_name || 'Nsanje District League'}
              </h2>
            </div>
            <Link href="/sports" className="text-xs font-sans font-bold text-accent-live hover:underline">
              FDH & EPL Tables →
            </Link>
          </div>

          <div className="bg-white border border-station-border rounded overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs league-table">
              <thead>
                <tr className="bg-station-sand/40 border-b border-station-border font-sans font-semibold text-station-subtle">
                  <th className="py-2 px-3 w-8">#</th>
                  <th className="py-2 px-3">Club</th>
                  <th className="py-2 px-2 text-center">P</th>
                  <th className="py-2 px-2 text-center">W</th>
                  <th className="py-2 px-2 text-center">D</th>
                  <th className="py-2 px-2 text-center">L</th>
                  <th className="py-2 px-2 text-center font-bold">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-station-border/50">
                {localLeague?.standings_data?.slice(0, 5).map((row: any) => (
                  <tr key={row.pos} className="hover:bg-station-sand/20">
                    <td className="py-2 px-3 font-bold font-mono text-accent-community">{row.pos}</td>
                    <td className="py-2 px-3 font-sans font-semibold text-station-ink">{row.team}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.played}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.won}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.drawn}</td>
                    <td className="py-2 px-2 text-center font-mono">{row.lost}</td>
                    <td className="py-2 px-2 text-center font-bold font-mono text-station-ink">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Podcasts / Cultural Audio */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b border-station-border pb-2">
            <span className="text-xs font-sans font-bold text-accent-gold uppercase tracking-wider">
              Audio Downloads
            </span>
            <h2 className="font-display text-2xl font-bold text-station-ink">
              Recent Podcast Uploads
            </h2>
          </div>

          <div className="space-y-3">
            {podcasts.map((pod) => (
              <div key={pod.id} className="bg-white border border-station-border p-4 rounded-lg shadow-sm flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-sans text-station-subtle">
                    {pod.category} • {pod.duration}
                  </span>
                  <h3 className="font-display text-sm font-bold text-station-ink mt-0.5">
                    {pod.title}
                  </h3>
                  <div className="text-xs text-station-subtle font-sans mt-0.5">
                    Host: {pod.presenter}
                  </div>
                </div>
                <Link
                  href="/podcasts"
                  className="p-2.5 bg-station-sand hover:bg-accent-live hover:text-white rounded transition-colors shrink-0"
                  aria-label={`Listen to ${pod.title}`}
                >
                  <Headphones className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Accountability and Compliance Banner */}
      <section className="bg-station-muted p-6 rounded-lg border border-station-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <ShieldCheck className="w-8 h-8 text-accent-community shrink-0" />
          <div>
            <h3 className="font-display text-base font-bold text-station-ink">
              Ethical Broadcast & Public Complaints Routing
            </h3>
            <p className="text-xs text-station-subtle font-sans">
              Nyanthepa adheres to the Media Council of Malawi Code of Ethics and MACRA Broadcasting Regulations.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-sans text-xs">
          <Link
            href="/feedback"
            className="px-4 py-2 bg-station-ink text-white rounded hover:bg-station-ink/90 font-bold shadow-sm"
          >
            Submit Feedback / Complaint
          </Link>
          <Link
            href="/privacy"
            className="px-4 py-2 border border-station-border bg-white text-station-ink rounded hover:bg-station-bg font-semibold shadow-sm"
          >
            Data Protection Act 2024
          </Link>
        </div>
      </section>
    </div>
  );
}
