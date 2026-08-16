'use client';

import React, { useEffect, useState } from 'react';
import { getSchedule } from '@/lib/api-client';
import { Calendar, Clock, Radio, Search, Filter } from 'lucide-react';
import Link from 'next/link';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProgramsPage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSchedule();
        setSchedule(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(schedule.map((s) => s.category).filter(Boolean)))];

  const filteredSlots = schedule.filter((slot) => {
    const matchDay = slot.day_of_week === selectedDay;
    const matchCat = selectedCategory === 'all' || slot.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      slot.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.presenter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDay && matchCat && matchSearch;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-community uppercase tracking-wider mb-2">
          <Calendar className="w-4 h-4" />
          <span>7-Day Broadcast Grid • 107.6 MHz FM</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Programming & Anchoring Schedules
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Comprehensive weekly timetable for Nyanthepa Community Radio. Find agricultural clinics, flood advisories, cultural dialogues, and grassroots sports commentary.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-station-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Day Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded text-xs font-sans font-semibold transition-colors ${
                selectedDay === day
                  ? 'bg-station-ink text-white shadow-sm'
                  : 'bg-station-sand/50 text-station-ink hover:bg-station-sand'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Search and Category Filter */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-station-subtle" />
            <input
              type="text"
              placeholder="Search show or anchor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-station-border rounded bg-station-bg outline-none w-44 font-sans text-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1.5 border border-station-border rounded bg-station-bg outline-none font-sans text-xs"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Monospace Timetable Schedule */}
      <div className="bg-white rounded-lg border border-station-border shadow-sm overflow-hidden">
        <div className="p-4 bg-station-sand/40 border-b border-station-border flex items-center justify-between">
          <span className="font-display font-bold text-station-ink text-base">
            {selectedDay}'s Broadcast Schedule
          </span>
          <span className="text-xs font-mono text-station-subtle">
            {filteredSlots.length} Shows Programmed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-station-border font-sans font-semibold text-station-subtle bg-station-muted/40">
                <th className="py-3 px-4 w-36">Transmission Hours</th>
                <th className="py-3 px-4">Program Name & Synopsis</th>
                <th className="py-3 px-4 w-52">Anchor / Presenter(s)</th>
                <th className="py-3 px-4 w-32">Language</th>
                <th className="py-3 px-4 w-36">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-station-border/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-station-subtle font-sans">
                    Loading timetable from station database...
                  </td>
                </tr>
              ) : filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-station-subtle font-sans">
                    No matching broadcast shows found for {selectedDay}.
                  </td>
                </tr>
              ) : (
                filteredSlots.map((slot, idx) => (
                  <tr key={slot.id || idx} className="hover:bg-station-sand/20 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-accent-live">
                      {slot.start_time} - {slot.end_time}
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <div className="font-display font-bold text-station-ink text-base">
                        {slot.program_name}
                      </div>
                      <p className="text-xs text-station-subtle font-sans leading-relaxed mt-1">
                        {slot.description}
                      </p>
                    </td>
                    <td className="py-4 px-4 font-sans font-medium text-station-ink">
                      {slot.presenter}
                    </td>
                    <td className="py-4 px-4 font-sans text-station-subtle">
                      <span className="px-2 py-0.5 rounded bg-station-sand text-station-ink text-[11px] font-medium">
                        {slot.language}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-station-sand/80 text-station-ink text-[11px]">
                        {slot.category}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
