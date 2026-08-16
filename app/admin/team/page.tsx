'use client';

import React, { useEffect, useState } from 'react';
import { getTeam, createTeamMember, deleteTeamMember, getStoredUser } from '@/lib/api-client';
import { Users, Plus, Trash2, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [onAirName, setOnAirName] = useState('');
  const [bio, setBio] = useState('');

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeam();
      setTeam(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getStoredUser());
    fetchTeam();
  }, []);

  const openCreateModal = () => {
    setName('');
    setRole('Broadcaster');
    setOnAirName('');
    setBio('');
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createTeamMember({
        name,
        role,
        on_air_name: onAirName || null,
        bio,
        order: team.length + 1,
      });
      setSuccess('Staff profile published to website.');
      setModalOpen(false);
      fetchTeam();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to add staff member');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this staff profile?')) return;
    try {
      await deleteTeamMember(id);
      setSuccess('Staff profile deleted.');
      fetchTeam();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-station-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-station-ink">
            Station Team & On-Air Personalities
          </h1>
          <p className="text-xs text-station-subtle font-sans mt-0.5">
            Manage public profiles of station anchors, reporters, and management directory (Manager role required).
          </p>
        </div>
        {user?.role === 'manager' && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-station-ink hover:bg-station-ink/90 text-white rounded text-xs font-semibold shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {success && (
        <div className="p-3 rounded bg-accent-community/10 border border-accent-community/30 text-xs text-accent-community font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Grid of Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-8 text-center text-xs text-station-subtle">
            Loading team profiles...
          </div>
        ) : (
          team.map((member) => (
            <div key={member.id} className="bg-white border border-station-border rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-station-ink">
                      {member.name}
                    </h3>
                    <div className="text-xs text-accent-community font-semibold font-sans">
                      {member.role}
                    </div>
                  </div>
                  {member.on_air_name && (
                    <span className="px-2 py-0.5 rounded bg-station-sand text-station-ink text-[11px] font-mono">
                      "{member.on_air_name}"
                    </span>
                  )}
                </div>
                <p className="text-xs text-station-subtle font-sans leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {user?.role === 'manager' && (
                <div className="pt-3 border-t border-station-border/60 flex justify-end">
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-xs text-accent-live hover:underline font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Profile</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-station-border max-w-lg w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-station-border pb-3">
              <h2 className="font-display text-lg font-bold text-station-ink">
                Add Team Member Profile
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Nyasulu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Official Station Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. News Editor"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    On-Air Radio Moniker
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maria"
                    value={onAirName}
                    onChange={(e) => setOnAirName(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Professional Bio / Coverage Focus *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Journalistic background, language fluencies, program assignments..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
