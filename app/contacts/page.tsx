'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, Radio, MessageSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ContactsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-live uppercase tracking-wider mb-2">
          <Phone className="w-4 h-4" />
          <span>Station Studios & Transmitters</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Contact Nyanthepa Community Radio
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2 max-w-2xl">
          Get in touch with our station management, news desk, sports reporters, or on-air studio lines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* On-Air Studio Lines */}
        <div className="bg-white border border-station-border rounded-lg p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-accent-live">
            <Radio className="w-5 h-5" />
            <h2 className="font-display text-lg font-bold text-station-ink">
              On-Air Studio & Phone-Ins
            </h2>
          </div>
          <p className="text-xs text-station-subtle font-sans leading-relaxed">
            Call into live broadcasts, participate in morning Shire discussions, or request songs during afternoon musical shows:
          </p>
          <div className="p-3 bg-station-sand/40 rounded border border-station-border/70 font-mono text-station-ink font-bold text-sm">
            +265 (0) 888 000 107
          </div>
          <div className="text-[11px] text-station-subtle font-sans">
            WhatsApp Studio: +265 (0) 999 107 600
          </div>
        </div>

        {/* News Desk & Editorial */}
        <div className="bg-white border border-station-border rounded-lg p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-accent-community">
            <Mail className="w-5 h-5" />
            <h2 className="font-display text-lg font-bold text-station-ink">
              News Desk & Bulletins
            </h2>
          </div>
          <p className="text-xs text-station-subtle font-sans leading-relaxed">
            Send community news leads, flood alerts, event notices, and press invitations directly to our journalists:
          </p>
          <div className="p-3 bg-station-sand/40 rounded border border-station-border/70 font-mono text-station-ink font-semibold text-xs">
            newsdesk@nyanthepa.mw
          </div>
          <div className="text-[11px] text-station-subtle font-sans">
            General Inquiries: info@nyanthepa.mw
          </div>
        </div>

        {/* Physical Studio Address */}
        <div className="bg-white border border-station-border rounded-lg p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-accent-gold">
            <MapPin className="w-5 h-5" />
            <h2 className="font-display text-lg font-bold text-station-ink">
              Physical Broadcast Studios
            </h2>
          </div>
          <p className="text-xs text-station-subtle font-sans leading-relaxed">
            Visitors, community delegates, and traditional leadership are welcome at our station complex:
          </p>
          <div className="p-3 bg-station-sand/40 rounded border border-station-border/70 text-xs font-sans text-station-ink leading-relaxed">
            Nyanthepa Community Radio House<br />
            Nsanje Boma Hill, Nsanje District<br />
            Southern Region, Malawi
          </div>
          <div className="text-[11px] text-station-subtle font-sans">
            Studio Hours: 05:00 - 23:00 Daily
          </div>
        </div>
      </div>

      {/* Compliance & Regulatory Direct Routing Box */}
      <div className="bg-station-sand/40 border border-station-border rounded-lg p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-accent-community">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="font-display text-base font-bold text-station-ink">
            Complaints & Regulatory Dispute Resolution
          </h3>
        </div>
        <p className="text-xs text-station-subtle font-sans leading-relaxed max-w-3xl">
          For formal complaints regarding on-air broadcasts, news inaccuracies, or advertising concerns, please use our dedicated complaints portal. Unresolved matters can be escalated to the Malawi Communications Regulatory Authority (MACRA) or the Media Council of Malawi.
        </p>
        <div className="pt-1">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1 text-xs font-bold text-accent-live underline font-sans"
          >
            <span>Open Feedback & Complaints Channel →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
