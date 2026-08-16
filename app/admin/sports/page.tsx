'use client';

import React, { useEffect, useState } from 'react';
import { getSports, updateLeague } from '@/lib/api-client';
import { Trophy, CheckCircle2, AlertCircle, Save, Plus, Trash2 } from 'lucide-react';

export default function AdminSportsPage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [selectedLeagueKey, setSelectedLeagueKey] = useState('local_nsanje');
  const [currentLeague, setCurrentLeague] = useState<any>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const data = await getSports();
      setLeagues(data);
      const sel = data.find((l: any) => l.league_key === selectedLeagueKey) || data[0];
      if (sel) {
        setSelectedLeagueKey(sel.league_key);
        setCurrentLeague(sel);
        setStandings(sel.standings_data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleLeagueChange = (key: string) => {
    setSelectedLeagueKey(key);
    const sel = leagues.find((l) => l.league_key === key);
    if (sel) {
      setCurrentLeague(sel);
      setStandings(sel.standings_data || []);
    }
  };

  const handleRowChange = (index: number, field: string, val: any) => {
    const updated = [...standings];
    updated[index] = {
      ...updated[index],
      [field]: field === 'team' ? val : parseInt(val, 10) || 0,
    };
    // Calculate points if needed: W*3 + D
    if (['won', 'drawn'].includes(field)) {
      const w = field === 'won' ? parseInt(val, 10) || 0 : updated[index].won;
      const d = field === 'drawn' ? parseInt(val, 10) || 0 : updated[index].drawn;
      updated[index].points = w * 3 + d;
    }
    setStandings(updated);
  };

  const handleAddTeam = () => {
    const newPos = standings.length + 1;
    setStandings([
      ...standings,
      {
        pos: newPos,
        team: 'New Club FC',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gd: 0,
        points: 0,
      },
    ]);
  };

  const handleRemoveTeam = (index: number) => {
    const updated = standings.filter((_, i) => i !== index).map((row, idx) => ({
      ...row,
      pos: idx + 1,
    }));
    setStandings(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Sort by points desc, gd desc
      const sorted = [...standings].sort((a, b) => b.points - a.points || b.gd - a.gd).map((r, i) => ({
        ...r,
        pos: i + 1,
      }));

      await updateLeague(selectedLeagueKey, {
        league_name: currentLeague.league_name,
        season: currentLeague.season,
        standings_data: sorted,
      });

      setStandings(sorted);
      setSuccess(`${currentLeague.league_name} standings saved and reordered successfully!`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save league table');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-station-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-station-ink">
            Sports Log Tables Manager
          </h1>
          <p className="text-xs text-station-subtle font-sans mt-0.5">
            Update match results and standings for Nsanje District League, FDH Premiership, and the EPL.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-accent-community hover:bg-accent-community/90 text-white rounded text-xs font-bold shadow transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish Standings'}</span>
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-station-border pb-3">
        {leagues.map((l) => (
          <button
            key={l.league_key}
            onClick={() => handleLeagueChange(l.league_key)}
            className={`px-4 py-2 rounded text-xs font-sans font-bold transition-colors ${
              selectedLeagueKey === l.league_key
                ? 'bg-station-ink text-white shadow-sm'
                : 'bg-white border border-station-border text-station-ink hover:bg-station-sand'
            }`}
          >
            {l.league_name}
          </button>
        ))}
      </div>

      {/* Table Editor */}
      <div className="bg-white rounded-lg border border-station-border shadow-sm overflow-hidden p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-sans text-station-subtle">
            Editing season: <strong>{currentLeague?.season}</strong> • Rows automatically sort by Points & Goal Difference on save.
          </div>
          <button
            onClick={handleAddTeam}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-station-sand hover:bg-station-sand/80 text-station-ink rounded text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Team Row</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs league-table">
            <thead className="bg-station-sand/50 border-b border-station-border font-sans font-semibold text-station-subtle">
              <tr>
                <th className="py-2.5 px-3 w-10">Pos</th>
                <th className="py-2.5 px-3">Team Name</th>
                <th className="py-2.5 px-2 text-center w-16">P (Played)</th>
                <th className="py-2.5 px-2 text-center w-16">W (Won)</th>
                <th className="py-2.5 px-2 text-center w-16">D (Drawn)</th>
                <th className="py-2.5 px-2 text-center w-16">L (Lost)</th>
                <th className="py-2.5 px-2 text-center w-16">GD</th>
                <th className="py-2.5 px-2 text-center w-16 font-bold">PTS</th>
                <th className="py-2.5 px-2 text-right w-12">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-station-border/60">
              {standings.map((row, idx) => (
                <tr key={idx} className="hover:bg-station-sand/20">
                  <td className="py-2 px-3 font-bold font-mono text-station-subtle">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={row.team}
                      onChange={(e) => handleRowChange(idx, 'team', e.target.value)}
                      className="w-full p-1 border border-station-border rounded bg-station-bg font-sans font-semibold text-station-ink text-xs outline-none"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={row.played}
                      onChange={(e) => handleRowChange(idx, 'played', e.target.value)}
                      className="w-12 text-center p-1 border border-station-border rounded bg-station-bg font-mono text-xs outline-none"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={row.won}
                      onChange={(e) => handleRowChange(idx, 'won', e.target.value)}
                      className="w-12 text-center p-1 border border-station-border rounded bg-station-bg font-mono text-xs outline-none"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={row.drawn}
                      onChange={(e) => handleRowChange(idx, 'drawn', e.target.value)}
                      className="w-12 text-center p-1 border border-station-border rounded bg-station-bg font-mono text-xs outline-none"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={row.lost}
                      onChange={(e) => handleRowChange(idx, 'lost', e.target.value)}
                      className="w-12 text-center p-1 border border-station-border rounded bg-station-bg font-mono text-xs outline-none"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={row.gd}
                      onChange={(e) => handleRowChange(idx, 'gd', e.target.value)}
                      className="w-12 text-center p-1 border border-station-border rounded bg-station-bg font-mono text-xs outline-none"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      value={row.points}
                      onChange={(e) => handleRowChange(idx, 'points', e.target.value)}
                      className="w-12 text-center p-1 border border-station-border rounded bg-accent-gold/20 font-mono font-bold text-station-ink text-xs outline-none"
                    />
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => handleRemoveTeam(idx)}
                      className="p-1 text-station-subtle hover:text-accent-live"
                      title="Remove team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
