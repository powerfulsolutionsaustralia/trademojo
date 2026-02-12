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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${
            n <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-7 h-7 text-primary animate-spin mx-auto mb-3" />
          <p className="text-muted text-sm">
            Finding {tradeCategoryLabel(trade).toLowerCase()}s
            {location && location !== 'Australia' ? ` in ${location}` : ''}...
          </p>
        </div>
      </div>
    );
  }

  if (error || listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-semibold text-foreground mb-2 text-lg">
            No {tradeCategoryLabel(trade).toLowerCase()}s found
            {location && location !== 'Australia' ? ` in ${location}` : ''}
          </h3>
          <p className="text-muted text-sm">
            Try a nearby suburb or larger city, or{' '}
            <a href="/" className="text-primary hover:underline">search again</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-foreground">
            {listings.length} {tradeCategoryLabel(trade).toLowerCase()}s{location && location !== 'Australia' ? ` in ${location}` : ''} found
          </h2>
        </div>
      )}

      <div className="space-y-3">
        {listings.map((listing, index) => (
          <div
            key={listing.place_id}
            className="bg-white rounded-xl border border-border p-4 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Name */}
                    <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors truncate">
                      {listing.business_name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {listing.rating > 0 ? (
                        <>
                          <StarRating rating={listing.rating} />
                          <span className="text-sm font-semibold text-foreground">{listing.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted">({listing.review_count} reviews)</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted">No reviews yet</span>
                      )}
                      {listing.is_open !== undefined && (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          listing.is_open
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {listing.is_open ? 'Open' : 'Closed'}
                        </span>
                      )}
                    </div>

                    {/* Address */}
                    <p className="flex items-start gap-1.5 text-sm text-muted mt-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{listing.formatted_address}</span>
                    </p>

                    {/* Phone displayed */}
                    {listing.phone && (
                      <a
                        href={`tel:${listing.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors mt-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {listing.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col items-center gap-2 sm:items-end shrink-0 pl-11 sm:pl-0">
                {listing.phone && (
                  <a
                    href={`tel:${listing.phone.replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                )}
                <div className="flex items-center gap-2">
                  {listing.website && (
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 py-2 px-3 border border-border rounded-lg text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${listing.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 py-2 px-3 border border-border rounded-lg text-xs text-muted hover:border-primary hover:text-primary transition-colors"
                    title="Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
