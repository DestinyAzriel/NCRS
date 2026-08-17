import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/providers/AccessibilityProvider';
import { ServiceWorkerRegister } from '@/components/providers/ServiceWorkerRegister';
import { AppShell } from '@/components/layout/AppShell';
import { Analytics } from '@vercel/analytics/next';

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
          <AppShell>
            {children}
          </AppShell>
          <Analytics />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
