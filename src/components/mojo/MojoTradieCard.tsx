import { MapPin, Phone, Star, Globe, ExternalLink } from 'lucide-react';
import type { MojoTradieResult } from '@/types/mojo';

interface MojoTradieCardProps {
  tradie: MojoTradieResult;
}

export default function MojoTradieCard({ tradie }: MojoTradieCardProps) {
  return (
    <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground text-[13px] truncate">
            {tradie.business_name}
          </h4>
          <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{tradie.short_description || `${tradie.suburb}, ${tradie.state}`}</span>
          </p>
        </div>
        {tradie.average_rating > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{tradie.average_rating?.toFixed(1)}</span>
            {tradie.review_count > 0 && (
              <span className="text-[10px] text-muted">({tradie.review_count})</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        {tradie.phone && (
          <a
            href={`tel:${tradie.phone.replace(/\s/g, '')}`}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary text-white rounded-lg text-[11px] font-semibold hover:bg-primary-dark transition-colors"
          >
            <Phone className="w-3 h-3" />
            Call
          </a>
        )}
        {tradie.website && (
          <a
            href={tradie.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-1.5 px-2.5 border border-border rounded-lg text-[11px] font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Globe className="w-3 h-3" />
            Website
          </a>
        )}
        {tradie.place_id && (
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${tradie.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-1.5 px-2 border border-border rounded-lg text-muted hover:border-primary hover:text-primary transition-colors"
            title="Google Maps"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
