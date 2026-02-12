import { Zap, Globe, BarChart3, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TradieCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary-dark to-secondary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-bold text-white mb-4">
          Are You a Tradie?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Get a professional lead-gen website in under 60 seconds. Start
          receiving quote requests, bookings, and 5-star Google reviews today.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { icon: <Zap className="w-6 h-6" />, label: '60-Second Setup' },
            { icon: <Globe className="w-6 h-6" />, label: 'Your Own Website' },
            { icon: <BarChart3 className="w-6 h-6" />, label: 'Lead Dashboard' },
            { icon: <Star className="w-6 h-6" />, label: 'Review Funnel' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 text-white/90"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/onboard">
            <Button
              variant="accent"
              size="lg"
              className="text-white shadow-2xl shadow-accent/30"
            >
              Get Your Website Now — Free to Start
            </Button>
          </a>
          <a href="/pricing">
            <Button
              variant="ghost"
              size="lg"
              className="text-white border-2 border-white/30 hover:bg-white/10"
            >
              View Pricing
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
