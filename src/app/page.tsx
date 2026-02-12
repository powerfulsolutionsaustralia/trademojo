import Navbar from '@/components/directory/Navbar';
import HeroSearch from '@/components/directory/HeroSearch';
import Footer from '@/components/directory/Footer';
import { tradeCategoryLabel, tradeCategoryIcon, TRADE_CATEGORIES } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';
import { MapPin, Star, Shield, Zap, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const TRADE_GROUPS: { label: string; trades: TradeCategory[] }[] = [
  { label: 'Plumbing & Gas', trades: ['plumber'] },
  { label: 'Electrical & Solar', trades: ['electrician', 'solar', 'air_conditioning'] },
  { label: 'Building & Renovation', trades: ['builder', 'carpenter', 'tiler', 'concreter', 'glazier'] },
  { label: 'Outdoor & Property', trades: ['landscaper', 'fencer', 'pool_builder', 'earthmoving'] },
  { label: 'Roof & Exterior', trades: ['roofer', 'painter'] },
  { label: 'Home Services', trades: ['handyman', 'locksmith', 'pest_control', 'cleaning'] },
];

const POPULAR_LOCATIONS = [
  { city: 'Sydney', state: 'NSW' },
  { city: 'Melbourne', state: 'VIC' },
  { city: 'Brisbane', state: 'QLD' },
  { city: 'Perth', state: 'WA' },
  { city: 'Adelaide', state: 'SA' },
  { city: 'Gold Coast', state: 'QLD' },
  { city: 'Canberra', state: 'ACT' },
  { city: 'Newcastle', state: 'NSW' },
  { city: 'Sunshine Coast', state: 'QLD' },
  { city: 'Wollongong', state: 'NSW' },
  { city: 'Hobart', state: 'TAS' },
  { city: 'Geelong', state: 'VIC' },
  { city: 'Townsville', state: 'QLD' },
  { city: 'Cairns', state: 'QLD' },
  { city: 'Darwin', state: 'NT' },
  { city: 'Toowoomba', state: 'QLD' },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero — Search above the fold */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
            Find a Tradie Near You
          </h1>
          <p className="text-muted text-base mb-8 max-w-md mx-auto">
            Enter your suburb, pick a trade, and see the highest-rated businesses with contact details.
          </p>

          <HeroSearch />

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              Real Google Reviews
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              Verified Businesses
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              100% Free
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Trade — Grouped */}
      <section className="py-12 px-4 bg-surface" id="trades">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-6">
            Browse by Trade
          </h2>

          <div className="space-y-6">
            {TRADE_GROUPS.map((group) => (
              <div key={group.label}>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.trades.map((t) => (
                    <a
                      key={t}
                      href={`/${t}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:shadow-sm transition-all"
                    >
                      <span>{tradeCategoryIcon(t)}</span>
                      <span>{tradeCategoryLabel(t)}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Location */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-6">
            Browse by Location
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {POPULAR_LOCATIONS.map(({ city, state }) => (
              <a
                key={city}
                href={`/plumber/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between px-4 py-3 bg-white border border-border rounded-xl hover:border-primary hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{city}</span>
                </div>
                <span className="text-[10px] text-muted">{state}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* For Tradies — Compact CTA */}
      <section className="py-12 px-4 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-3">
            Are you a tradie?
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-lg mx-auto">
            Get a professional website with lead capture, bookings, and automated Google reviews — set up in under 60 seconds.
          </p>
          <a href="/for-tradies">
            <Button variant="primary" size="lg">
              Learn More <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
