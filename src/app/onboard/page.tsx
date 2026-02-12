'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Rocket, CheckCircle, Copy, ExternalLink, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { TRADE_CATEGORIES, AUSTRALIAN_STATES, tradeCategoryLabel, slugify } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

type Step = 1 | 2 | 3 | 4;

interface OnboardData {
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  trade_category: string;
  abn: string;
  state: string;
  service_areas: string;
  description: string;
  services_list: string;
  hero_headline: string;
  primary_color: string;
  about_text: string;
}

interface Result {
  slug: string;
  website_url: string;
  dashboard_url: string;
  temp_password: string;
}

export default function OnboardPage() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<OnboardData>({
    business_name: '',
    owner_name: '',
    phone: '',
    email: '',
    trade_category: '',
    abn: '',
    state: '',
    service_areas: '',
    description: '',
    services_list: '',
    hero_headline: '',
    primary_color: '#F97316',
    about_text: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate headline when trade or area changes
      if (name === 'trade_category' || name === 'service_areas') {
        const trade = name === 'trade_category' ? value : prev.trade_category;
        const area = name === 'service_areas' ? value.split(',')[0]?.trim() : prev.service_areas.split(',')[0]?.trim();
        if (trade) {
          updated.hero_headline = `Your Trusted Local ${tradeCategoryLabel(trade as TradeCategory)}${area ? ` in ${area}` : ''}`;
        }
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          service_areas: data.service_areas.split(',').map((s) => s.trim()).filter(Boolean),
          services_list: data.services_list.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setResult(json);
      }
    } catch (err) {
      console.error('Onboard error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const previewSlug = slugify(`${data.business_name}-${data.service_areas.split(',')[0] || data.state}`);

  // Success screen
  if (result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-surface rounded-2xl border border-border shadow-xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-2">
            Website is Live!
          </h1>
          <p className="text-muted mb-8">{data.business_name} is now on TradeMojo</p>

          <div className="space-y-4 text-left">
            <div className="bg-background rounded-xl border border-border p-4">
              <label className="text-xs text-muted uppercase tracking-wider font-semibold">Website URL</label>
              <div className="flex items-center justify-between mt-1">
                <a href={result.website_url} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
                  {result.website_url} <ExternalLink className="w-3 h-3" />
                </a>
                <button onClick={() => copyToClipboard(result.website_url, 'url')} className="p-1.5 hover:bg-border rounded-lg cursor-pointer">
                  {copied === 'url' ? <CheckCircle className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted" />}
                </button>
              </div>
            </div>

            <div className="bg-background rounded-xl border border-border p-4">
              <label className="text-xs text-muted uppercase tracking-wider font-semibold">Dashboard Login</label>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-foreground"><strong>Email:</strong> {data.email}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground"><strong>Password:</strong> {result.temp_password}</p>
                  <button onClick={() => copyToClipboard(result.temp_password, 'pass')} className="p-1.5 hover:bg-border rounded-lg cursor-pointer">
                    {copied === 'pass' ? <CheckCircle className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl border border-border p-4">
              <label className="text-xs text-muted uppercase tracking-wider font-semibold">Custom Domain</label>
              <p className="text-sm text-muted mt-1">
                If they have a domain, add a CNAME record pointing to <code className="bg-border px-1.5 py-0.5 rounded text-xs font-mono">cname.vercel-dns.com</code>
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <a href={result.website_url} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="primary" size="md" className="w-full gap-1.5">
                <ExternalLink className="w-4 h-4" /> View Site
              </Button>
            </a>
            <button onClick={() => { setResult(null); setStep(1); setData({ business_name: '', owner_name: '', phone: '', email: '', trade_category: '', abn: '', state: '', service_areas: '', description: '', services_list: '', hero_headline: '', primary_color: '#F97316', about_text: '' }); }} className="flex-1">
              <Button variant="outline" size="md" className="w-full">
                Create Another
              </Button>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-[family-name:var(--font-outfit)] font-bold text-foreground">
              Trade<span className="text-primary">Mojo</span>
            </span>
          </a>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Sparkles className="w-4 h-4 text-mojo" />
            60-Second Setup
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-2 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-border'}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted">
            <span className={step >= 1 ? 'text-primary font-medium' : ''}>Business</span>
            <span className={step >= 2 ? 'text-primary font-medium' : ''}>Location</span>
            <span className={step >= 3 ? 'text-primary font-medium' : ''}>Customize</span>
            <span className={step >= 4 ? 'text-primary font-medium' : ''}>Launch</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Step 1: Business Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-1">Business Details</h2>
              <p className="text-muted">Basic info about the trade business</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Business Name *</label>
              <input type="text" name="business_name" value={data.business_name} onChange={handleChange} placeholder="e.g. Joe's Plumbing" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Owner Name *</label>
                <input type="text" name="owner_name" value={data.owner_name} onChange={handleChange} placeholder="Joe Smith" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Phone *</label>
                <input type="tel" name="phone" value={data.phone} onChange={handleChange} placeholder="0400 000 000" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email *</label>
                <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="joe@email.com" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Trade *</label>
                <select name="trade_category" value={data.trade_category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">Select trade...</option>
                  {TRADE_CATEGORIES.map((t) => <option key={t} value={t}>{tradeCategoryLabel(t)}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">ABN <span className="text-xs text-muted font-normal">(optional)</span></label>
              <input type="text" name="abn" value={data.abn} onChange={handleChange} placeholder="XX XXX XXX XXX" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>

            <Button variant="primary" size="lg" className="w-full gap-2" onClick={() => setStep(2)} disabled={!data.business_name || !data.owner_name || !data.phone || !data.email || !data.trade_category}>
              Next: Service Area <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Service Area */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-1">Service Area</h2>
              <p className="text-muted">Where does this business operate?</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">State *</label>
              <select name="state" value={data.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">Select state...</option>
                {AUSTRALIAN_STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Suburbs / Cities <span className="text-xs text-muted font-normal">(comma separated)</span></label>
              <input type="text" name="service_areas" value={data.service_areas} onChange={handleChange} placeholder="e.g. Brisbane, Gold Coast, Sunshine Coast" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Brief Description</label>
              <textarea name="description" value={data.description} onChange={handleChange} rows={3} placeholder="Quick description of the business and what they do..." className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="gap-2" onClick={() => setStep(1)}>
                <ArrowLeft className="w-5 h-5" /> Back
              </Button>
              <Button variant="primary" size="lg" className="flex-1 gap-2" onClick={() => setStep(3)} disabled={!data.state}>
                Next: Customize <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Quick Customize */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-1">Quick Customization</h2>
              <p className="text-muted">Fine-tune the website (all optional - we auto-generate everything)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Hero Headline</label>
              <input type="text" name="hero_headline" value={data.hero_headline} onChange={handleChange} placeholder="Auto-generated from trade + area" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Brand Color</label>
              <div className="flex items-center gap-3">
                <input type="color" name="primary_color" value={data.primary_color} onChange={handleChange} className="w-12 h-12 rounded-xl border border-border cursor-pointer" />
                <input type="text" value={data.primary_color} onChange={handleChange} name="primary_color" className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Services <span className="text-xs text-muted font-normal">(comma separated)</span></label>
              <input type="text" name="services_list" value={data.services_list} onChange={handleChange} placeholder="e.g. Emergency Repairs, Installation, Maintenance" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">About Text</label>
              <textarea name="about_text" value={data.about_text} onChange={handleChange} rows={3} placeholder="Auto-generated from business description..." className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="gap-2" onClick={() => setStep(2)}>
                <ArrowLeft className="w-5 h-5" /> Back
              </Button>
              <Button variant="primary" size="lg" className="flex-1 gap-2" onClick={() => setStep(4)}>
                Review &amp; Launch <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Launch */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-1">Review &amp; Launch</h2>
              <p className="text-muted">Confirm everything looks good, then go live!</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted">Business:</span> <strong>{data.business_name}</strong></div>
                <div><span className="text-muted">Owner:</span> <strong>{data.owner_name}</strong></div>
                <div><span className="text-muted">Phone:</span> <strong>{data.phone}</strong></div>
                <div><span className="text-muted">Email:</span> <strong>{data.email}</strong></div>
                <div><span className="text-muted">Trade:</span> <strong>{data.trade_category ? tradeCategoryLabel(data.trade_category as TradeCategory) : '-'}</strong></div>
                <div><span className="text-muted">State:</span> <strong>{data.state}</strong></div>
              </div>
              {data.service_areas && (
                <div className="text-sm"><span className="text-muted">Service Areas:</span> <strong>{data.service_areas}</strong></div>
              )}
              <div className="border-t border-border pt-4">
                <div className="text-sm"><span className="text-muted">Website URL:</span></div>
                <p className="text-primary font-semibold">trademojo.com.au/t/{previewSlug}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: data.primary_color }} />
                <span className="text-sm text-muted">Brand color: {data.primary_color}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="gap-2" onClick={() => setStep(3)}>
                <ArrowLeft className="w-5 h-5" /> Back
              </Button>
              <Button variant="accent" size="lg" className="flex-1 gap-2" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <><Rocket className="w-5 h-5" /> Launch Website</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
