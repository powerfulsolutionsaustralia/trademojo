'use client';

import { useState } from 'react';
import { Megaphone, Instagram, Facebook, FileText, Sparkles, Loader2, Copy, CheckCircle, RefreshCw } from 'lucide-react';
import { useDashboard } from '../layout';
import Button from '@/components/ui/Button';

type Tool = 'social' | 'ad' | 'flyer';

const tools: { id: Tool; label: string; icon: React.ReactNode; desc: string; placeholder: string }[] = [
  {
    id: 'social',
    label: 'Social Post',
    icon: <Instagram className="w-5 h-5" />,
    desc: 'Generate engaging Instagram & Facebook posts for your business.',
    placeholder: 'e.g. We just finished a beautiful bathroom reno in Paddington',
  },
  {
    id: 'ad',
    label: 'Ad Copy',
    icon: <Facebook className="w-5 h-5" />,
    desc: 'Create Google Ads or Facebook Ads copy that converts.',
    placeholder: 'e.g. Emergency plumbing service, 24/7 availability, Brisbane',
  },
  {
    id: 'flyer',
    label: 'Promo Flyer',
    icon: <FileText className="w-5 h-5" />,
    desc: 'Generate text for a promotional flyer or letterbox drop.',
    placeholder: 'e.g. Spring special - 20% off all air conditioning services',
  },
];

export default function MarketingPage() {
  const data = useDashboard();
  const tradie = data?.tradie as Record<string, unknown> | null;
  const businessName = (tradie?.business_name as string) || 'Your Business';
  const tradeCategory = (tradie?.trade_category as string) || '';

  const [activeTool, setActiveTool] = useState<Tool>('social');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setResult('');

    try {
      const res = await fetch('/api/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: activeTool,
          topic: topic.trim(),
          businessName,
          tradeCategory,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setResult(json.content || 'Could not generate content. Please try again.');
      } else {
        setResult('Something went wrong. Please try again.');
      }
    } catch {
      setResult('Something went wrong. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTool = tools.find((t) => t.id === activeTool)!;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-primary" /> Marketing Tools
        </h1>
        <p className="text-muted text-sm">AI-powered content to help promote your business</p>
      </div>

      {/* Tool Selector */}
      <div className="grid grid-cols-3 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => { setActiveTool(tool.id); setResult(''); }}
            className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              activeTool === tool.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted bg-surface'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${
              activeTool === tool.id ? 'bg-primary/10 text-primary' : 'bg-border/50 text-muted'
            }`}>
              {tool.icon}
            </div>
            <p className={`text-sm font-medium ${activeTool === tool.id ? 'text-primary' : 'text-foreground'}`}>
              {tool.label}
            </p>
          </button>
        ))}
      </div>

      {/* Generator */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-1">
            {currentTool.icon}
            {currentTool.label} Generator
          </h2>
          <p className="text-sm text-muted">{currentTool.desc}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            What&apos;s the topic or promotion?
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder={currentTool.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full gap-2"
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
        >
          {generating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Generate Content</>
          )}
        </Button>

        {/* Result */}
        {result && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">Generated Content</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleGenerate} disabled={generating}>
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </Button>
              </div>
            </div>
            <div className="bg-background rounded-xl border border-border p-4">
              <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-mojo/5 rounded-2xl border border-mojo/20 p-5">
        <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-mojo" /> Tips for Better Results
        </h3>
        <ul className="text-sm text-muted space-y-1.5">
          <li>&bull; Be specific about your service and location</li>
          <li>&bull; Mention any special offers or promotions</li>
          <li>&bull; Include what makes your business unique</li>
          <li>&bull; Copy and paste the result into your social media or ad platform</li>
        </ul>
      </div>
    </div>
  );
}
