'use client';

import { usePathname } from 'next/navigation';
import { Phone, Home, Wrench, Info, Star } from 'lucide-react';
import type { Tradie, TradieSite } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

interface Props {
  tradie: Tradie;
  site: TradieSite;
  color: string;
  children: React.ReactNode;
}

export default function TradieSiteShell({ tradie, site, color, children }: Props) {
  const pathname = usePathname();
  const slug = tradie.slug;
  const serviceAreas = tradie.service_areas || [];
  const tradeLabel = tradeCategoryLabel(tradie.trade_category as TradeCategory);

  const navLinks = [
    { href: `/t/${slug}`, label: 'Home', icon: Home },
    { href: `/t/${slug}/services`, label: 'Services', icon: Wrench },
    { href: `/t/${slug}/about`, label: 'About', icon: Info },
    { href: `/t/${slug}/reviews`, label: 'Reviews', icon: Star },
  ];

  return (
    <>
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 border-b border-black/10 backdrop-blur-xl" style={{ backgroundColor: `${color}f5` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              {tradie.logo_url ? (
                <img src={tradie.logo_url} alt={tradie.business_name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{tradie.business_name.charAt(0)}</span>
                </div>
              )}
              <a href={`/t/${slug}`} className="font-[family-name:var(--font-outfit)] text-white font-bold text-base truncate max-w-[150px] sm:max-w-none">
                {tradie.business_name}
              </a>
            </div>

            {/* Page navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${tradie.phone}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-white/90 text-sm font-medium hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                {tradie.phone}
              </a>
              <a
                href={`/t/${slug}#quote`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-sm font-bold transition-all hover:shadow-lg"
                style={{ color }}
              >
                Get Quote
              </a>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1 pb-2 -mt-1 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <link.icon className="w-3 h-3" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page content */}
      {children}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-[family-name:var(--font-outfit)] font-bold text-lg">{tradie.business_name}</p>
              <p className="text-sm text-white/40 mt-1">
                {tradeLabel}{serviceAreas.length > 0 ? ` · ${serviceAreas.join(' · ')}` : ''}{tradie.state ? `, ${tradie.state}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${tradie.phone}`}
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" /> {tradie.phone}
              </a>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <span>Powered by</span>
                <a href="https://trademojo.com.au" className="font-semibold hover:text-white transition-colors" style={{ color }}>
                  TradeMojo
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
