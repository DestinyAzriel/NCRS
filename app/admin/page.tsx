'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredUser, getNews, getSchedule, getPodcasts, getSports, getFeedback, getStatus } from '@/lib/api-client';
import {
  Newspaper, Calendar, Headphones, Trophy, MessageSquare,
  Radio, CheckCircle2, ArrowRight, PlusCircle, AlertCircle, BookOpen
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    newsCount: 0,
    scheduleCount: 0,
    podcastCount: 0,
    leaguesCount: 0,
    feedbackCount: 0,
    urgentFeedback: 0,
  });
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    async function loadData() {
      try {
        const [news, schedule, podcasts, sports, feedback, st] = await Promise.all([
          getNews().catch(() => []),
          getSchedule().catch(() => []),
          getPodcasts().catch(() => []),
          getSports().catch(() => []),
          getFeedback().catch(() => []),
          getStatus().catch(() => null),
        ]);
        setStats({
          newsCount: news.length,
          scheduleCount: schedule.length,
          podcastCount: podcasts.length,
          leaguesCount: sports.length,
          feedbackCount: feedback.length,
          urgentFeedback: feedback.filter((f: any) => f.is_urgent).length,
        });
        setStatus(st);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-station-border pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-station-ink">
            Station Management Dashboard
          </h1>
          <p className="text-xs text-station-subtle font-sans mt-0.5">
            Logged in as <strong>{user?.full_name || 'Staff Member'}</strong> ({user?.role?.toUpperCase()} role) • Nyanthepa 107.6 FM
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-live hover:bg-accent-live/90 text-white rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish News</span>
          </Link>
          <Link
            href="/admin/schedule"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-station-ink hover:bg-station-ink/90 text-white rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Show Slot</span>
          </Link>
        </div>
      </div>

      {/* On-Air Live State Card */}
      {status && (
        <div className="bg-station-ink text-station-bg p-4 sm:p-5 rounded-lg border border-station-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-live/20 border border-accent-live/40 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-accent-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="w-2 h-2 rounded-full bg-accent-live animate-live-pulse" />
                <span className="text-accent-gold font-bold uppercase tracking-wider">Live Broadcast State</span>
              </div>
              <div className="font-display text-base font-bold text-white mt-0.5">
                {status.on_air_show_title}
              </div>
              <div className="text-xs text-station-bg/70 font-sans">
                Anchors: {status.on_air_presenter} • Stream: <span className="font-mono text-accent-gold">{status.stream_status}</span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="text-xs font-sans font-semibold text-accent-gold hover:underline shrink-0"
          >
            Change Show / Edit Advisory Banner →
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Link
          href="/admin/news"
          className="bg-white p-4 rounded border border-station-border shadow-sm hover:border-accent-live transition-colors"
        >
          <div className="flex items-center justify-between text-station-subtle">
            <span className="text-xs font-sans font-semibold uppercase">News Stories</span>
            <Newspaper className="w-4 h-4 text-accent-live" />
          </div>
          <div className="text-2xl font-bold font-mono text-station-ink mt-2">
            {stats.newsCount}
          </div>
          <div className="text-[11px] text-station-subtle font-sans mt-1">Live on website & app</div>
        </Link>

        <Link
          href="/admin/schedule"
          className="bg-white p-4 rounded border border-station-border shadow-sm hover:border-accent-live transition-colors"
        >
          <div className="flex items-center justify-between text-station-subtle">
            <span className="text-xs font-sans font-semibold uppercase">Weekly Shows</span>
            <Calendar className="w-4 h-4 text-accent-community" />
          </div>
          <div className="text-2xl font-bold font-mono text-station-ink mt-2">
            {stats.scheduleCount}
          </div>
          <div className="text-[11px] text-station-subtle font-sans mt-1">Across 7 days</div>
        </Link>

        <Link
          href="/admin/podcasts"
          className="bg-white p-4 rounded border border-station-border shadow-sm hover:border-accent-live transition-colors"
        >
          <div className="flex items-center justify-between text-station-subtle">
            <span className="text-xs font-sans font-semibold uppercase">Audio Podcasts</span>
            <Headphones className="w-4 h-4 text-accent-gold" />
          </div>
          <div className="text-2xl font-bold font-mono text-station-ink mt-2">
            {stats.podcastCount}
          </div>
          <div className="text-[11px] text-station-subtle font-sans mt-1">Rights cleared audio</div>
        </Link>

        <Link
          href="/admin/sports"
          className="bg-white p-4 rounded border border-station-border shadow-sm hover:border-accent-live transition-colors"
        >
          <div className="flex items-center justify-between text-station-subtle">
            <span className="text-xs font-sans font-semibold uppercase">League Tables</span>
            <Trophy className="w-4 h-4 text-accent-community" />
          </div>
          <div className="text-2xl font-bold font-mono text-station-ink mt-2">
            {stats.leaguesCount}
          </div>
          <div className="text-[11px] text-station-subtle font-sans mt-1">Local, FDH, EPL</div>
        </Link>

        <Link
          href="/admin/feedback"
          className="bg-white p-4 rounded border border-station-border shadow-sm hover:border-accent-live transition-colors"
        >
          <div className="flex items-center justify-between text-station-subtle">
            <span className="text-xs font-sans font-semibold uppercase">Feedback Inbox</span>
            <MessageSquare className="w-4 h-4 text-accent-live" />
          </div>
          <div className="text-2xl font-bold font-mono text-station-ink mt-2">
            {stats.feedbackCount}
          </div>
          <div className="text-[11px] text-accent-live font-sans font-semibold mt-1">
            {stats.urgentFeedback > 0 ? `${stats.urgentFeedback} Urgent` : 'All read'}
          </div>
        </Link>
      </div>

      {/* Staff Orientation Deliverable: Getting Started in 5 Plain Steps */}
      <section className="bg-white rounded-lg border border-station-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-accent-community border-b border-station-border pb-3">
          <BookOpen className="w-5 h-5" />
          <h2 className="font-display text-lg font-bold text-station-ink">
            Staff Quick-Start Guide — Daily CMS Management
          </h2>
        </div>
        <p className="text-xs text-station-subtle font-sans">
          This system allows station staff to update the website and mobile app without touching any code. Below are the 5 core operations:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 pt-2">
          <div className="p-3.5 rounded bg-station-sand/40 border border-station-border space-y-2">
            <div className="text-xs font-bold text-accent-live font-mono">STEP 1</div>
            <div className="font-display text-sm font-bold text-station-ink">Publish News Story</div>
            <p className="text-[11px] text-station-subtle leading-relaxed font-sans">
              Enter title, category, summary and body. Mark as <strong>Featured</strong> to place on the home banner or toggle <strong>Send Push</strong> for flood alerts.
            </p>
            <Link href="/admin/news" className="inline-block text-[11px] font-semibold text-accent-live hover:underline">
              Go to News →
            </Link>
          </div>

          <div className="p-3.5 rounded bg-station-sand/40 border border-station-border space-y-2">
            <div className="text-xs font-bold text-accent-community font-mono">STEP 2</div>
            <div className="font-display text-sm font-bold text-station-ink">Update Broadcast Schedule</div>
            <p className="text-[11px] text-station-subtle leading-relaxed font-sans">
              Select the day of the week, input start/end time (e.g. 09:00), anchor names, and language (Chisena/EN). Updates the timetable instantly.
            </p>
            <Link href="/admin/schedule" className="inline-block text-[11px] font-semibold text-accent-community hover:underline">
              Go to Schedule →
            </Link>
          </div>

          <div className="p-3.5 rounded bg-station-sand/40 border border-station-border space-y-2">
            <div className="text-xs font-bold text-accent-gold font-mono">STEP 3</div>
            <div className="font-display text-sm font-bold text-station-ink">Upload Podcast / Song</div>
            <p className="text-[11px] text-station-subtle leading-relaxed font-sans">
              Paste direct MP3 audio link and optional YouTube embed URL. Confirm rights-cleared status for legal copyright compliance.
            </p>
            <Link href="/admin/podcasts" className="inline-block text-[11px] font-semibold text-accent-gold hover:underline">
              Go to Podcasts →
            </Link>
          </div>

          <div className="p-3.5 rounded bg-station-sand/40 border border-station-border space-y-2">
            <div className="text-xs font-bold text-accent-community font-mono">STEP 4</div>
            <div className="font-display text-sm font-bold text-station-ink">Update League Scores</div>
            <p className="text-[11px] text-station-subtle leading-relaxed font-sans">
              Select Nsanje District League, FDH Cup, or EPL. Adjust Played, Won, Drawn, Points. Reorders standings automatically.
            </p>
            <Link href="/admin/sports" className="inline-block text-[11px] font-semibold text-accent-community hover:underline">
              Go to Sports →
            </Link>
          </div>

          <div className="p-3.5 rounded bg-station-sand/40 border border-station-border space-y-2">
            <div className="text-xs font-bold text-accent-live font-mono">STEP 5</div>
            <div className="font-display text-sm font-bold text-station-ink">Review Complaints & Feedback</div>
            <p className="text-[11px] text-station-subtle leading-relaxed font-sans">
              Read community submissions. Flag resolved items or review regulatory complaints designated for MACRA or Media Council.
            </p>
            <Link href="/admin/feedback" className="inline-block text-[11px] font-semibold text-accent-live hover:underline">
              Go to Feedback →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
