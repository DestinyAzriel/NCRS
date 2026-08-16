'use client';

import React from 'react';
import { FileText, ShieldCheck, Radio, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-community uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Broadcast & Audio Distribution Terms</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Terms of Use & Broadcast Copyright
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2">
          Guidelines governing the use of Nyanthepa Community Radio broadcasts, audio streams, and community journalism services.
        </p>
      </div>

      {/* Terms Body */}
      <div className="bg-white border border-station-border rounded-lg p-6 sm:p-8 shadow-sm space-y-6 text-xs sm:text-sm font-sans text-station-ink leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-station-ink">
            1. Broadcast Transmission & Re-use
          </h2>
          <p className="text-station-subtle">
            All audio transmissions, live stream broadcasts, and podcasts produced by Nyanthepa Community Radio (107.6 FM) are intended for the educational, cultural, and community benefit of residents across Nsanje District and the Lower Shire valley.
          </p>
          <p className="text-station-subtle">
            Non-commercial rebroadcasting in community centres, village gatherings, and educational institutions is encouraged. Commercial redistribution or recording for commercial re-sale requires prior written consent from station management.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-station-border">
          <h2 className="font-display text-lg font-bold text-station-ink">
            2. Intellectual Property & Takedown Protocol
          </h2>
          <p className="text-station-subtle">
            Nyanthepa respects the intellectual property rights of Malawian musical artists, authors, and community performers. If you believe any audio recording on our podcast library infringes your copyright, submit a formal takedown notice with proof of ownership to <strong>copyright@nyanthepa.mw</strong> or through our{' '}
            <Link href="/feedback" className="text-accent-live underline font-semibold">
              Complaints Channel
            </Link>. We resolve validated copyright claims within 48 hours.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-station-border">
          <h2 className="font-display text-lg font-bold text-station-ink">
            3. Regulatory Jurisdiction
          </h2>
          <p className="text-station-subtle">
            These terms are governed by the laws of Malawi, specifically the Malawi Communications Act, the Copyright Act of Malawi, and the regulations of the Malawi Communications Regulatory Authority (MACRA).
          </p>
        </section>
      </div>
    </div>
  );
}
