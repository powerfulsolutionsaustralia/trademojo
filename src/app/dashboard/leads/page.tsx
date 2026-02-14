'use client';

import { useState } from 'react';
import { Phone, Mail, Clock, Filter, Search } from 'lucide-react';
import { useDashboard } from '../layout';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-gray-100 text-gray-500',
};

const urgencyColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
  emergency: 'bg-red-200 text-red-800',
};

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

export default function LeadsPage() {
  const data = useDashboard();
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const leads = (data?.leads || []) as Array<Record<string, unknown>>;
  const filteredLeads = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    const supabase = createClient();
    await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    // Optimistic update — refresh page
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-muted text-sm">{leads.length} total leads</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-muted" />
        {(['all', 'new', 'contacted', 'qualified', 'won', 'lost'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              filter === s ? 'bg-primary text-white' : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Leads List */}
      <div className="bg-surface rounded-2xl border border-border divide-y divide-border">
        {filteredLeads.map((lead) => {
          const id = lead.id as string;
          const name = lead.customer_name as string;
          const phone = lead.customer_phone as string;
          const email = (lead.customer_email as string) || '';
          const service = lead.service_needed as string;
          const urgency = (lead.urgency as string) || 'medium';
          const status = (lead.status as LeadStatus) || 'new';
          const description = (lead.description as string) || '';
          const source = (lead.source as string) || 'website';
          const createdAt = lead.created_at as string;

          return (
            <div key={id}>
              <div
                className="p-4 flex items-center justify-between hover:bg-background/50 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === id ? null : id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground text-sm truncate">{name}</div>
                    <div className="text-xs text-muted">{service} • {getTimeAgo(createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${urgencyColors[urgency] || urgencyColors.medium}`}>
                    {urgency}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${statusColors[status] || statusColors.new}`}>
                    {status}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === id && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3 bg-background/30">
                  {description && (
                    <p className="text-sm text-foreground">{description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {phone}</div>
                    {email && <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {email}</div>}
                    <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {getTimeAgo(createdAt)}</div>
                    <div className="flex items-center gap-1"><Search className="w-3.5 h-3.5" /> via {source}</div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a href={`tel:${phone.replace(/\s/g, '')}`}>
                      <Button variant="accent" size="sm" className="gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </Button>
                    </a>
                    {status === 'new' && (
                      <Button variant="outline" size="sm" onClick={() => updateLeadStatus(id, 'contacted')}>
                        Mark Contacted
                      </Button>
                    )}
                    {(status === 'new' || status === 'contacted' || status === 'qualified') && (
                      <Button variant="outline" size="sm" onClick={() => updateLeadStatus(id, 'won')}>
                        Mark Won
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredLeads.length === 0 && (
          <div className="p-8 text-center text-muted">
            {leads.length === 0 ? (
              <div>
                <p className="text-sm font-medium mb-1">No leads yet</p>
                <p className="text-xs">Share your website link to start receiving customer enquiries.</p>
              </div>
            ) : (
              <p className="text-sm">No leads found with this filter.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
