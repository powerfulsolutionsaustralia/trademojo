'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star, Phone, Globe, ExternalLink, Loader2, Clock } from 'lucide-react';
import type { TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';

interface Listing {
  place_id: string;
  business_name: string;
  formatted_address: string;
  trade_category: TradeCategory;
  suburb: string;
  state: string;
  postcode: string;
  rating: number;
  review_count: number;
  phone: string;
  website: string;
  is_open?: boolean;
  photo_reference: string | null;
  lat: number;
  lng: number;
}

interface TradeListingsProps {
  trade: TradeCategory;
  location?: string;
  state?: string;
  limit?: number;
  showTitle?: boolean;
}

export default function TradeListings({ trade, location, state, limit, showTitle = true }: TradeListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('trade', trade);
        if (location) params.set('location', location);
        if (state) params.set('state', state);

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();

        if (data.results) {
          setListings(limit ? data.results.slice(0, limit) : data.results);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [trade, location, state, limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-muted text-sm">
            Finding {tradeCategoryLabel(trade).toLowerCase()}s
            {location ? ` in ${location}` : ''}...
          </p>
        </div>
      </div>
    );
  }

  if (error || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">
          No {tradeCategoryLabel(trade).toLowerCase()}s found
          {location ? ` in ${location}` : ''} yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground">
            {tradeCategoryLabel(trade)}s{location ? ` in ${location}` : ''}
          </h2>
          <span className="text-sm text-muted">{listings.length} found</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div
            key={listing.place_id}
            className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
          >
            {/* Photo placeholder / gradient */}
            <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-mojo/5 relative">
              {listing.is_open !== undefined && (
                <div className={`absolute top-3 left-3 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${listing.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <Clock className="w-3 h-3" />
                  {listing.is_open ? 'Open Now' : 'Closed'}
                </div>
              )}
              {listing.rating > 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-foreground">{listing.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted">({listing.review_count})</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors line-clamp-1">
                {listing.business_name}
              </h3>
              <p className="flex items-center gap-1 text-xs text-muted mt-1 line-clamp-1">
                <MapPin className="w-3 h-3 shrink-0" />
                {listing.formatted_address}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                {listing.phone && (
                  <a
                    href={`tel:${listing.phone.replace(/\s/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                )}
                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${listing.place_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-2 px-3 border border-border rounded-xl text-sm text-muted hover:border-primary hover:text-primary transition-colors"
                  title="View on Google Maps"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
