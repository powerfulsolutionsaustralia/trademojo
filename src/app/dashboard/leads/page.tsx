'use client';

import { useState } from 'react';
import { Phone, Mail, Clock, Filter, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

const mockLeads = [
  { id: '1', customer_name: 'Sarah Mitchell', customer_phone: '0412 345 678', customer_email: 'sarah@email.com', service_needed: 'Emergency Repair', urgency: 'high', status: 'new' as LeadStatus, description: 'Leaking pipe in kitchen, needs urgent fix', created_at: '2 hours ago', source: 'website' },
  { id: '2', customer_name: 'James Wong', customer_phone: '0423 456 789', customer_email: '', service_needed: 'Installation', urgency: 'medium', status: 'contacted' as LeadStatus, description: 'New hot water system installation', created_at: '5 hours ago', source: 'directory' },
  { id: '3', customer_name: 'Emma Davis', customer_phone: '0434 567 890', customer_email: 'emma.d@email.com', service_needed: 'Maintenance', urgency: 'low', status: 'qualified' as LeadStatus, description: 'Annual maintenance check', created_at: '1 day ago', source: 'mojo' },
  { id: '4', customer_name: 'Michael Brown', customer_phone: '0445 678 901', customer_email: '', service_needed: 'Inspection', urgency: 'medium', status: 'won' as LeadStatus, description: 'Pre-purchase plumbing inspection', created_at: '2 days ago', source: 'website' },
  { id: '5', customer_name: 'Lisa Park', customer_phone: '0456 789 012', customer_email: 'lisa@email.com', service_needed: 'Renovation', urgency: 'low', status: 'new' as LeadStatus, description: 'Bathroom renovation plumbing', created_at: '3 days ago', source: 'directory' },
];

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

export default function LeadsPage() {
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLeads = filter === 'all' ? mockLeads : mockLeads.filter((l) => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-muted text-sm">{mockLeads.length} total leads</p>
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
        {filteredLeads.map((lead) => (
          <div key={lead.id}>
            <div
              className="p-4 flex items-center justify-between hover:bg-background/50 transition-colors cursor-pointer"
              onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {lead.customer_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">{lead.customer_name}</div>
                  <div className="text-xs text-muted">{lead.service_needed} • {lead.created_at}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${urgencyColors[lead.urgency]}`}>
                  {lead.urgency}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === lead.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-border pt-3 bg-background/30">
                {lead.description && (
                  <p className="text-sm text-foreground">{lead.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted">
                  <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {lead.customer_phone}</div>
                  {lead.customer_email && <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {lead.customer_email}</div>}
                  <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lead.created_at}</div>
                  <div className="flex items-center gap-1"><Search className="w-3.5 h-3.5" /> via {lead.source}</div>
                </div>
                <div className="flex gap-2 pt-1">
                  <a href={`tel:${lead.customer_phone.replace(/\s/g, '')}`}>
                    <Button variant="accent" size="sm" className="gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </Button>
                  </a>
                  <Button variant="outline" size="sm" onClick={() => {/* TODO: update status */}}>
                    Mark Contacted
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {/* TODO: update status */}}>
                    Mark Won
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="p-8 text-center text-muted">
            No leads found with this filter.
          </div>
        )}
      </div>
    </div>
  );
}
