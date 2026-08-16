'use client';

import React from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { Eye, Type, Globe } from 'lucide-react';

export function AccessibilityControls() {
  const { textSize, cycleTextSize, highContrast, toggleHighContrast, language, toggleLanguage } =
    useAccessibility();

  const textSizeLabels = {
    normal: 'A',
    large: 'A+',
    xlarge: 'A++',
  };

  return (
    <div className="flex items-center gap-2 text-xs font-sans">
      {/* Language Switcher */}
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1 px-2.5 py-1 rounded border border-station-ink/20 hover:border-accent-live bg-white text-station-ink transition-colors font-medium shadow-sm"
        title="Toggle English / ChiSena"
        aria-label="Toggle language between English and ChiSena"
      >
        <Globe className="w-3.5 h-3.5 text-accent-community" />
        <span className="font-semibold">{language === 'en' ? 'EN / Chisena' : 'Chisena / EN'}</span>
      </button>

      {/* Font Size Scaler */}
      <button
        onClick={cycleTextSize}
        className="flex items-center gap-1 px-2.5 py-1 rounded border border-station-ink/20 hover:border-accent-live bg-white text-station-ink transition-colors font-medium shadow-sm"
        title={`Text Size: ${textSize.toUpperCase()} (Click to cycle)`}
        aria-label={`Current text size ${textSize}. Click to change.`}
      >
        <Type className="w-3.5 h-3.5 text-accent-gold" />
        <span className="font-bold tracking-tight">{textSizeLabels[textSize]}</span>
      </button>

      {/* High Contrast Toggle */}
      <button
        onClick={toggleHighContrast}
        className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors shadow-sm ${
          highContrast
            ? 'bg-station-ink text-station-bg border-station-ink font-bold'
            : 'border-station-ink/20 hover:border-accent-live bg-white text-station-ink font-medium'
        }`}
        title="Toggle High Contrast Mode"
        aria-pressed={highContrast}
        aria-label="Toggle high contrast display"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>{highContrast ? 'High Contrast: ON' : 'Contrast'}</span>
      </button>
    </div>
  );
}
