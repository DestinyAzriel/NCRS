'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { OnAirBar } from '@/components/layout/OnAirBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingAccessibility } from '@/components/ui/FloatingAccessibility';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Persistent Fixed On-Air Live Strip */}
      <OnAirBar />
      {/* Main Masthead and Navigation */}
      <Header />
      {/* Page Content Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {/* Broadcaster Regulatory Footer */}
      <Footer />
      {/* Floating Accessibility & Staff Portal Widget */}
      <FloatingAccessibility />
    </>
  );
}
