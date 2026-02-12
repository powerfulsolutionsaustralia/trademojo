import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-[family-name:var(--font-outfit)] text-xl font-bold">
                Trade<span className="text-primary">Mojo</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Australia&apos;s smartest trade directory. Powered by Mojo AI.
            </p>
          </div>

          {/* For Consumers */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Find a Tradie</h4>
            <ul className="space-y-2">
              {['Plumber', 'Electrician', 'Builder', 'Painter', 'Roofer', 'Solar'].map(
                (trade) => (
                  <li key={trade}>
                    <a
                      href={`/${trade.toLowerCase()}`}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {trade}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* For Tradies */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">For Tradies</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/for-tradies"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Get Your Website
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/onboard"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  List Your Business
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} TradeMojo Pty Ltd. All rights reserved.
            ABN coming soon.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <Sparkles className="w-3 h-3" />
            Powered by Mojo AI
          </div>
        </div>
      </div>
    </footer>
  );
}
