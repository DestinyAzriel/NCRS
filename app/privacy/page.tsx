'use client';

import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Database, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-station-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-accent-community uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Compliance • Data Protection Act 2024</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-station-ink">
          Privacy Policy & Listener Data Protection
        </h1>
        <p className="text-sm text-station-subtle font-sans mt-2">
          Plain-language disclosure of what information Nyanthepa Community Radio collects, why we collect it, and how your privacy rights are protected under Malawi law.
        </p>
      </div>

      {/* Main Privacy Text */}
      <div className="bg-white border border-station-border rounded-lg p-6 sm:p-8 shadow-sm space-y-8 text-xs sm:text-sm font-sans text-station-ink leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-station-ink">
            <Database className="w-5 h-5 text-accent-live" />
            <h2 className="font-display text-lg sm:text-xl font-bold">
              1. Compliance with the Data Protection Act 2024
            </h2>
          </div>
          <p className="text-station-subtle">
            Nyanthepa Community Radio (107.6 FM), operating in Nsanje District, Malawi, processes personal data in full compliance with the <strong>Data Protection Act 2024</strong> (Act No. 1 of 2024) and the regulatory framework administered by the Malawi Communications Regulatory Authority (MACRA).
          </p>
          <p className="text-station-subtle">
            We operate on the principle of data minimization: we only collect the minimum personal information required to deliver broadcast services, respond to listener feedback, and broadcast community notices.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 pt-4 border-t border-station-border">
          <div className="flex items-center gap-2 text-station-ink">
            <Eye className="w-5 h-5 text-accent-community" />
            <h2 className="font-display text-lg sm:text-xl font-bold">
              2. Information Collected via Website & Mobile App
            </h2>
          </div>
          <p className="text-station-subtle">When you use our public digital platforms, the following information may be processed:</p>
          <ul className="list-disc pl-5 space-y-2 text-station-subtle">
            <li>
              <strong>Listener Feedback & Complaints Form:</strong> Submitting a message collects your message content, timestamp, and category. Providing your name and telephone number/email is entirely <em>optional</em> and is used solely to reply to your inquiry.
            </li>
            <li>
              <strong>Live Studio Shoutouts:</strong> Sender name and location (e.g. "Tengani") are displayed to on-air presenters during live radio shows.
            </li>
            <li>
              <strong>Accessibility & Device Preferences:</strong> Language toggle (English/Chisena), text scaling size, and high-contrast preferences are stored locally on your device (via browser localStorage or mobile shared preferences) and are never transmitted to our remote servers.
            </li>
            <li>
              <strong>Stream Consumption:</strong> Anonymous bandwidth analytics (e.g. concurrent stream listeners) to optimize audio delivery over 2G/3G connections in the Lower Shire.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 pt-4 border-t border-station-border">
          <div className="flex items-center gap-2 text-station-ink">
            <Clock className="w-5 h-5 text-accent-gold" />
            <h2 className="font-display text-lg sm:text-xl font-bold">
              3. Data Retention and Deletion
            </h2>
          </div>
          <p className="text-station-subtle">
            General listener feedback and song requests are retained for a maximum of <strong>90 calendar days</strong>, after which they are purged from the station management inbox. Formal editorial complaints subject to Media Council of Malawi or MACRA review are retained securely for <strong>12 months</strong> for statutory inspection.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 pt-4 border-t border-station-border">
          <div className="flex items-center gap-2 text-station-ink">
            <Lock className="w-5 h-5 text-accent-live" />
            <h2 className="font-display text-lg sm:text-xl font-bold">
              4. Your Rights Under Malawi Law
            </h2>
          </div>
          <p className="text-station-subtle">
            Under the Data Protection Act 2024, you have the right to request access to personal data we hold about you, request the correction of inaccurate information, or request the deletion of your contact records from our systems.
          </p>
          <p className="text-station-subtle">
            To exercise your data protection rights, please contact our Station Data Protection Officer at <strong>privacy@nyanthepa.mw</strong> or visit our studios at Nsanje Boma.
          </p>
        </section>
      </div>
    </div>
  );
}
