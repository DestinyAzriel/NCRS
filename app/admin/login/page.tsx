'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api-client';
import { Radio, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('manager@nyanthepa.mw');
  const [password, setPassword] = useState('Nyanthepa@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: any) {
      const msg = err.message || '';
      if (
        msg.toLowerCase().includes('fetch') ||
        msg.toLowerCase().includes('network') ||
        msg.toLowerCase().includes('failed to fetch') ||
        msg === 'Failed to fetch'
      ) {
        setError(
          'Cannot reach the CMS backend. The API server is not running or NEXT_PUBLIC_API_URL is not configured in Vercel. Please host the backend and set the environment variable.'
        );
      } else {
        setError(msg || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-station-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-station-ink rounded-lg flex items-center justify-center border-2 border-accent-gold shadow-md">
            <Radio className="w-8 h-8 text-accent-gold" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-display text-3xl font-bold tracking-tight text-station-ink">
          Nyanthepa Staff Portal
        </h2>
        <p className="mt-1 text-center text-xs font-sans text-station-subtle">
          107.6 FM CMS • Nsanje & Lower Shire Broadcast Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-station-border sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded bg-accent-live/10 border border-accent-live/30 flex items-start gap-2 text-xs text-accent-live font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-station-ink font-sans uppercase tracking-wider mb-1">
                Staff Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-station-subtle" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-station-border rounded bg-station-bg focus:ring-1 focus:ring-accent-live focus:border-accent-live outline-none"
                  placeholder="editor@nyanthepa.mw"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-station-ink font-sans uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-station-subtle" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-station-border rounded bg-station-bg focus:ring-1 focus:ring-accent-live focus:border-accent-live outline-none"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded shadow-sm text-sm font-semibold text-white bg-station-ink hover:bg-station-ink/90 focus:outline-none transition-colors disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to CMS'}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-station-border text-xs font-sans text-station-subtle space-y-2">
            <div className="font-semibold text-station-ink">Pre-configured Demo Accounts:</div>
            <div className="bg-station-sand/40 p-2.5 rounded border border-station-border/70 space-y-1">
              <div>
                <strong className="text-station-ink">Station Manager:</strong>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('manager@nyanthepa.mw');
                    setPassword('Nyanthepa@2026!');
                  }}
                  className="text-accent-live hover:underline font-mono"
                >
                  manager@nyanthepa.mw
                </button>
              </div>
              <div>
                <strong className="text-station-ink">News Editor:</strong>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('editor@nyanthepa.mw');
                    setPassword('Editor@1076');
                  }}
                  className="text-accent-live hover:underline font-mono"
                >
                  editor@nyanthepa.mw
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-station-subtle hover:text-station-ink font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Broadcast Site</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
