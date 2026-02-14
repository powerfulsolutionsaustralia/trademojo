'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, Users, Star, Settings, Sparkles, LogOut, Menu, X, Globe, Loader2, ShieldCheck } from 'lucide-react';

interface DashboardData {
  user: { id: string; email: string };
  tradie: Record<string, unknown>;
  site: Record<string, unknown> | null;
  leads: Record<string, unknown>[];
  reviews: Record<string, unknown>[];
  bookings: Record<string, unknown>[];
  stats: {
    total_leads: number;
    new_leads: number;
    this_week_leads: number;
    total_reviews: number;
    completed_reviews: number;
    total_bookings: number;
    upcoming_bookings: number;
    conversion_rate: number;
  };
}

const DashboardContext = createContext<DashboardData | null>(null);
export const useDashboard = () => useContext(DashboardContext);

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else if (res.status === 401) {
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const businessName = (data?.tradie?.business_name as string) || 'Your Business';
  const slug = (data?.tradie?.slug as string) || '';
  const planTier = (data?.tradie?.plan_tier as string) || 'free';
  const isApproved = data?.tradie?.is_approved as boolean;

  const planLabels: Record<string, { label: string; color: string }> = {
    free: { label: 'Free Plan', color: 'bg-gray-100 text-gray-600' },
    payg: { label: 'Pay-As-You-Go', color: 'bg-blue-100 text-blue-700' },
    pro: { label: 'Pro Plan', color: 'bg-mojo/10 text-mojo' },
    premium: { label: 'Premium', color: 'bg-primary/10 text-primary' },
  };

  const plan = planLabels[planTier] || planLabels.free;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-muted text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={data}>
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
              <p className="text-xs text-white/40 mt-2 truncate">{businessName}</p>
              {isApproved === false && (
                <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                  ⏳ Pending review
                </p>
              )}
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
                    {item.label === 'Leads' && data?.stats?.new_leads ? (
                      <span className="ml-auto text-[10px] bg-primary/30 text-primary px-1.5 py-0.5 rounded-full font-semibold">{data.stats.new_leads}</span>
                    ) : null}
                    {item.label === 'Ask Mojo' && (
                      <span className="ml-auto text-[10px] bg-mojo/20 text-mojo px-1.5 py-0.5 rounded-full font-semibold">AI</span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Upgrade CTA in sidebar */}
            {planTier === 'free' && (
              <div className="mx-3 mb-3 bg-gradient-to-br from-mojo/20 to-primary/20 rounded-xl p-4">
                <p className="text-xs font-bold text-white mb-1">Upgrade to Pro</p>
                <p className="text-[11px] text-white/60 mb-3">Get more leads and premium features.</p>
                <button className="w-full text-xs font-bold bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-colors cursor-pointer">
                  View Plans
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="p-3 border-t border-white/10 space-y-1">
              {slug && (
                <a href={`/t/${slug}`} target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
                  <Globe className="w-5 h-5" /> View Website
                </a>
              )}
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
            <div className="hidden lg:flex items-center gap-3">
              <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
              {isApproved && (
                <span className="flex items-center gap-1 text-xs text-accent font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${plan.color}`}>{plan.label}</span>
            </div>
          </header>

          {/* Pending approval banner */}
          {isApproved === false && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-4 lg:px-6 py-3 flex items-center gap-3">
              <span className="text-lg">⏳</span>
              <div>
                <p className="text-sm font-semibold text-yellow-800">Your listing is under review</p>
                <p className="text-xs text-yellow-700">We&apos;re verifying your business. You&apos;ll receive an email once approved.</p>
              </div>
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
