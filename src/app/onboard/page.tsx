'use client';

import { useState } from 'react';
import { Rocket, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import MojoLogo from '@/components/ui/MojoLogo';
import { TRADE_CATEGORIES, tradeCategoryLabel } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

export default function OnboardPage() {
  const [data, setData] = useState({
    business_name: '',
    email: '',
    password: '',
    phone: '',
    trade_category: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (json.success) {
        // Auto-login and redirect to dashboard
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        window.location.href = '/dashboard';
      } else {
        setError(json.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = data.business_name && data.email && data.password && data.phone && data.trade_category;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex justify-center mb-4">
            <MojoLogo size="lg" />
          </a>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">
            Get Your Free Website
          </h1>
          <p className="text-muted mt-1">Create your account in 30 seconds — customise inside your dashboard.</p>
        </div>

        {/* Signup Form */}
        <div className="bg-surface rounded-2xl border border-border shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Business Name *</label>
              <input
                type="text"
                name="business_name"
                value={data.business_name}
                onChange={handleChange}
                placeholder="e.g. Joe's Plumbing"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Trade *</label>
              <select
                name="trade_category"
                value={data.trade_category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select your trade...</option>
                {TRADE_CATEGORIES.map((t) => (
                  <option key={t} value={t}>{tradeCategoryLabel(t)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="0400 000 000"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email *</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="you@business.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full gap-2 mt-2"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <><span className="animate-spin mr-1">⏳</span> Creating your account...</>
              ) : (
                <><Rocket className="w-5 h-5" /> Create Free Account</>
              )}
            </Button>
          </form>

          {/* What you get */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted text-center mb-3 font-medium uppercase tracking-wider">What&apos;s included — free</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <span className="text-accent">✓</span> 4-page professional website
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-accent">✓</span> Lead capture form
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-accent">✓</span> Google review system
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-accent">✓</span> Business dashboard
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
