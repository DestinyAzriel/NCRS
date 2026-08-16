'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getNews } from '@/lib/api-client';
import { Newspaper, Calendar, User, ArrowLeft, Share2, Radio, Clock, ShieldCheck } from 'lucide-react';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [story, setStory] = useState<any>(null);
  const [recentStories, setRecentStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const all = await getNews(10);
        const match = all.find((s: any) => s.slug === slug);
        if (match) {
          setStory(match);
          setRecentStories(all.filter((s: any) => s.slug !== slug).slice(0, 3));
        } else {
          setError('Article not found.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-station-subtle font-sans">
        Loading news report from station archive...
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-station-ink">
          Article Not Found
        </h1>
        <p className="text-xs text-station-subtle font-sans">
          The requested news dispatch could not be loaded or may have been archived.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent-live underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to All News Stories</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-station-subtle hover:text-station-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shire Valley Dispatches</span>
        </Link>
      </div>

      {/* Main Article Header */}
      <header className="space-y-4 border-b border-station-border pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
          <span className="px-2.5 py-1 rounded bg-station-sand text-accent-community font-semibold">
            {story.category}
          </span>
          <span className="text-station-subtle font-mono">
            Published: {new Date(story.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-station-ink leading-tight">
          {story.title}
        </h1>

        {/* Standfirst Summary */}
        <p className="text-base sm:text-lg text-station-subtle font-sans leading-relaxed italic border-l-2 border-accent-gold pl-4 py-1">
          {story.summary}
        </p>

        <div className="pt-2 flex items-center justify-between text-xs text-station-subtle font-sans">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            <span>Reporting by <strong className="text-station-ink">{story.author}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-accent-live" />
            <span>Broadcast Desk • Nsanje 107.6 FM</span>
          </div>
        </div>
      </header>

      {/* Article Body Content */}
      <div className="prose prose-station max-w-none text-station-ink text-sm sm:text-base leading-relaxed font-sans space-y-4">
        {story.content.split('\n\n').map((paragraph: string, idx: number) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Broadcaster Compliance & Editorial Standards note */}
      <div className="bg-station-sand/40 border border-station-border p-4 rounded-lg text-xs font-sans text-station-subtle flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent-community shrink-0 mt-0.5" />
        <div>
          <strong className="text-station-ink">Nyanthepa Editorial Standards:</strong> All reporting is verified under the Media Council of Malawi Code of Ethics. If you believe this story contains factual errors or requires correction, submit a report via our{' '}
          <Link href="/feedback" className="text-accent-live underline font-semibold">
            Feedback & Complaints Channel
          </Link>.
        </div>
      </div>

      {/* Related News Dispatches */}
      {recentStories.length > 0 && (
        <div className="pt-8 border-t border-station-border space-y-4">
          <h3 className="font-display text-xl font-bold text-station-ink">
            More News from Nyanthepa Desk
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentStories.map((rel) => (
              <div key={rel.id} className="bg-white p-4 border border-station-border rounded-lg shadow-sm space-y-2">
                <span className="text-[11px] text-accent-community font-semibold font-sans">
                  {rel.category}
                </span>
                <h4 className="font-display text-sm font-bold text-station-ink hover:text-accent-live">
                  <Link href={`/news/${rel.slug}`}>{rel.title}</Link>
                </h4>
                <div className="text-[11px] text-station-subtle font-mono">
                  {new Date(rel.published_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
