import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/directory/Navbar';
import Footer from '@/components/directory/Footer';
import { TRADE_CATEGORIES, tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
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

  const label = tradeCategoryLabel(trade as TradeCategory);
  const cityName = formatLocation(location);

  return {
    title: `${label}s in ${cityName} - Find Local ${label}s | TradeMojo`,
    description: `Looking for a ${label.toLowerCase()} in ${cityName}? Compare trusted, reviewed ${label.toLowerCase()}s near you. Get free quotes and book online with TradeMojo.`,
    openGraph: {
      title: `${label}s in ${cityName} | TradeMojo`,
      description: `Find trusted ${label.toLowerCase()}s in ${cityName}. Compare reviews, get quotes, book online.`,
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
  const icon = tradeCategoryIcon(category);
  const cityName = formatLocation(location);
  const jsonLd = generateTradeCategoryLd(category, cityName);

  // TODO: Fetch real tradies from Supabase filtered by location
  // const { data: tradies } = await supabase.from('tradies')
  //   .select('*')
  //   .eq('trade_category', trade)
  //   .contains('service_areas', [cityName])
  //   .eq('is_active', true);

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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-3.5 h-3.5" />
            {cityName}
          </div>
          <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-5xl font-bold text-foreground mb-4">
            {icon} {label}s in {cityName}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-6">
            Find trusted, verified {label.toLowerCase()}s in {cityName} and
            surrounding suburbs. Read reviews, compare quotes, and book online.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-accent" />
              Licensed & Insured
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500" />
              Verified Reviews
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-primary" />
              Free Quotes
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder — no tradies yet */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface border border-border rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-3">
              {label}s in {cityName} Coming Soon
            </h2>
            <p className="text-muted max-w-lg mx-auto mb-6">
              We&apos;re signing up the best {label.toLowerCase()}s in{' '}
              {cityName}. Leave your details and we&apos;ll match you with a
              verified {label.toLowerCase()} as soon as one is available.
            </p>

            {/* Quick lead capture for pre-launch */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary"
                />
                <Button variant="primary" size="md">
                  Notify Me
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted mb-3">
                Are you a {label.toLowerCase()} in {cityName}?
              </p>
              <a href="/onboard">
                <Button variant="accent" size="md">
                  List Your Business — It&apos;s Free
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-4">
            About {label} Services in {cityName}
          </h2>
          <div className="prose prose-slate max-w-none text-muted">
            <p>
              Looking for a reliable {label.toLowerCase()} in {cityName}?
              TradeMojo connects you with licensed, insured, and reviewed{' '}
              {label.toLowerCase()}s serving {cityName} and surrounding areas.
            </p>
            <h3 className="text-foreground font-semibold text-lg mt-6 mb-2">
              Why Use TradeMojo to Find a {label} in {cityName}?
            </h3>
            <ul className="space-y-2">
              <li>
                <strong>Verified professionals</strong> — Every{' '}
                {label.toLowerCase()} on TradeMojo is checked for valid licenses
                and insurance.
              </li>
              <li>
                <strong>Real reviews</strong> — Read honest feedback from
                homeowners in {cityName} who&apos;ve used these{' '}
                {label.toLowerCase()}s.
              </li>
              <li>
                <strong>Instant quotes</strong> — Request a free quote directly
                through TradeMojo. No phone tag needed.
              </li>
              <li>
                <strong>Book online</strong> — Schedule an appointment at a time
                that works for you.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Browse other trades in this city */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-8 text-center">
            Other Trades in {cityName}
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {TRADE_CATEGORIES.filter((t) => t !== category && t !== 'other')
              .slice(0, 10)
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

      <Footer />
    </>
  );
}
