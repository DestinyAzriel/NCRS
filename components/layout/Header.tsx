'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccessibilityControls } from '@/components/ui/AccessibilityControls';
import { Menu, X, Radio, Volume2, ShieldCheck, Lock } from 'lucide-react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Live Studio', href: '/live' },
  { label: 'Programs', href: '/programs' },
  { label: 'News & Bulletins', href: '/news' },
  { label: 'Podcasts & Music', href: '/podcasts' },
  { label: 'Sports', href: '/sports' },
  { label: 'Projects & Donors', href: '/projects' },
  { label: 'About Station', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useAccessibility();

  return (
    <header className="bg-station-bg border-b border-station-border shadow-sm">
      {/* 1. Masthead Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Station Identity Masthead */}
          <Link href="/" className="group flex items-center gap-3.5 shrink-0">
            <div className="w-12 h-12 rounded-lg bg-station-ink flex items-center justify-center text-station-bg border-2 border-accent-gold shadow group-hover:border-accent-live transition-colors">
              <Radio className="w-6 h-6 text-accent-gold" />
            </div>
            <div>
              <span className="block font-display text-2xl sm:text-3xl font-bold tracking-tight text-station-ink leading-tight group-hover:text-accent-live transition-colors">
                Nyanthepa Community Radio
              </span>
              <span className="block text-xs font-sans font-semibold text-accent-live tracking-wider uppercase mt-0.5">
                107.6 MHz FM • Voice of Nsanje & Lower Shire
              </span>
            </div>
          </Link>



          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded border border-station-border bg-white text-station-ink focus:outline-none focus:ring-2 focus:ring-accent-live shadow-sm"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dedicated Full-Width Navigation Strip (Clean single-line desktop bar) */}
      <div className="hidden lg:block border-t border-station-border/70 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-1 overflow-x-auto py-0 text-xs font-sans font-semibold">
            <div className="flex items-center gap-1 sm:gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap px-3.5 py-3 border-b-2 transition-all text-xs font-medium tracking-tight ${
                      isActive
                        ? 'border-accent-live text-accent-live font-bold bg-accent-live/5'
                        : 'border-transparent text-station-ink hover:text-accent-live hover:border-accent-live/30 hover:bg-station-sand/40'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Quick Live Listening Pill on the right */}
            <Link
              href="/live"
              className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 bg-station-ink hover:bg-station-ink/90 text-white rounded text-[11px] font-bold tracking-wide shadow-sm transition-colors shrink-0 my-2"
            >
              <span className="w-2 h-2 rounded-full bg-accent-live animate-live-pulse" />
              <span>107.6 FM STUDIO</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-station-border bg-white px-4 py-4 space-y-3">
          <nav className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded text-xs font-medium text-center transition-colors ${
                    isActive
                      ? 'bg-station-ink text-white font-bold'
                      : 'bg-station-sand/50 text-station-ink hover:bg-station-sand'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>


        </div>
      )}
    </header>
  );
}
