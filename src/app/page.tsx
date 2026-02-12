import Navbar from '@/components/directory/Navbar';
import MojoSearch from '@/components/directory/MojoSearch';
import TradeCategories from '@/components/directory/TradeCategories';
import HowItWorks from '@/components/directory/HowItWorks';
import TradieCTA from '@/components/directory/TradieCTA';
import Footer from '@/components/directory/Footer';
import { MapPin } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-mojo/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-mojo/5 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-mojo/10 text-mojo px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <MapPin className="w-3.5 h-3.5" />
            Serving all of Australia
          </div>

          <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Find a Trusted{' '}
            <span className="text-primary">Tradie</span>
            <br />
            <span className="text-mojo">Near You</span>
          </h1>

          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Tell Mojo what you need and get matched with verified, reviewed
            tradespeople in your area. It&apos;s like having a mate who knows
            every tradie in town.
          </p>

          <MojoSearch />

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★★★★★</span>
              <span>Verified Reviews</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div>Licensed &amp; Insured</div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div>Free to Search</div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div>AI-Powered Matching</div>
          </div>
        </div>
      </section>

      {/* Trade Categories */}
      <div id="trades">
        <TradeCategories />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Popular Locations - SEO */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-3 text-center">
            Popular Locations
          </h2>
          <p className="text-muted text-lg text-center mb-10">
            Find tradies in major cities and suburbs across Australia
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              'Sydney',
              'Melbourne',
              'Brisbane',
              'Perth',
              'Adelaide',
              'Gold Coast',
              'Canberra',
              'Newcastle',
              'Sunshine Coast',
              'Wollongong',
              'Hobart',
              'Geelong',
              'Townsville',
              'Cairns',
              'Darwin',
              'Toowoomba',
              'Ballarat',
              'Bendigo',
            ].map((city) => (
              <a
                key={city}
                href={`/location/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-muted" />
                {city}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tradie CTA */}
      <TradieCTA />

      {/* Footer */}
      <Footer />
    </>
  );
}
