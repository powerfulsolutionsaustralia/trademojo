'use client';

import Button from '@/components/ui/Button';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-base">T</span>
            </div>
            <span className="font-[family-name:var(--font-outfit)] text-lg font-bold text-foreground">
              Trade<span className="text-primary">Mojo</span>
            </span>
          </a>

          {/* Single CTA */}
          <a href="/for-tradies">
            <Button variant="primary" size="sm">
              List Your Business
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
