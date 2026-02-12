import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/directory/Navbar';
import Footer from '@/components/directory/Footer';
import { TRADE_CATEGORIES, tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
import { generateTradeCategoryLd } from '@/lib/seo';
import type { TradeCategory } from '@/types/database';
import { MapPin, Star, ArrowRight, Search } from 'lucide-react';
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

// Major cities to link to for each trade
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

  // TODO: Fetch real tradies from Supabase
  // const { data: tradies } = await supabase.from('tradies').select('*').eq('trade_category', trade).eq('is_active', true);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-5xl mb-4">{icon}</div>
          <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find {label}s in Australia
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
            Browse verified {label.toLowerCase()}s near you. Compare reviews,
            get instant quotes, and book online — all free.
          </p>

          {/* Quick Search */}
          <div className="max-w-xl mx-auto">
            <form
              action={`/${trade}`}
              className="flex items-center bg-surface rounded-2xl border-2 border-border focus-within:border-primary shadow-lg"
            >
              <div className="pl-5">
                <Search className="w-5 h-5 text-muted" />
              </div>
              <input
                type="text"
                name="location"
                placeholder={`Enter your suburb to find ${label.toLowerCase()}s nearby...`}
                className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-muted/60"
              />
              <div className="pr-3">
                <Button type="submit" variant="primary" size="sm">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Placeholder — no tradies yet */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-surface border border-border rounded-2xl p-10">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-3">
              We&apos;re Building the {label} Directory
            </h2>
            <p className="text-muted max-w-lg mx-auto mb-6">
              TradeMojo is launching soon with verified {label.toLowerCase()}s
              across Australia. Be the first to know when {label.toLowerCase()}s
              in your area sign up.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg">
                Notify Me When Available
              </Button>
              <a href="/onboard">
                <Button variant="outline" size="lg">
                  I&apos;m a {label} — List My Business
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Location — SEO links */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-2 text-center">
            {label}s by City
          </h2>
          <p className="text-muted text-center mb-8">
            Find a {label.toLowerCase()} near you
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CITIES.map((city) => (
              <a
                key={city}
                href={`/${trade}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                {city}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Related trades */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-8 text-center">
            Other Trades You Might Need
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {TRADE_CATEGORIES.filter((t) => t !== category && t !== 'other')
              .slice(0, 8)
              .map((t) => (
                <a
                  key={t}
                  href={`/${t}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-surface border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"
                >
                  {tradeCategoryIcon(t)} {tradeCategoryLabel(t)}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
