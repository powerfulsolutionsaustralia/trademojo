'use client';

import { useState, useEffect } from 'react';
import { Save, ExternalLink, Globe, Palette, Type, FileText, Copy, CheckCircle, Building2, MapPin, Star, Link } from 'lucide-react';
import { useDashboard } from '../layout';
import { createClient } from '@/lib/supabase/client';
import { AUSTRALIAN_STATES } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const data = useDashboard();
  const site = data?.site as Record<string, unknown> | null;
  const tradie = data?.tradie as Record<string, unknown> | null;
  const slug = (tradie?.slug as string) || '';

  // Business details (tradies table)
  const [business, setBusiness] = useState({
    business_name: '',
    owner_name: '',
    phone: '',
    abn: '',
    license_number: '',
    state: '',
    service_areas: '',
    description: '',
    google_review_link: '',
  });

  // Website settings (tradie_sites table)
  const [settings, setSettings] = useState({
    hero_headline: '',
    hero_subheadline: '',
    about_text: '',
    services: '',
    primary_color: '#F97316',
    custom_domain: '',
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load data from context
  useEffect(() => {
    if (tradie) {
      setBusiness({
        business_name: (tradie.business_name as string) || '',
        owner_name: (tradie.owner_name as string) || '',
        phone: (tradie.phone as string) || '',
        abn: (tradie.abn as string) || '',
        license_number: (tradie.license_number as string) || '',
        state: (tradie.state as string) || '',
        service_areas: ((tradie.service_areas as string[]) || []).join(', '),
        description: (tradie.description as string) || '',
        google_review_link: (tradie.google_review_link as string) || '',
      });
    }
    if (site) {
      setSettings({
        hero_headline: (site.hero_headline as string) || '',
        hero_subheadline: (site.hero_subheadline as string) || '',
        about_text: (site.about_text as string) || '',
        services: ((site.services_list as string[]) || []).join(', '),
        primary_color: (site.primary_color as string) || '#F97316',
        custom_domain: (tradie?.custom_domain as string) || '',
      });
    }
  }, [site, tradie]);

  const handleSave = async () => {
    if (!site || !tradie) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const tradieId = tradie.id as string;

      // Update tradies table (business details)
      await supabase
        .from('tradies')
        .update({
          business_name: business.business_name,
          owner_name: business.owner_name,
          phone: business.phone,
          abn: business.abn || null,
          license_number: business.license_number || null,
          state: business.state,
          service_areas: business.service_areas.split(',').map((s) => s.trim()).filter(Boolean),
          description: business.description,
          google_review_link: business.google_review_link || null,
          custom_domain: settings.custom_domain || null,
        })
        .eq('id', tradieId);

      // Update tradie_sites table (website content)
      await supabase
        .from('tradie_sites')
        .update({
          hero_headline: settings.hero_headline,
          hero_subheadline: settings.hero_subheadline,
          about_text: settings.about_text,
          services_list: settings.services.split(',').map((s) => s.trim()).filter(Boolean),
          primary_color: settings.primary_color,
        })
        .eq('tradie_id', tradieId);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const copyDns = () => {
    navigator.clipboard.writeText('cname.vercel-dns.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted text-sm">Manage your business profile and website</p>
        </div>
        {slug && (
          <a href={`/t/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="w-4 h-4" /> Preview Site
            </Button>
          </a>
        )}
      </div>

      {/* Business Details */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> Business Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Business Name</label>
            <input type="text" value={business.business_name} onChange={(e) => setBusiness(p => ({ ...p, business_name: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Owner Name</label>
            <input type="text" value={business.owner_name} onChange={(e) => setBusiness(p => ({ ...p, owner_name: e.target.value }))} placeholder="Your full name" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Phone</label>
            <input type="tel" value={business.phone} onChange={(e) => setBusiness(p => ({ ...p, phone: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">ABN <span className="text-xs text-muted font-normal">(optional)</span></label>
            <input type="text" value={business.abn} onChange={(e) => setBusiness(p => ({ ...p, abn: e.target.value }))} placeholder="XX XXX XXX XXX" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">License Number <span className="text-xs text-muted font-normal">(optional)</span></label>
            <input type="text" value={business.license_number} onChange={(e) => setBusiness(p => ({ ...p, license_number: e.target.value }))} placeholder="Your trade license #" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">State</label>
            <select value={business.state} onChange={(e) => setBusiness(p => ({ ...p, state: e.target.value }))} className={inputClass}>
              <option value="">Select state...</option>
              {AUSTRALIAN_STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <MapPin className="inline w-4 h-4 mr-1" /> Service Areas <span className="text-xs text-muted font-normal">(comma separated)</span>
          </label>
          <input type="text" value={business.service_areas} onChange={(e) => setBusiness(p => ({ ...p, service_areas: e.target.value }))} placeholder="e.g. Brisbane, Gold Coast, Sunshine Coast" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Business Description</label>
          <textarea value={business.description} onChange={(e) => setBusiness(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your business and what makes you stand out..." className={`${inputClass} resize-none`} />
        </div>
      </div>

      {/* Google Reviews */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" /> Google Reviews
        </h2>
        <p className="text-sm text-muted">
          Add your Google review link to enable the 5-star review system. Customers who rate 5 stars get sent to Google — others send you private feedback.
        </p>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <Link className="inline w-4 h-4 mr-1" /> Google Review Link
          </label>
          <input type="url" value={business.google_review_link} onChange={(e) => setBusiness(p => ({ ...p, google_review_link: e.target.value }))} placeholder="https://search.google.com/local/writereview?placeid=..." className={inputClass} />
          <p className="text-xs text-muted mt-1.5">Find this in your Google Business Profile → Share → &quot;Ask for reviews&quot;</p>
        </div>
        {slug && (
          <div className="bg-background rounded-xl border border-border p-4">
            <p className="text-sm text-foreground font-medium mb-1">Your review link:</p>
            <p className="text-sm text-primary font-mono">trademojo.com.au/t/{slug}/review</p>
            <p className="text-xs text-muted mt-1">Share this with customers to collect reviews.</p>
          </div>
        )}
      </div>

      {/* Website Content */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" /> Website Content
        </h2>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Hero Headline</label>
          <input type="text" value={settings.hero_headline} onChange={(e) => setSettings(p => ({ ...p, hero_headline: e.target.value }))} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Hero Subheadline</label>
          <input type="text" value={settings.hero_subheadline} onChange={(e) => setSettings(p => ({ ...p, hero_subheadline: e.target.value }))} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">About Text</label>
          <textarea value={settings.about_text} onChange={(e) => setSettings(p => ({ ...p, about_text: e.target.value }))} rows={4} className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <FileText className="inline w-4 h-4 mr-1" /> Services <span className="text-xs text-muted font-normal">(comma separated)</span>
          </label>
          <input type="text" value={settings.services} onChange={(e) => setSettings(p => ({ ...p, services: e.target.value }))} className={inputClass} />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Palette className="w-5 h-5 text-mojo" /> Appearance
        </h2>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Brand Color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={settings.primary_color} onChange={(e) => setSettings(p => ({ ...p, primary_color: e.target.value }))} className="w-12 h-12 rounded-xl border border-border cursor-pointer" />
            <input type="text" value={settings.primary_color} onChange={(e) => setSettings(p => ({ ...p, primary_color: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
        </div>
      </div>

      {/* Custom Domain */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent" /> Custom Domain
        </h2>
        <p className="text-sm text-muted">
          Point your own domain to your TradeMojo website.
        </p>

        <div className="bg-background rounded-xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Setup Instructions:</h3>
          <ol className="text-sm text-muted space-y-2 list-decimal list-inside">
            <li>Go to your domain registrar (GoDaddy, Crazy Domains, VentraIP, etc.)</li>
            <li>
              Add a CNAME record:
              <div className="mt-1 flex items-center gap-2">
                <code className="bg-border px-3 py-1.5 rounded-lg text-xs font-mono text-foreground">
                  CNAME → cname.vercel-dns.com
                </code>
                <button onClick={copyDns} className="p-1.5 hover:bg-border rounded-lg cursor-pointer">
                  {copied ? <CheckCircle className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted" />}
                </button>
              </div>
            </li>
            <li>Enter your domain below and save</li>
          </ol>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Your Domain</label>
          <input type="text" value={settings.custom_domain} onChange={(e) => setSettings(p => ({ ...p, custom_domain: e.target.value }))} placeholder="e.g. joesplumbing.com.au" className={inputClass} />
          <p className="text-xs text-muted mt-1.5">DNS changes can take up to 48 hours to propagate.</p>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="lg" className="gap-2" onClick={handleSave} disabled={saving}>
          <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
        {saved && <span className="text-sm text-accent font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved!</span>}
      </div>
    </div>
  );
}
