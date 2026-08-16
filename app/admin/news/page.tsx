'use client';

import React, { useEffect, useState } from 'react';
import { getNews, createNews, updateNews, deleteNews, getStoredUser } from '@/lib/api-client';
import { Newspaper, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, X, Send } from 'lucide-react';

export default function AdminNewsPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Agriculture & Trade');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Nyanthepa News Desk');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [sendPush, setSendPush] = useState(false);

  const CATEGORIES = [
    'Agriculture & Trade',
    'Disaster & Flood Preparedness',
    'Community Health',
    'Sports',
    'Water & Infrastructure',
    'Education & Youth',
    'Sena Culture & Heritage',
  ];

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getNews();
      setStories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getStoredUser());
    fetchNews();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setCategory('Agriculture & Trade');
    setSummary('');
    setContent('');
    setAuthor(user?.full_name || 'Nyanthepa News Desk');
    setIsFeatured(false);
    setIsBreaking(false);
    setSendPush(false);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (story: any) => {
    setEditingId(story.id);
    setTitle(story.title);
    setSlug(story.slug);
    setCategory(story.category);
    setSummary(story.summary);
    setContent(story.content);
    setAuthor(story.author);
    setIsFeatured(story.is_featured);
    setIsBreaking(story.is_breaking);
    setSendPush(story.send_push);
    setError(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        title,
        slug,
        category,
        summary,
        content,
        author,
        is_featured: isFeatured,
        is_breaking: isBreaking,
        send_push: sendPush,
      };

      if (editingId) {
        await updateNews(editingId, payload);
        setSuccess('Story updated successfully.');
      } else {
        await createNews(payload);
        setSuccess('Story published live on website & app.');
      }

      setModalOpen(false);
      fetchNews();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save news story');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await deleteNews(id);
      setSuccess('Story deleted successfully.');
      fetchNews();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-station-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-station-ink">
            News Stories & Bulletins Management
          </h1>
          <p className="text-xs text-station-subtle font-sans mt-0.5">
            Publish district news, flood bulletins, and agricultural dispatches live across web and mobile.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-live hover:bg-accent-live/90 text-white rounded text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </button>
      </div>

      {success && (
        <div className="p-3 rounded bg-accent-community/10 border border-accent-community/30 text-xs text-accent-community font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded bg-accent-live/10 border border-accent-live/30 text-xs text-accent-live font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* News Table */}
      <div className="bg-white rounded-lg border border-station-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-station-sand/40 border-b border-station-border text-station-subtle font-semibold">
              <tr>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-station-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-station-subtle font-sans">
                    Loading news stories...
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-station-subtle font-sans">
                    No news stories found. Click "Write New Story" to publish one.
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story.id} className="hover:bg-station-sand/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-station-ink font-sans max-w-md truncate">
                        {story.title}
                      </div>
                      <div className="text-[11px] text-station-subtle font-mono truncate">
                        /{story.slug}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-station-sand text-station-ink font-medium">
                        {story.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-station-subtle">
                      {story.author}
                    </td>
                    <td className="py-3 px-4 font-sans space-x-1">
                      {story.is_featured && (
                        <span className="px-1.5 py-0.5 rounded bg-accent-gold/20 text-accent-gold font-semibold text-[10px]">
                          Featured
                        </span>
                      )}
                      {story.send_push && (
                        <span className="px-1.5 py-0.5 rounded bg-accent-live/20 text-accent-live font-semibold text-[10px]">
                          Push Alert
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-station-subtle">
                      {new Date(story.published_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(story)}
                        className="p-1.5 rounded hover:bg-station-sand text-station-ink"
                        title="Edit story"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {user?.role === 'manager' && (
                        <button
                          onClick={() => handleDelete(story.id)}
                          className="p-1.5 rounded hover:bg-accent-live/10 text-accent-live"
                          title="Delete story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-station-border max-w-2xl w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-station-border pb-3">
              <h2 className="font-display text-lg font-bold text-station-ink">
                {editingId ? 'Edit News Story' : 'Publish New News Story'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-station-subtle hover:text-station-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Bangula Cotton Farmers Welcome New Market Weighing Stations"
                  className="w-full p-2.5 border border-station-border rounded bg-station-bg focus:ring-1 focus:ring-accent-live outline-none text-sm font-sans"
                />
                <p className="text-[11px] text-station-subtle mt-0.5">
                  Appears on the homepage and news list views.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Summary / Standfirst *
                </label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief 1-2 sentence overview shown in preview cards..."
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Full Article Body *
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Complete broadcast article text..."
                  className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Reporter / Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                  />
                </div>

                <div className="space-y-2 pt-3 sm:pt-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-accent-live focus:ring-accent-live"
                    />
                    <span className="font-semibold text-station-ink">
                      Feature on Homepage Banner
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendPush}
                      onChange={(e) => setSendPush(e.target.checked)}
                      className="rounded text-accent-live focus:ring-accent-live"
                    />
                    <span className="font-semibold text-accent-live">
                      Broadcast Emergency Push Alert (Mobile App)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-station-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-station-border rounded text-station-ink hover:bg-station-sand font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-station-ink hover:bg-station-ink/90 text-white rounded font-bold"
                >
                  {editingId ? 'Save Changes' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
