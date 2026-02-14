'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import MojoMascot from './MojoMascot';

const EXAMPLE_QUERIES = [
  'I need a plumber in Brisbane',
  'Find an electrician near Gold Coast',
  'Roof repair in Sydney',
  'Hot water system installer Melbourne',
  'Solar panels Sunshine Coast',
];

export default function MojoHero() {
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    const example = EXAMPLE_QUERIES[exampleIdx];

    if (isTyping) {
      if (charIdx < example.length) {
        const timer = setTimeout(() => {
          setPlaceholder(example.slice(0, charIdx + 1));
          setCharIdx(charIdx + 1);
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Pause at end
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      // Delete
      if (charIdx > 0) {
        const timer = setTimeout(() => {
          setPlaceholder(example.slice(0, charIdx - 1));
          setCharIdx(charIdx - 1);
        }, 30);
        return () => clearTimeout(timer);
      } else {
        // Move to next example
        setExampleIdx((exampleIdx + 1) % EXAMPLE_QUERIES.length);
        setIsTyping(true);
      }
    }
  }, [charIdx, exampleIdx, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Dispatch custom event that MojoWidget listens for
    window.dispatchEvent(
      new CustomEvent('mojo-search', { detail: { query: query.trim() } })
    );
    setQuery('');
  };

  const handleQuickSearch = (q: string) => {
    window.dispatchEvent(
      new CustomEvent('mojo-search', { detail: { query: q } })
    );
  };

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-mojo/5 via-primary/3 to-transparent pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-primary/5 blur-2xl" />
      <div className="absolute top-40 right-[15%] w-24 h-24 rounded-full bg-mojo/5 blur-3xl" />
      <div className="absolute bottom-20 left-[20%] w-20 h-20 rounded-full bg-accent/5 blur-2xl" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Mojo Mascot */}
        <div className="flex justify-center mb-6">
          <MojoMascot size="xl" />
        </div>

        {/* Headlines */}
        <div className="mb-2 inline-flex items-center gap-2 bg-mojo/10 text-mojo text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by AI
        </div>

        <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
          Meet <span className="text-mojo">Mojo</span> — Your AI Tradie Finder
        </h1>
        <p className="text-muted text-base md:text-lg mb-8 max-w-lg mx-auto">
          Tell Mojo what you need and where — it&apos;ll find the top-rated tradies with real reviews and contact details.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-6">
          <div className="relative flex items-center bg-white border-2 border-mojo/20 rounded-2xl shadow-lg hover:border-mojo/40 focus-within:border-mojo/60 focus-within:shadow-xl transition-all">
            <div className="pl-4 pr-2">
              <Sparkles className="w-5 h-5 text-mojo" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder + '|'}
              className="flex-1 py-4 px-2 text-foreground placeholder:text-muted/40 bg-transparent outline-none text-base"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="mr-2 p-3 bg-mojo text-white rounded-xl hover:bg-mojo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Quick search chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { label: '🔧 Plumber', query: 'I need a plumber' },
            { label: '⚡ Electrician', query: 'Find an electrician' },
            { label: '☀️ Solar', query: 'Solar panel installer' },
            { label: '🏠 Roofer', query: 'Roof repair specialist' },
            { label: '❄️ Air Con', query: 'Air conditioning installer' },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleQuickSearch(chip.query)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-full text-sm font-medium text-foreground hover:border-mojo hover:text-mojo hover:shadow-sm transition-all cursor-pointer"
            >
              {chip.label}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>

        {/* Trust line */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            Real Google Reviews
          </div>
          <span className="text-border">·</span>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-accent" />
            Verified Businesses
          </div>
          <span className="text-border">·</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            100% Free
          </div>
        </div>
      </div>
    </section>
  );
}
