'use client';

import { TRADE_CATEGORIES, tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

export default function TradeCategories() {
  const popularTrades: TradeCategory[] = [
    'plumber',
    'electrician',
    'builder',
    'painter',
    'roofer',
    'landscaper',
    'air_conditioning',
    'solar',
    'carpenter',
    'tiler',
    'handyman',
    'pest_control',
    'cleaning',
    'fencer',
    'pool_builder',
    'concreter',
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-3">
            Browse by Trade
          </h2>
          <p className="text-muted text-lg">
            Find the right tradie for any job around the house
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {popularTrades.map((trade) => (
            <a
              key={trade}
              href={`/${trade}`}
              className="group bg-surface rounded-2xl border border-border p-5 text-center hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{tradeCategoryIcon(trade)}</div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {tradeCategoryLabel(trade)}
              </h3>
              <p className="text-xs text-muted mt-1">
                Find local {tradeCategoryLabel(trade).toLowerCase()}s
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
