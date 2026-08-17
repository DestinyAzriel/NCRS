'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getStoredUser, clearToken } from '@/lib/api-client';
import {
  LayoutDashboard, Newspaper, Calendar, Headphones, Trophy,
  MessageSquare, Users, Handshake, LogOut, Radio, ChevronRight,
  Settings, Menu, X
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

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
    <div className="min-h-screen flex bg-station-muted w-full overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Off-Canvas Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-station-ink text-station-bg flex flex-col transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-live rounded flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-white leading-tight">Nyanthepa 107.6 FM</div>
              <div className="text-[10px] text-white/50 font-sans">Staff Management Portal</div>
            </div>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 text-white/60 hover:text-white rounded hover:bg-white/10"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-1">
          {filteredNav.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-sans font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-live text-white font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-accent-gold'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white" />}
              </Link>
            );
          })}
        </nav>

        {/* User profile & logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="mb-3">
            <div className="text-xs text-white font-semibold font-sans">{user.full_name}</div>
            <div className={`text-[10px] font-sans px-1.5 py-0.5 rounded inline-block mt-0.5 uppercase tracking-wider font-bold ${
              user.role === 'manager' ? 'bg-accent-gold/20 text-accent-gold' : 'bg-accent-community/20 text-accent-community'
            }`}>
              {user.role} ROLE
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-white/80 hover:text-white text-xs font-sans px-3 py-2 rounded bg-white/10 hover:bg-accent-live/30 transition-colors w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex ${
          desktopSidebarOpen ? 'w-64' : 'w-16'
        } transition-all duration-200 bg-station-ink text-station-bg flex-col shrink-0 min-h-screen border-r border-white/10`}
      >
        {/* Desktop Brand */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-live rounded flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-white" />
          </div>
          {desktopSidebarOpen && (
            <div className="min-w-0">
              <div className="font-display text-sm font-bold text-white leading-tight truncate">Nyanthepa 107.6 FM</div>
              <div className="text-[10px] text-white/50 font-sans truncate">Staff Management Portal</div>
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
                title={!desktopSidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-sans font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-live/20 text-white border-r-2 border-accent-live font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent-live' : ''}`} />
                {desktopSidebarOpen && <span className="truncate">{item.label}</span>}
                {desktopSidebarOpen && isActive && <ChevronRight className="w-3 h-3 ml-auto text-accent-live shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* User & logout */}
        <div className="p-3 border-t border-white/10">
          {desktopSidebarOpen && (
            <div className="mb-2 px-1">
              <div className="text-xs text-white/80 font-semibold font-sans truncate">{user.full_name}</div>
              <div className={`text-[10px] font-sans px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                user.role === 'manager' ? 'bg-accent-gold/20 text-accent-gold' : 'bg-accent-community/20 text-accent-community'
              }`}>
                {user.role.toUpperCase()}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-sans px-2 py-1.5 rounded hover:bg-white/10 transition-colors w-full"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {desktopSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-station-border px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 rounded border border-station-border text-station-ink hover:bg-station-sand transition-colors"
              aria-label="Open staff menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden md:block text-station-subtle hover:text-station-ink p-1 rounded hover:bg-station-sand transition-colors"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="text-xs sm:text-sm font-sans font-semibold text-station-ink truncate">
              Staff CMS <span className="hidden sm:inline text-station-subtle font-normal">— Nyanthepa 107.6 FM</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-accent-community/10 text-accent-community text-xs font-semibold">
              Live Station Portal
            </span>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-sans text-accent-live font-semibold hover:underline"
            >
              Public Site →
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 w-full max-w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
