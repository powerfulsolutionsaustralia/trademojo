'use client';

import { Settings, ArrowRight, CheckCircle } from 'lucide-react';

interface ProfileSetupBannerProps {
  tradie: Record<string, unknown>;
  site: Record<string, unknown> | null;
}

export default function ProfileSetupBanner({ tradie, site }: ProfileSetupBannerProps) {
  const fields = [
    { key: 'business_name', label: 'Business name', done: !!tradie.business_name },
    { key: 'phone', label: 'Phone number', done: !!tradie.phone },
    { key: 'trade_category', label: 'Trade category', done: !!tradie.trade_category },
    { key: 'service_areas', label: 'Service areas', done: Array.isArray(tradie.service_areas) && (tradie.service_areas as string[]).length > 0 },
    { key: 'abn', label: 'ABN', done: !!tradie.abn },
    { key: 'description', label: 'Business description', done: !!tradie.description && (tradie.description as string).length > 20 },
    { key: 'about_text', label: 'About text', done: !!site?.about_text && (site.about_text as string).length > 20 },
    { key: 'services_list', label: 'Services list', done: Array.isArray(site?.services_list) && (site!.services_list as string[]).length > 0 },
  ];

  const completed = fields.filter((f) => f.done).length;
  const total = fields.length;
  const percent = Math.round((completed / total) * 100);

  // Don't show if profile is mostly complete
  if (percent >= 88) return null;

  return (
    <div className="bg-gradient-to-r from-mojo/5 to-primary/5 border border-mojo/20 rounded-2xl p-5 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-mojo" />
            <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
            <span className="text-xs font-medium text-mojo bg-mojo/10 px-2 py-0.5 rounded-full">{completed}/{total}</span>
          </div>
          <p className="text-sm text-muted mb-3">
            A complete profile helps customers find and trust your business.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-border rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-mojo to-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Missing fields */}
          <div className="flex flex-wrap gap-2">
            {fields.map((f) => (
              <span
                key={f.key}
                className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${
                  f.done
                    ? 'bg-accent/10 text-accent'
                    : 'bg-border/50 text-muted'
                }`}
              >
                {f.done && <CheckCircle className="w-3 h-3" />}
                {f.label}
              </span>
            ))}
          </div>
        </div>

        <a
          href="/dashboard/settings"
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-mojo text-white text-sm font-medium rounded-xl hover:bg-mojo/90 transition-colors"
        >
          Complete <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
