import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/directory/Navbar';
import Footer from '@/components/directory/Footer';
import TradeListings from '@/components/directory/TradeListings';
import { TRADE_CATEGORIES, tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
import { generateTradeCategoryLd } from '@/lib/seo';
import type { TradeCategory } from '@/types/database';
import { MapPin, ArrowRight, Shield, Star, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Props {
  params: Promise<{ trade: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trade } = await params;
  if (!TRADE_CATEGORIES.includes(trade as TradeCategory)) return {};

  const label = tradeCategoryLabel(trade as TradeCategory);
  return {
    title: `Find ${label}s in Australia - TradeMojo`,
    description: `Compare trusted ${label.toLowerCase()}s across Australia. Read reviews, get instant quotes, and book online with TradeMojo.`,
    openGraph: {
      title: `Find ${label}s in Australia - TradeMojo`,
      description: `Compare trusted ${label.toLowerCase()}s across Australia. Read reviews, get instant quotes, and book online.`,
    },
    alternates: {
      canonical: `https://trademojo.com.au/${trade}`,
    },
  };
}

export function generateStaticParams() {
  return TRADE_CATEGORIES.filter((t) => t !== 'other').map((trade) => ({
    trade,
  }));
}

const CITIES = [
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
  'Gold Coast', 'Canberra', 'Newcastle', 'Sunshine Coast',
  'Hobart', 'Darwin', 'Townsville', 'Cairns', 'Geelong',
  'Toowoomba', 'Wollongong', 'Ballarat', 'Bendigo',
];

export default async function TradeCategoryPage({ params }: Props) {
  const { trade } = await params;

  if (!TRADE_CATEGORIES.includes(trade as TradeCategory)) {
    notFound();
  }

  const category = trade as TradeCategory;
  const label = tradeCategoryLabel(category);
  const icon = tradeCategoryIcon(category);
  const jsonLd = generateTradeCategoryLd(category);

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
          <div className="text-5xl mb-4">{icon}</div>
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-bold text-foreground mb-3">
            {label}s in Australia
          </h1>
          <p className="text-muted text-base max-w-xl mx-auto mb-6">
            Browse {label.toLowerCase()}s near you. Compare reviews, call directly, or visit their website.
          </p>
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
              <Clock className="w-3.5 h-3.5 text-primary" />
              Live Availability
            </div>
          </div>
        </div>
      </section>

      {/* Real Listings from Google Places */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <TradeListings trade={category} location="Australia" />
        </div>
      </section>

      {/* Browse by Location */}
      <section className="py-12 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-2 text-center">
            {label}s by City
          </h2>
          <p className="text-muted text-sm text-center mb-6">
            Find a {label.toLowerCase()} near you
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {CITIES.map((city) => (
              <a
                key={city}
                href={`/${trade}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-2 px-3 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"
              >
                <MapPin className="w-3 h-3 text-muted shrink-0" />
                {city}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Related trades */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-6 text-center">
            Other Trades
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {TRADE_CATEGORIES.filter((t) => t !== category && t !== 'other')
              .slice(0, 8)
              .map((t) => (
                <a
                  key={t}
                  href={`/${t}`}
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
            Are you a {label.toLowerCase()}?
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Get your business listed on TradeMojo. Receive leads, bookings, and grow your online reputation.
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
