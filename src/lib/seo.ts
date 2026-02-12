import type { Tradie, TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';

/**
 * Generate JSON-LD structured data for a tradie's LocalBusiness listing.
 * This is critical for Google search and AI search engines.
 */
export function generateTradieLd(tradie: Tradie) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://trademojo.com.au/t/${tradie.slug}`,
    name: tradie.business_name,
    description: tradie.description || tradie.short_description,
    url: `https://trademojo.com.au/t/${tradie.slug}`,
    telephone: tradie.phone,
    email: tradie.email,
    ...(tradie.logo_url && { image: tradie.logo_url }),
    address: {
      '@type': 'PostalAddress',
      addressRegion: tradie.state,
      addressCountry: 'AU',
      ...(tradie.postcode && { postalCode: tradie.postcode }),
    },
    areaServed: tradie.service_areas.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    ...(tradie.average_rating &&
      tradie.average_rating > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tradie.average_rating,
          reviewCount: tradie.review_count || 1,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '07:00',
      closes: '17:00',
    },
    sameAs: [],
    additionalType: getSchemaTypeForTrade(tradie.trade_category as TradeCategory),
  };
}

/**
 * Generate JSON-LD for the directory page (WebSite + SearchAction)
 */
export function generateDirectoryLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TradeMojo',
    url: 'https://trademojo.com.au',
    description:
      "Australia's smartest trade directory. Find trusted tradies with AI-powered search.",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://trademojo.com.au/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD for trade category listing pages
 */
export function generateTradeCategoryLd(
  category: TradeCategory,
  location?: string
) {
  const label = tradeCategoryLabel(category);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: location
      ? `${label}s in ${location} - TradeMojo`
      : `${label}s in Australia - TradeMojo`,
    description: location
      ? `Find trusted ${label.toLowerCase()}s in ${location}. Compare reviews, get quotes, and book online.`
      : `Find trusted ${label.toLowerCase()}s across Australia. Compare reviews, get quotes, and book online.`,
    url: location
      ? `https://trademojo.com.au/${category}/${location.toLowerCase().replace(/\s+/g, '-')}`
      : `https://trademojo.com.au/${category}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'TradeMojo',
      url: 'https://trademojo.com.au',
    },
  };
}

/**
 * Map trade categories to Schema.org types
 */
function getSchemaTypeForTrade(category: TradeCategory): string {
  const mapping: Partial<Record<TradeCategory, string>> = {
    plumber: 'https://schema.org/Plumber',
    electrician: 'https://schema.org/Electrician',
    roofer: 'https://schema.org/RoofingContractor',
    painter: 'https://schema.org/HousePainter',
    locksmith: 'https://schema.org/Locksmith',
    pest_control: 'https://schema.org/PestControlService',
    cleaning: 'https://schema.org/HousePainter', // closest match
    landscaper: 'https://schema.org/Landscaper',
  };
  return mapping[category] || 'https://schema.org/HomeAndConstructionBusiness';
}

/**
 * Generate meta tags for a tradie page
 */
export function generateTradieMetadata(tradie: Tradie) {
  const title = `${tradie.business_name} - ${tradeCategoryLabel(tradie.trade_category as TradeCategory)} in ${tradie.service_areas[0] || tradie.state}`;
  const description = tradie.short_description ||
    `${tradie.business_name} is a trusted ${tradeCategoryLabel(tradie.trade_category as TradeCategory).toLowerCase()} serving ${tradie.service_areas.join(', ') || tradie.state}. Get a free quote today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://trademojo.com.au/t/${tradie.slug}`,
      type: 'website',
      ...(tradie.hero_image_url && {
        images: [{ url: tradie.hero_image_url }],
      }),
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
    alternates: {
      canonical: `https://trademojo.com.au/t/${tradie.slug}`,
    },
  };
}
