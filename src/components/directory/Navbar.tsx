'use client';

import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground">
              Trade<span className="text-primary">Mojo</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/#trades"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Find a Tradie
            </a>
            <a
              href="/for-tradies"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              For Tradies
            </a>
            <a
              href="/pricing"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </a>
            <a href="/onboard">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                List Your Trade
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-border/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            <a
              href="/#trades"
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-border/50 rounded-lg"
            >
              Find a Tradie
            </a>
            <a
              href="/for-tradies"
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-border/50 rounded-lg"
            >
              For Tradies
            </a>
            <a
              href="/pricing"
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-border/50 rounded-lg"
            >
              Pricing
            </a>
            <div className="flex gap-2 pt-2">
              <a href="/dashboard" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Dashboard
                </Button>
              </a>
              <a href="/onboard" className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  List Your Trade
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
