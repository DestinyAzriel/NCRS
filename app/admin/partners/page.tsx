'use client';

import React, { useEffect, useState } from 'react';
import { getPartners, createPartner, deletePartner, getStoredUser } from '@/lib/api-client';
import { Handshake, Plus, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [partnerType, setPartnerType] = useState('donor');
  const [description, setDescription] = useState('');
  const [activeProjects, setActiveProjects] = useState('');

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await getPartners();
      setPartners(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getStoredUser());
    fetchPartners();
  }, []);

  const openCreateModal = () => {
    setName('');
    setPartnerType('donor');
    setDescription('');
    setActiveProjects('');
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createPartner({
        name,
        partner_type: partnerType,
        description,
        active_projects: activeProjects,
        order: partners.length + 1,
      });
      setSuccess('Partner / donor profile added.');
      setModalOpen(false);
      fetchPartners();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to add partner');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this partner?')) return;
    try {
      await deletePartner(id);
      setSuccess('Partner profile removed.');
      fetchPartners();
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
            Current Projects, Partners & Donors
          </h1>
          <p className="text-xs text-station-subtle font-sans mt-0.5">
            Manage institutional partners, development donor projects, and public impact summaries (Manager role required).
          </p>
        </div>
        {user?.role === 'manager' && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-station-ink hover:bg-station-ink/90 text-white rounded text-xs font-semibold shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Partner / Donor</span>
          </button>
        )}
      </div>

      {success && (
        <div className="p-3 rounded bg-accent-community/10 border border-accent-community/30 text-xs text-accent-community font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Grid of Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-8 text-center text-xs text-station-subtle">
            Loading partners...
          </div>
        ) : (
          partners.map((p) => (
            <div key={p.id} className="bg-white border border-station-border rounded-lg p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-lg font-bold text-station-ink">
                    {p.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-station-sand text-station-ink text-[10px] font-bold uppercase tracking-wider">
                    {p.partner_type}
                  </span>
                </div>
                <p className="text-xs text-station-subtle font-sans leading-relaxed">
                  {p.description}
                </p>
                <div className="bg-station-sand/40 p-3 rounded border border-station-border/70 text-xs font-sans">
                  <span className="font-semibold text-station-ink block mb-0.5">
                    Active District Projects:
                  </span>
                  <span className="text-station-subtle">{p.active_projects}</span>
                </div>
              </div>

              {user?.role === 'manager' && (
                <div className="pt-3 border-t border-station-border/60 flex justify-end">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs text-accent-live hover:underline font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Partner</span>
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
                Add Partner / Donor Organisation
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
                  Organisation Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UNICEF Malawi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Partner Type
                </label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none capitalize"
                >
                  <option value="donor">Donor Organisation</option>
                  <option value="ngo">Non-Governmental Organisation (NGO)</option>
                  <option value="government">Government / Regulatory Agency</option>
                  <option value="corporate">Corporate Sponsor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Organisation Mission / Background *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of organisation role and support in Nsanje..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Active Projects & Catchment Areas *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specific programmes supported (e.g. WASH boreholes in Tengani, Nutrition screening in Marka)..."
                  value={activeProjects}
                  onChange={(e) => setActiveProjects(e.target.value)}
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
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
