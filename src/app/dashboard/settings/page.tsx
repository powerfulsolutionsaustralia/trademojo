'use client';

import { useState, useEffect } from 'react';
import { Save, ExternalLink, Globe, Palette, Type, FileText, Copy, CheckCircle } from 'lucide-react';
import { useDashboard } from '../layout';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const data = useDashboard();
  const site = data?.site as Record<string, unknown> | null;
  const slug = (data?.tradie?.slug as string) || '';

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
    if (site) {
      setSettings({
        hero_headline: (site.hero_headline as string) || '',
        hero_subheadline: (site.hero_subheadline as string) || '',
        about_text: (site.about_text as string) || '',
        services: ((site.services_list as string[]) || []).join(', '),
        primary_color: (site.primary_color as string) || '#F97316',
        custom_domain: (data?.tradie?.custom_domain as string) || '',
      });
    }
  }, [site, data?.tradie?.custom_domain]);

  const handleSave = async () => {
    if (!site || !data?.tradie) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const tradieId = data.tradie.id as string;

      // Update tradie_sites
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

      // Update custom domain if changed
      if (settings.custom_domain !== (data.tradie.custom_domain || '')) {
        await supabase
          .from('tradies')
          .update({ custom_domain: settings.custom_domain || null })
          .eq('id', tradieId);
      }

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

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">Website Settings</h1>
          <p className="text-muted text-sm">Customize your lead-gen website</p>
        </div>
        {slug && (
          <a href={`/t/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="w-4 h-4" /> Preview Site
            </Button>
          </a>
        )}
      </div>

      {/* Content Settings */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" /> Content
        </h2>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Hero Headline</label>
          <input type="text" value={settings.hero_headline} onChange={(e) => setSettings(p => ({ ...p, hero_headline: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Hero Subheadline</label>
          <input type="text" value={settings.hero_subheadline} onChange={(e) => setSettings(p => ({ ...p, hero_subheadline: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">About Text</label>
          <textarea value={settings.about_text} onChange={(e) => setSettings(p => ({ ...p, about_text: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <FileText className="inline w-4 h-4 mr-1" /> Services <span className="text-xs text-muted font-normal">(comma separated)</span>
          </label>
          <input type="text" value={settings.services} onChange={(e) => setSettings(p => ({ ...p, services: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
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
          <input type="text" value={settings.custom_domain} onChange={(e) => setSettings(p => ({ ...p, custom_domain: e.target.value }))} placeholder="e.g. joesplumbing.com.au" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          <p className="text-xs text-muted mt-1.5">DNS changes can take up to 48 hours to propagate.</p>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="lg" className="gap-2" onClick={handleSave} disabled={saving}>
          <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        {saved && <span className="text-sm text-accent font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved!</span>}
      </div>
    </div>
  );
}
