'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNews } from '@/lib/api-client';
import { Newspaper, Search, ArrowRight, Calendar, User, Tag } from 'lucide-react';

export default function NewsListPage() {
  const [news, setNews] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNews(100);
        setNews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(news.map((n) => n.category).filter(Boolean)))];

  const filteredNews = news.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      search === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-live uppercase tracking-wider mb-2">
          <Newspaper className="w-4 h-4" />
          <span>Local Journalism & Bulletins • 107.6 FM</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Shire Valley News & Bulletins
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Verified investigative and community reporting from Nsanje Boma, Bangula, Marka, and Tengani.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-station-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
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
              {cat === 'all' ? 'All Dispatches' : cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-station-subtle" />
          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 border border-station-border rounded bg-station-bg outline-none w-full md:w-56 font-sans text-xs"
          />
        </div>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-station-subtle font-sans">
          Loading news dispatches from the station desk...
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="py-16 text-center text-xs text-station-subtle font-sans bg-white border border-station-border rounded-lg">
          No news articles found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((story) => (
            <article
              key={story.id}
              className="bg-white border border-station-border rounded-lg p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="px-2 py-0.5 rounded bg-station-sand text-accent-community font-semibold">
                    {story.category}
                  </span>
                  <span className="font-mono text-station-subtle">
                    {new Date(story.published_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="font-display text-xl font-bold text-station-ink leading-snug hover:text-accent-live transition-colors">
                  <Link href={`/news/${story.slug}`}>{story.title}</Link>
                </h2>

                <p className="text-xs text-station-subtle font-sans leading-relaxed line-clamp-3">
                  {story.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-station-border/60 flex items-center justify-between text-xs font-sans text-station-subtle">
                <span className="truncate max-w-[150px]">By {story.author}</span>
                <Link
                  href={`/news/${story.slug}`}
                  className="font-bold text-station-ink hover:text-accent-live inline-flex items-center gap-1 shrink-0"
                >
                  <span>Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
