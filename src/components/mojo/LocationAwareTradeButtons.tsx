'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, X, ChevronDown } from 'lucide-react';
import { TRADE_GROUPS, tradeCategoryLabel, tradeCategoryIcon, slugify } from '@/lib/utils';

const STORAGE_KEY = 'mojo_user_location';

interface StoredLocation {
  suburb: string;
  state?: string;
}

export default function LocationAwareTradeButtons() {
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLocation(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen for location changes from other components
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.location) {
        const loc: StoredLocation = typeof detail.location === 'string'
          ? { suburb: detail.location }
          : detail.location;
        setLocation(loc);
      }
    };
    window.addEventListener('mojo-location-changed', handler);
    return () => window.removeEventListener('mojo-location-changed', handler);
  }, []);

  const saveLocation = (loc: StoredLocation) => {
    setLocation(loc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    window.dispatchEvent(
      new CustomEvent('mojo-location-changed', { detail: { location: loc } })
    );
    setIsEditing(false);
    setManualInput('');
  };

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('mojo-location-changed', { detail: { location: null } })
    );
  };

  const handleGeolocate = async () => {
    if (!navigator.geolocation) {
      setIsEditing(true);
      return;
    }

    setIsGeolocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `/api/geocode?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
          );
          const data = await res.json();
          if (data.suburb) {
            saveLocation({ suburb: data.suburb, state: data.state });
          } else {
            setIsEditing(true);
          }
        } catch {
          setIsEditing(true);
        }
        setIsGeolocating(false);
      },
      () => {
        // Permission denied or error — fall back to manual
        setIsEditing(true);
        setIsGeolocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = manualInput.trim();
    if (!val) return;
    saveLocation({ suburb: val });
  };

  const handleTradeClick = (trade: string) => {
    if (location) {
      // Navigate to trade + location page
      window.location.href = `/${trade}/${slugify(location.suburb)}`;
    } else {
      // No location — trigger inline chat with this trade
      window.dispatchEvent(
        new CustomEvent('mojo-trade-selected', { detail: { trade: tradeCategoryLabel(trade as Parameters<typeof tradeCategoryLabel>[0]) } })
      );
    }
  };

  if (!mounted) {
    // SSR fallback — render without location
    return (
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
    );
  }

  return (
    <section className="py-12 px-4 bg-surface" id="trades">
      <div className="max-w-5xl mx-auto">
        {/* Header with location bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground">
            Browse by Trade
          </h2>

          {/* Location bar */}
          <div className="flex items-center gap-2">
            {location && !isEditing ? (
              <div className="inline-flex items-center gap-2 bg-mojo/10 text-mojo px-3 py-1.5 rounded-full text-sm font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span>{location.suburb}{location.state ? `, ${location.state}` : ''}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-mojo/60 hover:text-mojo transition-colors cursor-pointer"
                  title="Change location"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={clearLocation}
                  className="text-mojo/60 hover:text-mojo transition-colors cursor-pointer"
                  title="Clear location"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : isEditing ? (
              <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Suburb or postcode..."
                    className="pl-8 pr-3 py-1.5 text-sm border border-border rounded-full outline-none focus:border-mojo focus:ring-2 focus:ring-mojo/20 w-48"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="px-3 py-1.5 bg-mojo text-white text-sm rounded-full hover:bg-mojo-dark transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Set
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setManualInput(''); }}
                  className="text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGeolocate}
                  disabled={isGeolocating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-full text-sm text-muted hover:border-mojo hover:text-mojo transition-all cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isGeolocating ? 'animate-spin' : ''}`} />
                  {isGeolocating ? 'Finding...' : 'Use my location'}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-full text-sm text-muted hover:border-mojo hover:text-mojo transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Set area
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location context hint */}
        {location && (
          <p className="text-xs text-muted mb-4">
            Showing tradies near <span className="font-medium text-foreground">{location.suburb}</span>. Click a trade to see results.
          </p>
        )}

        {/* Trade groups */}
        <div className="space-y-6">
          {TRADE_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.trades.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTradeClick(t)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:shadow-sm transition-all cursor-pointer"
                  >
                    <span>{tradeCategoryIcon(t)}</span>
                    <span>{tradeCategoryLabel(t)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
