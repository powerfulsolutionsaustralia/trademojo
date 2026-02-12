'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { TRADE_CATEGORIES, tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

const TRADE_GROUPS: { label: string; trades: TradeCategory[] }[] = [
  {
    label: 'Plumbing & Gas',
    trades: ['plumber'],
  },
  {
    label: 'Electrical & Solar',
    trades: ['electrician', 'solar', 'air_conditioning'],
  },
  {
    label: 'Building & Renovation',
    trades: ['builder', 'carpenter', 'tiler', 'concreter', 'glazier'],
  },
  {
    label: 'Outdoor & Property',
    trades: ['landscaper', 'fencer', 'pool_builder', 'earthmoving', 'demolition'],
  },
  {
    label: 'Roof & Exterior',
    trades: ['roofer', 'painter'],
  },
  {
    label: 'Home Services',
    trades: ['handyman', 'locksmith', 'pest_control', 'cleaning'],
  },
];

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [trade, setTrade] = useState('');
  const [tradeOpen, setTradeOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trade) return;

    const loc = location.trim().toLowerCase().replace(/\s+/g, '-') || 'australia';
    if (loc === 'australia') {
      router.push(`/${trade}`);
    } else {
      router.push(`/${trade}/${loc}`);
    }
  };

  const selectedLabel = trade
    ? `${tradeCategoryIcon(trade as TradeCategory)} ${tradeCategoryLabel(trade as TradeCategory)}`
    : '';

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-border">
        {/* Location input */}
        <div className="flex items-center border-b border-border">
          <div className="pl-4">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Suburb or postcode"
            className="flex-1 px-3 py-4 text-base outline-none bg-transparent placeholder:text-muted/50"
            autoComplete="off"
          />
        </div>

        {/* Trade selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTradeOpen(!tradeOpen)}
            className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-mojo" />
              {trade ? (
                <span className="text-base text-foreground font-medium">{selectedLabel}</span>
              ) : (
                <span className="text-base text-muted/50">What do you need?</span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${tradeOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {tradeOpen && (
            <div className="absolute left-0 right-0 top-full z-30 bg-white border border-border rounded-b-2xl shadow-2xl max-h-80 overflow-y-auto">
              {TRADE_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="px-4 py-2 bg-gray-50 text-[11px] font-semibold text-muted uppercase tracking-wider">
                    {group.label}
                  </div>
                  {group.trades.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTrade(t);
                        setTradeOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-primary/5 transition-colors ${
                        trade === t ? 'bg-primary/10 text-primary' : 'text-foreground'
                      }`}
                    >
                      <span className="text-lg">{tradeCategoryIcon(t)}</span>
                      <span className="text-sm font-medium">{tradeCategoryLabel(t)}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search button */}
        <div className="p-3 bg-gray-50/50">
          <button
            type="submit"
            disabled={!trade}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search Tradies
          </button>
        </div>
      </div>
    </form>
  );
}
