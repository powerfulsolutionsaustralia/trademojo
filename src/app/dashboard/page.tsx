'use client';

import { Users, Calendar, Star, TrendingUp, ArrowUpRight, Phone, ExternalLink } from 'lucide-react';
import { useDashboard } from './layout';
import Button from '@/components/ui/Button';

const urgencyColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
  emergency: 'bg-red-200 text-red-800',
};

export default function DashboardOverview() {
  const data = useDashboard();

  const stats = [
    {
      label: 'New Leads',
      value: String(data?.stats?.new_leads || 0),
      change: `${data?.stats?.this_week_leads || 0} this week`,
      icon: Users,
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Bookings',
      value: String(data?.stats?.total_bookings || 0),
      change: `${data?.stats?.upcoming_bookings || 0} upcoming`,
      icon: Calendar,
      color: 'text-mojo bg-mojo/10',
    },
    {
      label: 'Reviews Sent',
      value: String(data?.stats?.total_reviews || 0),
      change: `${data?.stats?.completed_reviews || 0} completed`,
      icon: Star,
      color: 'text-yellow-500 bg-yellow-50',
    },
    {
      label: 'Conversion',
      value: `${data?.stats?.conversion_rate || 0}%`,
      change: `${data?.stats?.total_leads || 0} total leads`,
      icon: TrendingUp,
      color: 'text-accent bg-accent/10',
    },
  ];

  const recentLeads = (data?.leads || []).slice(0, 4);
  const slug = (data?.tradie?.slug as string) || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">
          Welcome back{data?.tradie?.owner_name ? `, ${(data.tradie.owner_name as string).split(' ')[0]}` : ''}!
        </h1>
        <p className="text-muted">Here&apos;s what&apos;s happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted">{stat.label}</div>
            <div className="text-xs text-accent mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent Leads</h2>
            <a href="/dashboard/leads" className="text-sm text-primary hover:underline">View all</a>
          </div>
          <div className="divide-y divide-border">
            {recentLeads.length > 0 ? recentLeads.map((lead) => {
              const name = lead.customer_name as string;
              const phone = lead.customer_phone as string;
              const service = lead.service_needed as string;
              const urgency = (lead.urgency as string) || 'medium';
              const createdAt = lead.created_at as string;
              const timeAgo = getTimeAgo(createdAt);
              return (
                <div key={lead.id as string} className="p-4 flex items-center justify-between hover:bg-background/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{name}</div>
                      <div className="text-xs text-muted">{service} • {timeAgo}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${urgencyColors[urgency] || urgencyColors.medium}`}>
                      {urgency}
                    </span>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-colors">
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 text-center text-muted">
                <p className="text-sm">No leads yet. Share your website to start getting enquiries!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {slug && (
                <a href={`/t/${slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <ExternalLink className="w-4 h-4" /> View Your Website
                  </Button>
                </a>
              )}
              <a href="/dashboard/reviews">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 mt-2">
                  <Star className="w-4 h-4" /> Send Review Request
                </Button>
              </a>
              <a href="/dashboard/settings">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 mt-2">
                  <Calendar className="w-4 h-4" /> Update Website
                </Button>
              </a>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-br from-mojo to-mojo-dark rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-1">Upgrade to Pro</h3>
            <p className="text-white/80 text-sm mb-4">Get more leads, booking system, and review automation.</p>
            <Button variant="ghost" size="sm" className="bg-white/20 text-white hover:bg-white/30 w-full">
              View Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}
