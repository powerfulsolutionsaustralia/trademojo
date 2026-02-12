'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Star, Settings, Sparkles, LogOut, Menu, X, Globe } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/settings', label: 'Website Settings', icon: Settings },
  { href: '/dashboard/mojo', label: 'Ask Mojo', icon: Sparkles },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    // TODO: supabase.auth.signOut()
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-white transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="font-[family-name:var(--font-outfit)] font-bold">
                  Trade<span className="text-primary">Mojo</span>
                </span>
              </a>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Business name */}
            <p className="text-xs text-white/40 mt-2 truncate">Demo Business</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.label === 'Ask Mojo' && (
                    <span className="ml-auto text-[10px] bg-mojo/20 text-mojo px-1.5 py-0.5 rounded-full font-semibold">AI</span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 space-y-1">
            <a href="/t/demo" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
              <Globe className="w-5 h-5" /> View Website
            </a>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-white/5 transition-all w-full cursor-pointer">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-surface border-b border-border py-3 px-4 lg:px-6 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-border/50 rounded-lg cursor-pointer">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-xs text-muted bg-accent/10 text-accent px-2.5 py-1 rounded-full font-medium">Free Plan</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
