import { Sparkles } from 'lucide-react';
import { tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

const FOOTER_TRADES: TradeCategory[] = [
  'plumber', 'electrician', 'builder', 'carpenter', 'painter', 'roofer',
  'landscaper', 'solar', 'air_conditioning', 'tiler', 'handyman',
  'pest_control', 'fencer', 'pool_builder', 'concreter', 'locksmith',
  'cleaning', 'glazier', 'earthmoving', 'demolition',
];

const FOOTER_CITIES = [
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
  'Gold Coast', 'Canberra', 'Newcastle', 'Sunshine Coast', 'Hobart',
  'Darwin', 'Townsville', 'Cairns', 'Geelong', 'Toowoomba', 'Wollongong',
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Top section: Trade links grid */}
        <div className="mb-10">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Browse Trades</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-1.5">
            {FOOTER_TRADES.map((t) => (
              <a
                key={t}
                href={`/${t}`}
                className="text-sm text-white/50 hover:text-white transition-colors truncate"
              >
                {tradeCategoryIcon(t)} {tradeCategoryLabel(t)}
              </a>
            ))}
          </div>
        </div>

        {/* City links */}
        <div className="mb-10">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Popular Locations</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-1.5">
            {FOOTER_CITIES.map((city) => (
              <a
                key={city}
                href={`/plumber/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {city}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-base">T</span>
                </div>
                <span className="font-[family-name:var(--font-outfit)] text-lg font-bold">
                  Trade<span className="text-primary">Mojo</span>
                </span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">
                Australia&apos;s trade directory. Find verified tradies with real Google reviews.
              </p>
            </div>

            {/* For Tradies */}
            <div>
              <h4 className="font-semibold mb-3 text-white/80 text-sm">For Tradies</h4>
              <ul className="space-y-1.5">
                <li><a href="/for-tradies" className="text-xs text-white/50 hover:text-white transition-colors">Why TradeMojo</a></li>
                <li><a href="/for-tradies#pricing" className="text-xs text-white/50 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/onboard" className="text-xs text-white/50 hover:text-white transition-colors">Get Your Website</a></li>
                <li><a href="/dashboard" className="text-xs text-white/50 hover:text-white transition-colors">Dashboard Login</a></li>
              </ul>
            </div>

            {/* Directory */}
            <div>
              <h4 className="font-semibold mb-3 text-white/80 text-sm">Directory</h4>
              <ul className="space-y-1.5">
                <li><a href="/#trades" className="text-xs text-white/50 hover:text-white transition-colors">Browse by Trade</a></li>
                <li><a href="/plumber" className="text-xs text-white/50 hover:text-white transition-colors">Plumbers</a></li>
                <li><a href="/electrician" className="text-xs text-white/50 hover:text-white transition-colors">Electricians</a></li>
                <li><a href="/builder" className="text-xs text-white/50 hover:text-white transition-colors">Builders</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-3 text-white/80 text-sm">Company</h4>
              <ul className="space-y-1.5">
                <li><a href="/about" className="text-xs text-white/50 hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="text-xs text-white/50 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="text-xs text-white/50 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-xs text-white/50 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-white/30">
              &copy; {new Date().getFullYear()} TradeMojo Pty Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <Sparkles className="w-3 h-3" />
              Powered by Mojo AI
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
