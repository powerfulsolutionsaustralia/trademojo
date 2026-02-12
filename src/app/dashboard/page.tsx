'use client';

import { Users, Calendar, Star, TrendingUp, ArrowUpRight, Phone, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

const stats = [
  { label: 'New Leads', value: '12', change: '+3 this week', icon: Users, color: 'text-primary bg-primary/10' },
  { label: 'Bookings', value: '5', change: '2 upcoming', icon: Calendar, color: 'text-mojo bg-mojo/10' },
  { label: 'Reviews Sent', value: '8', change: '5 completed', icon: Star, color: 'text-yellow-500 bg-yellow-50' },
  { label: 'Conversion', value: '42%', change: '+8% vs last month', icon: TrendingUp, color: 'text-accent bg-accent/10' },
];

const recentLeads = [
  { id: 1, name: 'Sarah Mitchell', service: 'Emergency Repair', urgency: 'high', phone: '0412 345 678', time: '2 hours ago' },
  { id: 2, name: 'James Wong', service: 'Installation', urgency: 'medium', phone: '0423 456 789', time: '5 hours ago' },
  { id: 3, name: 'Emma Davis', service: 'Maintenance', urgency: 'low', phone: '0434 567 890', time: '1 day ago' },
  { id: 4, name: 'Michael Brown', service: 'Inspection', urgency: 'medium', phone: '0445 678 901', time: '2 days ago' },
];

const urgencyColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
  emergency: 'bg-red-200 text-red-800',
};

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">Welcome back!</h1>
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
            {recentLeads.map((lead) => (
              <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-background/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{lead.name}</div>
                    <div className="text-xs text-muted">{lead.service} • {lead.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${urgencyColors[lead.urgency]}`}>
                    {lead.urgency}
                  </span>
                  <a href={`tel:${lead.phone}`} className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-colors">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a href="/t/demo" target="_blank">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <ExternalLink className="w-4 h-4" /> View Your Website
                </Button>
              </a>
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
