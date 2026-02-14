import Navbar from '@/components/directory/Navbar';
import MojoInlineChat from '@/components/mojo/MojoInlineChat';
import LocationAwareTradeButtons from '@/components/mojo/LocationAwareTradeButtons';
import Footer from '@/components/directory/Footer';
import { MapPin, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const POPULAR_LOCATIONS = [
  { city: 'Sydney', state: 'NSW' },
  { city: 'Melbourne', state: 'VIC' },
  { city: 'Brisbane', state: 'QLD' },
  { city: 'Perth', state: 'WA' },
  { city: 'Adelaide', state: 'SA' },
  { city: 'Gold Coast', state: 'QLD' },
  { city: 'Canberra', state: 'ACT' },
  { city: 'Newcastle', state: 'NSW' },
  { city: 'Sunshine Coast', state: 'QLD' },
  { city: 'Wollongong', state: 'NSW' },
  { city: 'Hobart', state: 'TAS' },
  { city: 'Geelong', state: 'VIC' },
  { city: 'Townsville', state: 'QLD' },
  { city: 'Cairns', state: 'QLD' },
  { city: 'Darwin', state: 'NT' },
  { city: 'Toowoomba', state: 'QLD' },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero — Mojo inline chat */}
      <MojoInlineChat />

      {/* Browse by Trade — Location-aware */}
      <LocationAwareTradeButtons />

      {/* Browse by Location */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-6">
            Browse by Location
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {POPULAR_LOCATIONS.map(({ city, state }) => (
              <a
                key={city}
                href={`/plumber/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between px-4 py-3 bg-white border border-border rounded-xl hover:border-primary hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{city}</span>
                </div>
                <span className="text-[10px] text-muted">{state}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* For Tradies — Compact CTA */}
      <section className="py-12 px-4 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-3">
            Are you a tradie?
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-lg mx-auto">
            Get a professional website with lead capture, bookings, and automated Google reviews — set up in under 60 seconds.
          </p>
          <a href="/for-tradies">
            <Button variant="primary" size="lg">
              Learn More <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
