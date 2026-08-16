'use client';

import React, { useEffect, useState } from 'react';
import { getSports } from '@/lib/api-client';
import { Trophy, Calendar, Radio, Info } from 'lucide-react';
import Link from 'next/link';

export default function SportsPage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('local_nsanje');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSports();
        setLeagues(data);
        if (data.length > 0 && !data.some((l: any) => l.league_key === activeTab)) {
          setActiveTab(data[0].league_key);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeTab]);

  const activeLeague = leagues.find((l) => l.league_key === activeTab) || leagues[0];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-community uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4" />
          <span>Broadcast Sports Desk • 107.6 FM</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Football Log Tables & Standings
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Official match standings updated following every matchday broadcast. Covering grassroots Nsanje District League, national FDH Premiership, and the English Premier League.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-station-border pb-3">
        {leagues.map((league) => (
          <button
            key={league.league_key}
            onClick={() => setActiveTab(league.league_key)}
            className={`px-4 py-2 rounded text-xs font-sans font-bold transition-colors ${
              activeTab === league.league_key
                ? 'bg-station-ink text-white shadow-sm'
                : 'bg-white border border-station-border text-station-ink hover:bg-station-sand'
            }`}
          >
            {league.league_name}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-station-border shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-station-border pb-3">
          <div>
            <h2 className="font-display text-xl font-bold text-station-ink">
              {activeLeague?.league_name}
            </h2>
            <div className="text-xs text-station-subtle font-sans mt-0.5">
              Official season: <span className="font-mono font-bold text-station-ink">{activeLeague?.season}</span> • Updated weekly on Nyanthepa Sport
            </div>
          </div>
          <div className="text-xs font-sans text-station-subtle">
            Tune in Mondays 14:00 for full match commentary.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs league-table">
            <thead>
              <tr className="bg-station-sand/50 border-b border-station-border font-sans font-semibold text-station-subtle">
                <th className="py-3 px-4 w-12 text-center">POS</th>
                <th className="py-3 px-4">CLUB / TEAM</th>
                <th className="py-3 px-3 text-center w-16">P</th>
                <th className="py-3 px-3 text-center w-16">W</th>
                <th className="py-3 px-3 text-center w-16">D</th>
                <th className="py-3 px-3 text-center w-16">L</th>
                <th className="py-3 px-3 text-center w-16">GD</th>
                <th className="py-3 px-4 text-center w-20 font-bold">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-station-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-station-subtle font-sans">
                    Loading standings from station database...
                  </td>
                </tr>
              ) : !activeLeague?.standings_data?.length ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-station-subtle font-sans">
                    No league fixtures or standings posted yet this season.
                  </td>
                </tr>
              ) : (
                activeLeague.standings_data.map((row: any, idx: number) => {
                  const isLeader = idx === 0;
                  return (
                    <tr
                      key={row.team}
                      className={isLeader ? 'bg-accent-community/5 font-semibold' : 'hover:bg-station-sand/20'}
                    >
                      <td className="py-3 px-4 text-center font-bold font-mono text-station-ink">
                        {row.pos}
                      </td>
                      <td className="py-3 px-4 font-sans font-bold text-station-ink text-sm">
                        {row.team}
                        {isLeader && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent-community text-white uppercase font-sans">
                            Leader
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">{row.played}</td>
                      <td className="py-3 px-3 text-center font-mono text-accent-community font-bold">{row.won}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.drawn}</td>
                      <td className="py-3 px-3 text-center font-mono text-accent-live">{row.lost}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-station-ink bg-station-sand/30">
                        {row.points}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs font-sans text-station-subtle">
          <Info className="w-4 h-4 text-accent-community shrink-0" />
          <span>P = Played, W = Won, D = Drawn, L = Lost, GD = Goal Difference, PTS = Points (3 pts for win, 1 pt for draw).</span>
        </div>
      </div>
    </div>
  );
}
