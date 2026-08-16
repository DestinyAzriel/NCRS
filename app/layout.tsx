import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/providers/AccessibilityProvider';
import { ServiceWorkerRegister } from '@/components/providers/ServiceWorkerRegister';
import { OnAirBar } from '@/components/layout/OnAirBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingAccessibility } from '@/components/ui/FloatingAccessibility';

export const metadata: Metadata = {
  title: 'Nyanthepa Community Radio 107.6 FM | Nsanje & Lower Shire',
  description:
    'Live broadcast, local news, agriculture bulletins, flood warnings, sports log tables, and cultural podcasts from Nyanthepa Community Radio 107.6 FM in Nsanje District, Malawi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-text-size="normal">
      <body className="flex flex-col min-h-screen">
        <AccessibilityProvider>
          <ServiceWorkerRegister />
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
        </AccessibilityProvider>
      </body>
    </html>
  );
}
