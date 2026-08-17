'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getStoredUser, clearToken } from '@/lib/api-client';
import {
  LayoutDashboard, Newspaper, Calendar, Headphones, Trophy,
  MessageSquare, Users, Handshake, LogOut, Radio, ChevronRight,
  Settings
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['editor', 'manager'] },
  { label: 'News & Bulletins', href: '/admin/news', icon: Newspaper, roles: ['editor', 'manager'], help: 'Publish and edit all news stories' },
  { label: 'Broadcast Schedule', href: '/admin/schedule', icon: Calendar, roles: ['editor', 'manager'], help: 'Manage weekly timetable' },
  { label: 'Podcasts & Audio', href: '/admin/podcasts', icon: Headphones, roles: ['editor', 'manager'], help: 'Upload and manage podcasts' },
  { label: 'Sports Log Tables', href: '/admin/sports', icon: Trophy, roles: ['editor', 'manager'], help: 'Update league standings' },
  { label: 'Feedback Inbox', href: '/admin/feedback', icon: MessageSquare, roles: ['editor', 'manager'], help: 'Read-only complaints and feedback' },
  { label: 'Station Team', href: '/admin/team', icon: Users, roles: ['manager'], help: 'Manager only — add/remove staff profiles' },
  { label: 'Partners & Donors', href: '/admin/partners', icon: Handshake, roles: ['manager'], help: 'Manager only — manage institutional partners' },
  { label: 'Station Settings', href: '/admin/settings', icon: Settings, roles: ['manager'], help: 'Manager only — stream URL, on-air override, advisory' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    const u = getStoredUser();
    if (!u) {
      router.push('/admin/login');
    } else {
      setUser(u);
    }
  }, [router, pathname, isLoginPage]);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const filteredNav = NAV.filter(item => user && item.roles.includes(user.role));

  if (!user) {
    return (
      <div className="min-h-screen bg-station-bg flex items-center justify-center">
        <div className="text-station-subtle font-sans text-sm">Verifying session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-station-muted">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-200 bg-station-ink text-station-bg flex flex-col shrink-0`}>
        {/* Brand */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-live rounded flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-display text-sm font-bold text-white leading-tight">Nyanthepa 107.6 FM</div>
              <div className="text-[10px] text-white/50 font-sans">Staff Management Portal</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {filteredNav.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-sans font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-live/20 text-white border-r-2 border-accent-live'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent-live' : ''}`} />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && isActive && <ChevronRight className="w-3 h-3 ml-auto text-accent-live" />}
              </Link>
            );
          })}
        </nav>

        {/* User & logout */}
        <div className="p-3 border-t border-white/10">
          {sidebarOpen && (
            <div className="mb-2 px-1">
              <div className="text-xs text-white/80 font-semibold font-sans truncate">{user.full_name}</div>
              <div className={`text-[10px] font-sans px-1.5 py-0.5 rounded inline-block mt-0.5 ${user.role === 'manager' ? 'bg-accent-gold/20 text-accent-gold' : 'bg-accent-community/20 text-accent-community'}`}>
                {user.role.toUpperCase()}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-sans px-2 py-1.5 rounded hover:bg-white/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-station-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-station-subtle hover:text-station-ink p-1 rounded"
              title="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-xs font-sans text-station-subtle">
              Nyanthepa Community Radio — Staff Administration
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-sans text-accent-live hover:underline"
          >
            View Public Site →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
