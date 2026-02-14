'use client';

import Button from '@/components/ui/Button';
import MojoLogo from '@/components/ui/MojoLogo';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="/">
            <MojoLogo size="sm" />
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
