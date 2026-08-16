'use client';

import React, { useEffect, useState } from 'react';
import { getPartners } from '@/lib/api-client';
import { Handshake, HeartHandshake, CheckCircle2, ShieldCheck, ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPartners();
        setPartners(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-community uppercase tracking-wider mb-2">
          <Handshake className="w-4 h-4" />
          <span>Community Development & Institutional Partnerships</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Current Projects & Donor Support
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Nyanthepa Community Radio partners with government programmes, international development agencies, and local NGOs to deliver community outreach across Nsanje District.
        </p>
      </div>

      {/* Impact Numbers Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-station-border shadow-sm text-center">
          <div className="font-display text-3xl font-bold text-accent-live">350,000+</div>
          <div className="text-xs text-station-subtle font-sans mt-1">Lower Shire Listeners</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-station-border shadow-sm text-center">
          <div className="font-display text-3xl font-bold text-accent-community">840+</div>
          <div className="text-xs text-station-subtle font-sans mt-1">Under-5 Children Reached</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-station-border shadow-sm text-center">
          <div className="font-display text-3xl font-bold text-accent-gold">14,000</div>
          <div className="text-xs text-station-subtle font-sans mt-1">Cotton Farmers Supported</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-station-border shadow-sm text-center">
          <div className="font-display text-3xl font-bold text-station-ink">2015</div>
          <div className="text-xs text-station-subtle font-sans mt-1">Year Established</div>
        </div>
      </div>

      {/* Partners List */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-station-ink border-b border-station-border pb-3">
          Institutional Partners & Programme Donors
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-station-subtle font-sans">
            Loading partner and project details...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-station-border rounded-lg p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-station-ink">
                        {p.name}
                      </h3>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-station-sand text-station-ink text-[11px] font-bold uppercase tracking-wider">
                        {p.partner_type}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-station-subtle font-sans leading-relaxed">
                    {p.description}
                  </p>

                  <div className="bg-station-sand/40 p-3.5 rounded border border-station-border/70 text-xs font-sans space-y-1">
                    <span className="font-bold text-station-ink block">
                      Active Community Interventions:
                    </span>
                    <p className="text-station-subtle leading-relaxed">{p.active_projects}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-station-border/60 text-xs font-sans flex items-center justify-between text-station-subtle">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-accent-live" />
                    <span>Nsanje District Catchment</span>
                  </span>
                  <span className="font-semibold text-accent-community">Verified Partner</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
