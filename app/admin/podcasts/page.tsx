'use client';

import React, { useEffect, useState } from 'react';
import { getPodcasts, createPodcast, updatePodcast, deletePodcast, getStoredUser } from '@/lib/api-client';
import { Headphones, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, X, ShieldAlert, Play } from 'lucide-react';

export default function AdminPodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [presenter, setPresenter] = useState('');
  const [duration, setDuration] = useState('25 mins');
  const [audioUrl, setAudioUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sena Culture');
  const [rightsCleared, setRightsCleared] = useState(true);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const data = await getPodcasts();
      setPodcasts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getStoredUser());
    fetchPodcasts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setPresenter(user?.full_name || 'Nyanthepa Broadcaster');
    setDuration('25 mins');
    setAudioUrl('https://audio.nyanthepa.mw/podcasts/episode-sample.mp3');
    setYoutubeUrl('');
    setDescription('');
    setCategory('Sena Culture');
    setRightsCleared(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title);
    setPresenter(p.presenter);
    setDuration(p.duration);
    setAudioUrl(p.audio_url);
    setYoutubeUrl(p.youtube_url || '');
    setDescription(p.description);
    setCategory(p.category);
    setRightsCleared(p.rights_cleared);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        title,
        presenter,
        duration,
        audio_url: audioUrl,
        youtube_url: youtubeUrl || null,
        description,
        category,
        broadcast_date: new Date().toISOString().split('T')[0],
        rights_cleared: rightsCleared,
      };

      if (editingId) {
        await updatePodcast(editingId, payload);
        setSuccess('Podcast episode updated.');
      } else {
        await createPodcast(payload);
        setSuccess('Podcast / song upload published.');
      }

      setModalOpen(false);
      fetchPodcasts();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save podcast');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return;
    try {
      await deletePodcast(id);
      setSuccess('Podcast removed.');
      fetchPodcasts();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-station-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-station-ink">
            Podcasts & Song Uploads Manager
          </h1>
          <p className="text-xs text-station-subtle font-sans mt-0.5">
            Manage audio downloads, Sena cultural recordings, and optional YouTube video links with copyright compliance.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-station-ink hover:bg-station-ink/90 text-white rounded text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Audio / Podcast</span>
        </button>
      </div>

      {/* Copyright statement banner */}
      <div className="bg-station-sand/40 border border-station-border p-3.5 rounded flex items-start gap-2.5 text-xs text-station-subtle font-sans">
        <ShieldAlert className="w-4 h-4 text-accent-live shrink-0 mt-0.5" />
        <div>
          <strong className="text-station-ink">Copyright & Licensing Reminder:</strong> All audio uploaded must be station-owned, licensed, or rights-cleared per the Copyright Act of Malawi and MACRA broadcast regulations.
        </div>
      </div>

      {success && (
        <div className="p-3 rounded bg-accent-community/10 border border-accent-community/30 text-xs text-accent-community font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-station-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-station-sand/40 border-b border-station-border text-station-subtle font-semibold">
              <tr>
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4">Presenter</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Links</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-station-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-station-subtle">
                    Loading audio library...
                  </td>
                </tr>
              ) : podcasts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-station-subtle">
                    No podcast episodes found. Click "Upload Audio / Podcast" to add one.
                  </td>
                </tr>
              ) : (
                podcasts.map((p) => (
                  <tr key={p.id} className="hover:bg-station-sand/20 transition-colors">
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-bold text-station-ink font-sans text-sm">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-station-subtle font-sans line-clamp-1 mt-0.5">
                        {p.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-station-ink">
                      {p.presenter}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-station-sand text-station-ink font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-station-subtle">
                      {p.duration}
                    </td>
                    <td className="py-3 px-4 font-sans space-x-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-accent-community/15 text-accent-community text-[10px] font-bold">
                        MP3 Audio
                      </span>
                      {p.youtube_url && (
                        <span className="px-1.5 py-0.5 rounded bg-accent-live/15 text-accent-live text-[10px] font-bold">
                          YouTube
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded hover:bg-station-sand text-station-ink"
                        title="Edit podcast"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded hover:bg-accent-live/10 text-accent-live"
                        title="Delete podcast"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-station-border max-w-lg w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-station-border pb-3">
              <h2 className="font-display text-lg font-bold text-station-ink">
                {editingId ? 'Edit Podcast Episode' : 'Upload Audio / Song Episode'}
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
                  Episode / Song Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nyau Oral Histories of the Lower Shire"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Presenter / Artist *
                  </label>
                  <input
                    type="text"
                    required
                    value={presenter}
                    onChange={(e) => setPresenter(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Duration (e.g. 28 mins)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  MP3 Direct Audio URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://audio.nyanthepa.mw/podcasts/episode-1.mp3"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg font-mono outline-none"
                />
                <p className="text-[11px] text-station-subtle mt-0.5">
                  Allows in-browser streaming and direct offline MP3 download.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  YouTube Video URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Episode Synopsis *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Description of the audio content, contributors, and themes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                >
                  <option value="Sena Culture & Heritage">Sena Culture & Heritage</option>
                  <option value="Community Health & Education">Community Health & Education</option>
                  <option value="Agriculture & Farming">Agriculture & Farming</option>
                  <option value="Youth & Community Voices">Youth & Community Voices</option>
                  <option value="Women & Development">Women & Development</option>
                </select>
              </div>

              <div className="p-3 bg-station-sand/40 rounded border border-station-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rightsCleared}
                    onChange={(e) => setRightsCleared(e.target.checked)}
                    className="rounded text-accent-live focus:ring-accent-live"
                  />
                  <span className="font-semibold text-station-ink">
                    I confirm this audio is rights-cleared or station licensed
                  </span>
                </label>
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
                  {editingId ? 'Update Episode' : 'Publish Audio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
