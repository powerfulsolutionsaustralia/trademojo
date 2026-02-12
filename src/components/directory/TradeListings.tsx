'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star, Phone, Globe, ExternalLink, Loader2, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import type { TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';

interface Review {
  author: string;
  rating: number;
  text: string;
  time: string;
}

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
  reviews?: Review[];
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

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${iconSize} ${
            n <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewSnippet({ review }: { review: Review }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
          {review.author.charAt(0)}
        </div>
        <span className="text-xs font-medium text-foreground">{review.author}</span>
        <div className="flex items-center gap-0.5 ml-auto">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted leading-relaxed line-clamp-2">{review.text}</p>
      <span className="text-[10px] text-muted/60 mt-1 block">{review.time}</span>
    </div>
  );
}

function ListingCard({ listing, rank }: { listing: Listing; rank: number }) {
  const [showReviews, setShowReviews] = useState(false);
  const hasReviews = listing.reviews && listing.reviews.length > 0;

  // Clean the website URL for display
  const displayUrl = listing.website
    ? listing.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]
    : '';

  return (
    <div className="bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 group">
      {/* Main card body */}
      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          {/* Rank badge */}
          <div className="shrink-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                rank <= 3
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {rank}
            </div>
          </div>

          {/* Info section */}
          <div className="flex-1 min-w-0">
            {/* Top row: Name + open status */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-[family-name:var(--font-outfit)] font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors truncate">
                {listing.business_name}
              </h3>
              {listing.is_open !== undefined && (
                <span
                  className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    listing.is_open
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {listing.is_open ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {listing.rating > 0 ? (
                <>
                  <StarRating rating={listing.rating} />
                  <span className="text-sm font-bold text-foreground">{listing.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted">({listing.review_count} reviews)</span>
                </>
              ) : (
                <span className="text-xs text-muted">No reviews yet</span>
              )}
            </div>

            {/* Address */}
            <p className="flex items-start gap-1.5 text-sm text-muted mt-2.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted/50" />
              <span>{listing.formatted_address}</span>
            </p>

            {/* Contact info row */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {listing.phone && (
                <a
                  href={`tel:${listing.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {listing.phone}
                </a>
              )}
              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {displayUrl}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
          {listing.phone && (
            <a
              href={`tel:${listing.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          )}
          {listing.website && (
            <a
              href={listing.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-4 border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Visit Website
            </a>
          )}
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${listing.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2.5 px-4 border border-border rounded-xl text-sm font-medium text-muted hover:border-primary hover:text-primary transition-colors"
            title="View on Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Directions
          </a>

          {/* Review toggle */}
          {hasReviews && (
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="inline-flex items-center gap-1.5 py-2.5 px-4 border border-border rounded-xl text-sm font-medium text-muted hover:border-primary hover:text-primary transition-colors ml-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Reviews
              {showReviews ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable reviews section */}
      {showReviews && hasReviews && (
        <div className="border-t border-border/50 px-5 sm:px-6 py-4 bg-gray-50/50 rounded-b-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {listing.reviews!.map((review, i) => (
              <ReviewSnippet key={i} review={review} />
            ))}
          </div>
        </div>
      )}
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
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-muted text-sm font-medium">
            Finding {tradeCategoryLabel(trade).toLowerCase()}s
            {location && location !== 'Australia' ? ` in ${location}` : ''}...
          </p>
          <p className="text-muted/50 text-xs mt-1">Fetching reviews and contact details</p>
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
            <a href="/" className="text-primary hover:underline font-medium">search again</a>.
          </p>
        </div>
      </div>
    );
  }

  const withPhone = listings.filter((l) => l.phone).length;
  const withWebsite = listings.filter((l) => l.website).length;

  return (
    <div>
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground">
            {listings.length} {tradeCategoryLabel(trade).toLowerCase()}
            {listings.length !== 1 ? 's' : ''}
            {location && location !== 'Australia' ? ` in ${location}` : ''} found
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted">
            {withPhone > 0 && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {withPhone} with phone
              </span>
            )}
            {withWebsite > 0 && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> {withWebsite} with website
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {listings.map((listing, index) => (
          <ListingCard key={listing.place_id} listing={listing} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
