import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/directory/Navbar';
import Footer from '@/components/directory/Footer';
import TradeListings from '@/components/directory/TradeListings';
import { TRADE_CATEGORIES, tradeCategoryLabel, tradeCategoryPageTitle, tradeCategoryIcon } from '@/lib/utils';
import { generateTradeCategoryLd } from '@/lib/seo';
import type { TradeCategory } from '@/types/database';
import { MapPin, Phone, Star, ArrowRight, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Props {
  params: Promise<{ trade: string; location: string }>;
}

function formatLocation(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trade, location } = await params;
  if (!TRADE_CATEGORIES.includes(trade as TradeCategory)) return {};

  const pageTitle = tradeCategoryPageTitle(trade as TradeCategory);
  const label = tradeCategoryLabel(trade as TradeCategory);
  const cityName = formatLocation(location);

  return {
    title: `${pageTitle} in ${cityName} - Find Local ${pageTitle} | TradeMojo`,
    description: `Looking for a ${label.toLowerCase()} in ${cityName}? Compare trusted, reviewed ${pageTitle.toLowerCase()} near you. Get free quotes and book online with TradeMojo.`,
    openGraph: {
      title: `${pageTitle} in ${cityName} | TradeMojo`,
      description: `Find trusted ${pageTitle.toLowerCase()} in ${cityName}. Compare reviews, get quotes, book online.`,
    },
    alternates: {
      canonical: `https://trademojo.com.au/${trade}/${location}`,
    },
  };
}

export default async function TradeLocationPage({ params }: Props) {
  const { trade, location } = await params;

  if (!TRADE_CATEGORIES.includes(trade as TradeCategory)) {
    notFound();
  }

  const category = trade as TradeCategory;
  const label = tradeCategoryLabel(category);
  const pageTitle = tradeCategoryPageTitle(category);
  const icon = tradeCategoryIcon(category);
  const cityName = formatLocation(location);
  const jsonLd = generateTradeCategoryLd(category, cityName);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-3.5 h-3.5" />
            {cityName}
          </div>
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-bold text-foreground mb-3">
            {icon} {pageTitle} in {cityName}
          </h1>
          <p className="text-muted text-base max-w-xl mx-auto mb-5">
            Find trusted {pageTitle.toLowerCase()} in {cityName} and
            surrounding suburbs. Read reviews, compare quotes, and call directly.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              Google Verified
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              Real Reviews
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" />
              Direct Contact
            </div>
          </div>
        </div>
      </section>

      {/* Real Listings from Google Places */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <TradeListings trade={category} location={cityName} />
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 px-4 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-4">
            About {label} Services in {cityName}
          </h2>
          <div className="text-muted text-sm leading-relaxed space-y-3">
            <p>
              Looking for a reliable {label.toLowerCase()} in {cityName}?
              TradeMojo connects you with verified {pageTitle.toLowerCase()}
              {' '}serving {cityName} and surrounding areas. All listings are sourced
              from Google and include real reviews from customers.
            </p>
            <p>
              You can call any {label.toLowerCase()} directly from this page,
              visit their website for more info, or view their location on Google
              Maps. Every business shown has a verified Google Business profile.
            </p>
          </div>
        </div>
      </section>

      {/* Browse other trades in this city */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-6 text-center">
            Other Trades in {cityName}
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {TRADE_CATEGORIES.filter((t) => t !== category && t !== 'other')
              .slice(0, 12)
              .map((t) => (
                <a
                  key={t}
                  href={`/${t}/${location}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"
                >
                  {tradeCategoryIcon(t)} {tradeCategoryLabel(t)}
                  <ArrowRight className="w-3 h-3" />
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* CTA for tradies */}
      <section className="py-12 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-3">
            Are you a {label.toLowerCase()} in {cityName}?
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Get your business listed on TradeMojo and start receiving leads from customers in your area.
          </p>
          <a href="/for-tradies">
            <Button variant="accent" size="lg" className="text-white">
              List Your Business — Free
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
