'use client';

import React, { useEffect, useState } from 'react';
import { getTeam } from '@/lib/api-client';
import { Radio, ShieldCheck, MapPin, Award, Users, Heart, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTeam();
        setTeam(data);
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
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-live uppercase tracking-wider mb-2">
          <Radio className="w-4 h-4" />
          <span>Our Broadcaster History & Identity</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          About Nyanthepa Community Radio
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Established in 2015 as the independent, grassroots broadcast voice of Nsanje District and the Lower Shire valley, Malawi.
        </p>
      </div>

      {/* Origin Story & Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6 text-sm text-station-ink font-sans leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-station-ink">
              Voice and Proximity in the River Valley
            </h2>
            <p>
              Nyanthepa Community Radio (107.6 FM) was founded in 2015 to fill a critical information gap in the southernmost district of Malawi. Located in the Shire river valley, Nsanje faces unique seasonal challenges — from agricultural dry spells to severe flash flooding along the riverbanks of Chiromo and Marka.
            </p>
            <p>
              Unlike national broadcasters headquartered in Blantyre or Lilongwe, Nyanthepa’s studios and transmitting antenna are based right in <strong>Nsanje Boma</strong>. Our programming is anchored primarily in <strong>Chisena</strong> alongside English and Chichewa, ensuring that elderly villagers, smallholder farmers, and youth hear their own languages, oral literature, and community concerns reflected on air.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-station-border">
            <h3 className="font-display text-xl font-bold text-station-ink">
              Our Community Broadcast Charter
            </h3>
            <ul className="space-y-2 text-xs text-station-subtle list-disc pl-5">
              <li>
                <strong className="text-station-ink">Early Flood & Disaster Warnings:</strong> Hourly water level bulletins and emergency preparedness advice in partnership with the Department of Disaster Management Affairs (DoDMA).
              </li>
              <li>
                <strong className="text-station-ink">Smallholder Agricultural Empowerment:</strong> Daily market prices from Bangula and Marka, cotton weighing clinic reports, and extension guidance.
              </li>
              <li>
                <strong className="text-station-ink">Sena Cultural Preservation:</strong> Recording traditional Nyau histories, folklore, and indigenous songs for community radio archives.
              </li>
              <li>
                <strong className="text-station-ink">Inclusion & Accountability:</strong> Dedicated broadcast platforms for women farmers, youth reporters, and persons with disabilities across all 9 traditional authorities.
              </li>
            </ul>
          </section>
        </div>

        {/* Transmission & Coverage Details Card */}
        <div className="lg:col-span-4 bg-white border border-station-border rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-accent-community border-b border-station-border pb-3">
            <MapPin className="w-5 h-5" />
            <h3 className="font-display text-base font-bold text-station-ink">
              Broadcast Transmission & Reach
            </h3>
          </div>

          <div className="space-y-2.5 text-xs font-sans text-station-subtle">
            <div>
              <strong className="text-station-ink block">Frequency:</strong>
              <span className="font-mono text-accent-live font-bold">107.6 MHz FM</span>
            </div>
            <div>
              <strong className="text-station-ink block">Transmitter Location:</strong>
              <span>Nsanje Boma Hilltop Mast</span>
            </div>
            <div>
              <strong className="text-station-ink block">Catchment Areas:</strong>
              <span>Nsanje Boma, Bangula, Tengani, Marka, Chiromo, Sorgin, Nyachilenda, and cross-border communities in Mozambique.</span>
            </div>
            <div>
              <strong className="text-station-ink block">Estimated Listenership:</strong>
              <span>Over 350,000 residents across the Lower Shire catchment.</span>
            </div>
          </div>

          <div className="p-3 rounded bg-station-sand/50 border border-station-border text-[11px] text-station-subtle flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-community shrink-0 mt-0.5" />
            <span>Regulated and licensed under the Malawi Communications Regulatory Authority (MACRA).</span>
          </div>
        </div>
      </div>

      {/* Station Team Directory */}
      <section className="space-y-6 pt-6 border-t border-station-border">
        <div>
          <span className="text-xs font-sans font-bold text-accent-live uppercase tracking-wider">
            Station Leadership & On-Air Personalities
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-station-ink mt-0.5">
            Meet the Nyanthepa Broadcast Team
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-station-subtle font-sans">
            Loading team profiles...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.id} className="bg-white border border-station-border rounded-lg p-6 shadow-sm space-y-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-station-ink">
                    {member.name}
                  </h3>
                  <div className="text-xs text-accent-community font-semibold font-sans">
                    {member.role}
                  </div>
                  {member.on_air_name && (
                    <div className="text-[11px] text-station-subtle font-mono mt-0.5">
                      On-Air: "{member.on_air_name}"
                    </div>
                  )}
                </div>
                <p className="text-xs text-station-subtle font-sans leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
