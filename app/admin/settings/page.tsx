'use client';

import React, { useEffect, useState } from 'react';
import { getStatus, updateStatus, getStoredUser } from '@/lib/api-client';
import { Settings, Save, CheckCircle2, AlertCircle, Radio, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [showTitle, setShowTitle] = useState('');
  const [presenter, setPresenter] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamStatus, setStreamStatus] = useState('online');
  const [advisoryHeadline, setAdvisoryHeadline] = useState('');
  const [advisoryMessage, setAdvisoryMessage] = useState('');
  const [advisoryActive, setAdvisoryActive] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    async function load() {
      try {
        const st = await getStatus();
        if (st) {
          setShowTitle(st.on_air_show_title);
          setPresenter(st.on_air_presenter);
          setStreamUrl(st.stream_url);
          setStreamStatus(st.stream_status);
          setAdvisoryHeadline(st.advisory_headline);
          setAdvisoryMessage(st.advisory_message);
          setAdvisoryActive(st.advisory_active);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateStatus({
        on_air_show_title: showTitle,
        on_air_presenter: presenter,
        stream_url: streamUrl,
        stream_status: streamStatus,
        advisory_headline: advisoryHeadline,
        advisory_message: advisoryMessage,
        advisory_active: advisoryActive,
      });
      setSuccess('Station broadcast configuration updated live on website & app!');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-station-border pb-4">
        <h1 className="font-display text-2xl font-bold text-station-ink">
          Station Broadcast & Advisory Settings
        </h1>
        <p className="text-xs text-station-subtle font-sans mt-0.5">
          Configure dynamic live stream sources, on-air show name overrides, and the Lower Shire emergency weather advisory banner.
        </p>
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

      <form onSubmit={handleSave} className="space-y-6 text-xs font-sans">
        {/* On-Air Show Override */}
        <div className="bg-white p-6 rounded-lg border border-station-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-accent-live border-b border-station-border pb-3">
            <Radio className="w-4 h-4" />
            <h2 className="font-display text-base font-bold text-station-ink">
              Live On-Air Banner Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-station-ink mb-1">
                Current On-Air Program Name *
              </label>
              <input
                type="text"
                required
                value={showTitle}
                onChange={(e) => setShowTitle(e.target.value)}
                placeholder="Morning Shire Horizon"
                className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none"
              />
              <p className="text-[11px] text-station-subtle mt-0.5">
                Displays in the persistent On-Air bar on every page.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-station-ink mb-1">
                On-Air Presenter / Anchors *
              </label>
              <input
                type="text"
                required
                value={presenter}
                onChange={(e) => setPresenter(e.target.value)}
                placeholder="Chifundo Banda & Maria Nyasulu"
                className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Audio Stream URL */}
        <div className="bg-white p-6 rounded-lg border border-station-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-accent-community border-b border-station-border pb-3">
            <Settings className="w-4 h-4" />
            <h2 className="font-display text-base font-bold text-station-ink">
              Live Stream Transmission URL
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-station-ink mb-1">
                Icecast / Shoutcast MP3 Stream URL *
              </label>
              <input
                type="url"
                required
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="https://stream.nyanthepa.mw/live.mp3"
                className="w-full p-2.5 border border-station-border rounded bg-station-bg font-mono outline-none"
              />
              <p className="text-[11px] text-station-subtle mt-0.5">
                Feeds the web audio player, mobile background service, and persistent stream bar.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-station-ink mb-1">
                Stream Status
              </label>
              <select
                value={streamStatus}
                onChange={(e) => setStreamStatus(e.target.value)}
                className="w-full p-2.5 border border-station-border rounded bg-station-bg outline-none capitalize"
              >
                <option value="online">Online (Broadcasting)</option>
                <option value="buffering">Low Bandwidth Mode</option>
                <option value="maintenance">Studio Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Weather & Flood Advisory Banner */}
        <div className="bg-white p-6 rounded-lg border border-station-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-station-border pb-3">
            <div className="flex items-center gap-2 text-accent-gold">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="font-display text-base font-bold text-station-ink">
                Lower Shire Advisory / Emergency Banner
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={advisoryActive}
                onChange={(e) => setAdvisoryActive(e.target.checked)}
                className="rounded text-accent-live focus:ring-accent-live"
              />
              <span className="font-semibold text-station-ink text-xs">
                Display Banner on Homepage
              </span>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-station-ink mb-1">
                Advisory Headline
              </label>
              <input
                type="text"
                value={advisoryHeadline}
                onChange={(e) => setAdvisoryHeadline(e.target.value)}
                placeholder="Live Shire Valley Advisory"
                className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-station-ink mb-1">
                Advisory Message / Instructions
              </label>
              <textarea
                rows={3}
                value={advisoryMessage}
                onChange={(e) => setAdvisoryMessage(e.target.value)}
                placeholder="Water levels along Chiromo and Marka riverbanks remain steady..."
                className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-station-ink hover:bg-station-ink/90 text-white rounded font-bold shadow transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Broadcast...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
