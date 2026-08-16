'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import {
  Accessibility, Globe, Type, Eye, Lock, X, ChevronUp,
} from 'lucide-react';

export function FloatingAccessibility() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    textSize, cycleTextSize,
    highContrast, toggleHighContrast,
    language, toggleLanguage,
  } = useAccessibility();

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      role="region"
      aria-label="Accessibility options"
    >
      {/* Expanded Panel */}
      {open && (
        <div className="bg-station-ink/95 backdrop-blur-sm border border-station-bg/10 rounded-xl shadow-2xl w-56 p-4 flex flex-col gap-3">
          {/* Panel header */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-display font-bold text-accent-gold uppercase tracking-wider">
              Accessibility
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-station-bg/40 hover:text-station-bg transition-colors"
              aria-label="Close accessibility panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-sans text-station-bg/40 uppercase tracking-widest">Language</span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-station-bg/10 hover:bg-accent-community/20 border border-station-bg/10 hover:border-accent-community/40 text-station-bg text-xs font-medium transition-all"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-accent-community shrink-0" />
              <span>{language === 'en' ? 'English / Chisena' : 'Chisena / English'}</span>
            </button>
          </div>

          {/* Text Size */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-sans text-station-bg/40 uppercase tracking-widest">Text Size</span>
            <div className="grid grid-cols-3 gap-1">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={cycleTextSize}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    textSize === size
                      ? 'bg-accent-gold text-station-ink border-accent-gold'
                      : 'bg-station-bg/10 text-station-bg/60 border-station-bg/10 hover:bg-station-bg/20'
                  }`}
                  aria-pressed={textSize === size}
                  aria-label={`Text size ${size}`}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-sans text-station-bg/40 uppercase tracking-widest">Display</span>
            <button
              onClick={toggleHighContrast}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                highContrast
                  ? 'bg-white text-station-ink border-white font-bold'
                  : 'bg-station-bg/10 text-station-bg/80 border-station-bg/10 hover:bg-station-bg/20'
              }`}
              aria-pressed={highContrast}
              aria-label="Toggle high contrast"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>{highContrast ? 'High Contrast: ON' : 'High Contrast: OFF'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-station-bg/10" />

          {/* Staff Portal */}
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-live/10 hover:bg-accent-live/20 border border-accent-live/20 hover:border-accent-live/50 text-accent-live text-xs font-semibold transition-all"
            title="Staff Management CMS"
            onClick={() => setOpen(false)}
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Staff Portal</span>
          </Link>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 border-2 ${
          open
            ? 'bg-accent-gold border-accent-gold text-station-ink'
            : 'bg-station-ink border-accent-gold/60 hover:border-accent-gold text-accent-gold hover:scale-110'
        }`}
        aria-label={open ? 'Close accessibility panel' : 'Open accessibility panel'}
        aria-expanded={open}
      >
        {open
          ? <ChevronUp className="w-5 h-5" />
          : <Accessibility className="w-5 h-5" />
        }
      </button>
    </div>
  );
}
