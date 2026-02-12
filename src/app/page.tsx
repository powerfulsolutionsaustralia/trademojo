import Navbar from '@/components/directory/Navbar';
import MojoSearch from '@/components/directory/MojoSearch';
import TradeCategories from '@/components/directory/TradeCategories';
import Footer from '@/components/directory/Footer';
import { MapPin, Search, Phone, Star, Shield, ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section — Clean, search-focused */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-mojo/5 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Find a Tradie{' '}
            <span className="text-primary">You Can Trust</span>
          </h1>

          <p className="text-muted text-lg max-w-xl mx-auto mb-8">
            Search real businesses with real reviews. Call directly, visit their
            website, or ask Mojo to find the right tradie for you.
          </p>

          <MojoSearch />

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              <span>Powered by Google</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Real Reviews</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              <span>Call Directly</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-mojo" />
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Categories */}
      <div id="trades">
        <TradeCategories />
      </div>

      {/* How It Works — Simplified */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            How It Works
          </h2>
          <p className="text-muted text-center mb-10">
            Find the right tradie in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Search or Ask Mojo',
                desc: 'Type what you need — like "plumber in Brisbane" — or browse by trade category.',
                color: 'text-mojo bg-mojo/10',
              },
              {
                num: '2',
                icon: <Users className="w-6 h-6" />,
                title: 'Compare Results',
                desc: 'See real businesses with Google ratings, reviews, phone numbers, and websites.',
                color: 'text-primary bg-primary/10',
              },
              {
                num: '3',
                icon: <Phone className="w-6 h-6" />,
                title: 'Call or Visit',
                desc: 'Call the tradie directly, check their website, or view their location on Google Maps.',
                color: 'text-accent bg-accent/10',
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}>
                  {step.icon}
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-2 text-center">
            Browse by Location
          </h2>
          <p className="text-muted text-center mb-8">
            Find tradies in major cities across Australia
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
              'Gold Coast', 'Canberra', 'Newcastle', 'Sunshine Coast',
              'Wollongong', 'Hobart', 'Geelong', 'Townsville', 'Cairns',
              'Darwin', 'Toowoomba', 'Ballarat', 'Bendigo',
            ].map((city) => (
              <a
                key={city}
                href={`/plumber/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"
              >
                <MapPin className="w-3 h-3 text-muted" />
                {city}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* For Tradies CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-secondary to-secondary/90">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-white mb-4">
                Are You a Tradie?
              </h2>
              <p className="text-white/70 text-base mb-6 leading-relaxed">
                TradeMojo builds you a professional website in under 60 seconds.
                Get a lead-gen page, booking system, review funnel, and client
                dashboard — all included.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Your own website with lead capture form',
                  'Online booking for your customers',
                  'Automated Google review requests',
                  'Dashboard to manage leads & bookings',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                    <Zap className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/for-tradies">
                  <Button variant="primary" size="lg">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
                <a href="/onboard">
                  <Button variant="ghost" size="lg" className="text-white border border-white/20 hover:bg-white/10">
                    Get Started Free
                  </Button>
                </a>
              </div>
            </div>

            {/* Visual representation */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="bg-white rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Mike&apos;s Plumbing</div>
                      <div className="text-xs text-muted">Brisbane, QLD</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-surface rounded-lg py-2">
                      <div className="text-lg font-bold text-primary">47</div>
                      <div className="text-[10px] text-muted">Leads</div>
                    </div>
                    <div className="bg-surface rounded-lg py-2">
                      <div className="text-lg font-bold text-accent">4.9</div>
                      <div className="text-[10px] text-muted">Rating</div>
                    </div>
                    <div className="bg-surface rounded-lg py-2">
                      <div className="text-lg font-bold text-mojo">23</div>
                      <div className="text-[10px] text-muted">Bookings</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/50 text-center">
                  Example tradie dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
