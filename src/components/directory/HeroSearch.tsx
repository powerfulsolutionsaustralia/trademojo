'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, X } from 'lucide-react';
import { TRADE_GROUPS, tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

// Flatten all trades from groups for searching
const ALL_TRADES = TRADE_GROUPS.flatMap(g =>
  g.trades.map(t => ({
    value: t,
    label: tradeCategoryLabel(t),
    icon: tradeCategoryIcon(t),
    group: g.label,
  }))
);

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [tradeValue, setTradeValue] = useState('');
  const [tradeSearch, setTradeSearch] = useState('');
  const [tradeOpen, setTradeOpen] = useState(false);
  const tradeInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        tradeInputRef.current &&
        !tradeInputRef.current.contains(e.target as Node)
      ) {
        setTradeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Filter trades based on search
  const filtered = tradeSearch.trim()
    ? ALL_TRADES.filter(t =>
        t.label.toLowerCase().includes(tradeSearch.toLowerCase()) ||
        t.value.replace(/_/g, ' ').includes(tradeSearch.toLowerCase()) ||
        t.group.toLowerCase().includes(tradeSearch.toLowerCase())
      )
    : ALL_TRADES;

  // Group filtered results
  const groupedFiltered = TRADE_GROUPS.map(g => ({
    ...g,
    trades: g.trades.filter(t => filtered.some(f => f.value === t)),
  })).filter(g => g.trades.length > 0);

  const handleSelectTrade = (t: TradeCategory) => {
    setTradeValue(t);
    setTradeSearch('');
    setTradeOpen(false);
  };

  const handleClearTrade = () => {
    setTradeValue('');
    setTradeSearch('');
    tradeInputRef.current?.focus();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeValue) return;

    const loc = location.trim().toLowerCase().replace(/\s+/g, '-') || 'australia';
    if (loc === 'australia') {
      router.push(`/${tradeValue}`);
    } else {
      router.push(`/${tradeValue}/${loc}`);
    }
  };

  const selectedLabel = tradeValue
    ? `${tradeCategoryIcon(tradeValue as TradeCategory)} ${tradeCategoryLabel(tradeValue as TradeCategory)}`
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

        {/* Trade search input */}
        <div className="relative">
          <div className="flex items-center">
            <div className="pl-4">
              <Search className="w-5 h-5 text-mojo" />
            </div>
            {tradeValue ? (
              // Selected state — show the selected trade with clear button
              <div className="flex-1 flex items-center justify-between px-3 py-4">
                <span className="text-base text-foreground font-medium">{selectedLabel}</span>
                <button
                  type="button"
                  onClick={handleClearTrade}
                  className="p-1 rounded-full hover:bg-gray-100 text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // Search state — typeable input
              <input
                ref={tradeInputRef}
                type="text"
                value={tradeSearch}
                onChange={(e) => {
                  setTradeSearch(e.target.value);
                  setTradeOpen(true);
                }}
                onFocus={() => setTradeOpen(true)}
                placeholder="What do you need? e.g. plumber, solar, kitchen..."
                className="flex-1 px-3 py-4 text-base outline-none bg-transparent placeholder:text-muted/50"
                autoComplete="off"
              />
            )}
          </div>

          {/* Dropdown — searchable results */}
          {tradeOpen && !tradeValue && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full z-30 bg-white border border-border rounded-b-2xl shadow-2xl max-h-72 overflow-y-auto"
            >
              {groupedFiltered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted">
                  No trades matching &ldquo;{tradeSearch}&rdquo;
                </div>
              ) : (
                groupedFiltered.map((group) => (
                  <div key={group.label}>
                    <div className="px-4 py-1.5 bg-gray-50 text-[11px] font-semibold text-muted uppercase tracking-wider sticky top-0">
                      {group.label}
                    </div>
                    {group.trades.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleSelectTrade(t)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-primary/5 transition-colors text-foreground"
                      >
                        <span className="text-lg w-6 text-center">{tradeCategoryIcon(t)}</span>
                        <span className="text-sm font-medium">{tradeCategoryLabel(t)}</span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Search button */}
        <div className="p-3 bg-gray-50/50">
          <button
            type="submit"
            disabled={!tradeValue}
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
