import { Zap, Globe, BarChart3, Star, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TradieCTA() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-bold text-white mb-4">
          Grow Your Trade Business
        </h2>
        <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
          TradeMojo gives you a professional website, lead capture, bookings, and
          automated review requests — set up in under 60 seconds.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: <Zap className="w-5 h-5" />, label: '60-Second Setup' },
            { icon: <Globe className="w-5 h-5" />, label: 'Your Own Website' },
            { icon: <BarChart3 className="w-5 h-5" />, label: 'Lead Dashboard' },
            { icon: <Star className="w-5 h-5" />, label: 'Review Funnel' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-white/90">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/for-tradies">
            <Button variant="accent" size="lg" className="text-white">
              Learn More <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
          <a href="/onboard">
            <Button variant="ghost" size="lg" className="text-white border-2 border-white/30 hover:bg-white/10">
              Get Started Free
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
