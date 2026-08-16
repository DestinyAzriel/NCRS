'use client';

import React, { useEffect, useState } from 'react';
import { getSchedule, createScheduleSlot, updateScheduleSlot, deleteScheduleSlot, getStoredUser } from '@/lib/api-client';
import { Calendar, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, X, Clock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminSchedulePage() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:30');
  const [programName, setProgramName] = useState('');
  const [presenter, setPresenter] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Agriculture');
  const [language, setLanguage] = useState('Chisena / EN');

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await getSchedule();
      setSlots(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getStoredUser());
    fetchSlots();
  }, []);

  const filteredSlots = slots.filter((s) => s.day_of_week === selectedDay);

  const openCreateModal = () => {
    setEditingId(null);
    setStartTime('09:00');
    setEndTime('11:30');
    setProgramName('');
    setPresenter('');
    setDescription('');
    setCategory('General Broadcast');
    setLanguage('Chisena / EN');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (slot: any) => {
    setEditingId(slot.id);
    setStartTime(slot.start_time);
    setEndTime(slot.end_time);
    setProgramName(slot.program_name);
    setPresenter(slot.presenter);
    setDescription(slot.description);
    setCategory(slot.category);
    setLanguage(slot.language);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        day_of_week: selectedDay,
        start_time: startTime,
        end_time: endTime,
        program_name: programName,
        presenter,
        description,
        category,
        language,
        order: parseInt(startTime.replace(':', ''), 10),
      };

      if (editingId) {
        await updateScheduleSlot(editingId, payload);
        setSuccess('Schedule slot updated.');
      } else {
        await createScheduleSlot(payload);
        setSuccess('New schedule slot added.');
      }

      setModalOpen(false);
      fetchSlots();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save schedule slot');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this show from the schedule?')) return;
    try {
      await deleteScheduleSlot(id);
      setSuccess('Slot removed from schedule.');
      fetchSlots();
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
            Broadcast Schedule Timetable
          </h1>
          <p className="text-xs text-station-subtle font-sans mt-0.5">
            Manage the weekly 7-day program schedule rendered across the website timetable and mobile app.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-station-ink hover:bg-station-ink/90 text-white rounded text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Show to {selectedDay}</span>
        </button>
      </div>

      {success && (
        <div className="p-3 rounded bg-accent-community/10 border border-accent-community/30 text-xs text-accent-community font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Day Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-station-border pb-3">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const count = slots.filter((s) => s.day_of_week === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded text-xs font-sans font-semibold transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-station-ink text-white shadow-sm'
                  : 'bg-white border border-station-border text-station-ink hover:bg-station-sand'
              }`}
            >
              <span>{day}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-station-sand text-station-subtle'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-lg border border-station-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-station-sand/40 border-b border-station-border text-station-subtle font-semibold">
              <tr>
                <th className="py-3 px-4 w-36">Time Slot</th>
                <th className="py-3 px-4">Program & Description</th>
                <th className="py-3 px-4">Anchor / Presenters</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-station-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-station-subtle">
                    Loading timetable...
                  </td>
                </tr>
              ) : filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-station-subtle">
                    No shows scheduled for {selectedDay}. Click "Add Show" to schedule one.
                  </td>
                </tr>
              ) : (
                filteredSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-station-sand/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-accent-live">
                      {slot.start_time} - {slot.end_time}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-bold text-station-ink font-sans text-sm">
                        {slot.program_name}
                      </div>
                      <div className="text-[11px] text-station-subtle font-sans mt-0.5 line-clamp-2">
                        {slot.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-station-ink">
                      {slot.presenter}
                    </td>
                    <td className="py-3 px-4 font-sans text-station-subtle">
                      {slot.language}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-station-sand text-station-ink font-medium">
                        {slot.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(slot)}
                        className="p-1.5 rounded hover:bg-station-sand text-station-ink"
                        title="Edit slot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="p-1.5 rounded hover:bg-accent-live/10 text-accent-live"
                        title="Delete slot"
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
                {editingId ? 'Edit Schedule Slot' : `Add Show to ${selectedDay}`}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-station-subtle hover:text-station-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Start Time (24h) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="06:00"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    End Time (24h) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="09:00"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ulimi wa Patsogolo (Agricultural Clinic)"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Anchor / Presenter(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agnes Phiri (with District Ext. Officers)"
                  value={presenter}
                  onChange={(e) => setPresenter(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-station-ink mb-1">
                  Show Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Brief synopsis of topics covered during this slot..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                  >
                    <option value="Chisena">Chisena</option>
                    <option value="Chisena / EN">Chisena / EN</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-station-ink mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Agriculture"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-station-border rounded bg-station-bg outline-none"
                  />
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
                  {editingId ? 'Update Slot' : 'Save Show'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
