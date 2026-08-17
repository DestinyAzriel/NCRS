'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, ShieldCheck, Mail, Phone, MapPin, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-station-ink text-station-bg border-t-4 border-accent-live pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-station-bg/10">
          {/* Col 1: Station Identity */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-5 h-5 text-accent-gold" />
              <h3 className="font-display text-xl font-bold text-station-bg">
                Nyanthepa 107.6 FM
              </h3>
            </div>
            <p className="text-xs text-station-bg/70 leading-relaxed mb-4 font-sans">
              The trusted community broadcast voice of Nsanje District and the Lower Shire valley, Malawi. Serving our communities in Chisena and English since 2015.
            </p>
            <div className="text-xs font-mono text-accent-gold bg-station-bg/5 p-2.5 rounded border border-station-bg/10">
              Frequency: 107.6 MHz FM<br />
              Transmitter: Nsanje Boma
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-station-bg uppercase tracking-wider mb-4 border-l-2 border-accent-gold pl-2">
              Broadcast Sections
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/programs" className="text-station-bg/80 hover:text-accent-gold transition-colors">
                  Program Schedule & Timetable
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-station-bg/80 hover:text-accent-gold transition-colors">
                  Nsanje & Shire Valley News
                </Link>
              </li>
              <li>
                <Link href="/podcasts" className="text-station-bg/80 hover:text-accent-gold transition-colors">
                  Podcasts & Cultural Audio Archives
                </Link>
              </li>
              <li>
                <Link href="/sports" className="text-station-bg/80 hover:text-accent-gold transition-colors">
                  Sports Log Tables (FDH & District)
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-station-bg/80 hover:text-accent-gold transition-colors">
                  Community Development & Donors
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div>
            <h4 className="font-display text-sm font-bold text-station-bg uppercase tracking-wider mb-4 border-l-2 border-accent-community pl-2">
              Regulatory & Ethical
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/feedback" className="inline-flex items-center gap-1.5 text-accent-gold hover:text-white font-semibold transition-colors">
                  <span>Feedback &amp; Complaints</span>
                  <span className="text-[10px]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-station-bg/80 hover:text-accent-gold transition-colors">
                  Privacy Policy (Data Protection Act 2024)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-station-bg/80 hover:text-accent-gold transition-colors">
                  Terms of Broadcast & Audio Copyright
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-station-bg/80 hover:text-accent-gold transition-colors">
                  Editorial Charter & Board of Trustees
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-station-bg/60 hover:text-accent-gold transition-colors inline-flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-accent-gold" />
                  <span>Staff Portal (CMS)</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 p-2 bg-station-bg/5 rounded text-[11px] text-station-bg/60 border border-station-bg/10 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-community shrink-0 mt-0.5" />
              <span>Licensed by MACRA. Compliant with Media Council of Malawi Code of Ethics.</span>
            </div>
          </div>

          {/* Col 4: Contact & Studio */}
          <div>
            <h4 className="font-display text-sm font-bold text-station-bg uppercase tracking-wider mb-4 border-l-2 border-accent-live pl-2">
              Studio & Transmissions
            </h4>
            <ul className="space-y-2 text-xs text-station-bg/80 font-sans">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-live shrink-0 mt-0.5" />
                <span>Nyanthepa Studios, Nsanje Boma, Southern Region, Malawi</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-gold shrink-0" />
                <span>On-Air Studio: +265 (0) 888 000 107</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-gold shrink-0" />
                <span>info@nyanthepa.mw</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar: copyright + regulatory note */}
        <div className="pt-6 border-t border-station-bg/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-station-bg/50 font-mono">
            &copy; {new Date().getFullYear()} Nyanthepa Community Radio (107.6 FM). All rights reserved.
          </p>
          <p className="text-xs text-station-bg/40 font-mono text-center md:text-right">
            Independent Community Broadcaster &bull; Regulated under Malawi Communications Act
          </p>
        </div>
      </div>
    </footer>
  );
}
