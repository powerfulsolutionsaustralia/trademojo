'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Send, MapPin, Phone, Star, Globe, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

interface MojoMessage {
  role: 'user' | 'mojo';
  content: string;
  tradies?: MojoTradieResult[];
}

interface MojoTradieResult {
  id: string;
  business_name: string;
  slug: string;
  trade_category: string;
  short_description: string;
  average_rating: number;
  review_count: number;
  suburb: string;
  state: string;
  phone?: string;
  website?: string;
  place_id?: string;
}

export default function MojoSearch() {
  const [query, setQuery] = useState('');
  const [isChat, setIsChat] = useState(false);
  const [messages, setMessages] = useState<MojoMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsChat(true);
    const userMessage = query.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/mojo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage, history: messages }),
      });

      if (!res.ok) throw new Error('Failed to search');

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'mojo',
          content: data.message,
          tradies: data.tradies || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'mojo',
          content:
            "Sorry, I'm having trouble searching right now. Try using the category search below, or give me another go in a moment!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQueries = [
    'I need a plumber in Brisbane urgently',
    'Looking for an electrician in Sydney CBD',
    'Best rated roofer near me in Melbourne',
    'Who can build a deck in Gold Coast?',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Mojo Branding */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-mojo flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-mojo">
          Ask Mojo
        </span>
        <span className="text-muted text-sm">
          — AI-powered trade search
        </span>
      </div>

      {/* Chat Messages */}
      {isChat && (
        <div className="bg-surface rounded-2xl border border-border mb-4 max-h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-mojo/10 text-foreground rounded-bl-md'
                }`}
              >
                {msg.role === 'mojo' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-mojo" />
                    <span className="text-xs font-semibold text-mojo">
                      Mojo
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Tradie Results Cards */}
                {msg.tradies && msg.tradies.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.tradies.map((tradie) => (
                      <div
                        key={tradie.id}
                        className="bg-white rounded-xl p-3 border border-border shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-foreground text-sm truncate">
                              {tradie.business_name}
                            </h4>
                            <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{tradie.short_description || `${tradie.suburb}, ${tradie.state}`}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs shrink-0">
                            {tradie.average_rating > 0 ? (
                              <>
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">
                                  {tradie.average_rating?.toFixed(1)}
                                </span>
                                {tradie.review_count > 0 && (
                                  <span className="text-muted">
                                    ({tradie.review_count})
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-muted">New</span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-2.5">
                          {tradie.phone && (
                            <a
                              href={`tel:${tradie.phone.replace(/\s/g, '')}`}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                            >
                              <Phone className="w-3 h-3" />
                              Call
                            </a>
                          )}
                          {tradie.website && (
                            <a
                              href={tradie.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 py-1.5 px-3 border border-border rounded-lg text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                            >
                              <Globe className="w-3 h-3" />
                              Website
                            </a>
                          )}
                          {tradie.place_id && (
                            <a
                              href={`https://www.google.com/maps/place/?q=place_id:${tradie.place_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center py-1.5 px-2 border border-border rounded-lg text-xs text-muted hover:border-primary hover:text-primary transition-colors"
                              title="View on Google Maps"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {/* Fallback for tradies from our DB with slugs */}
                          {!tradie.place_id && tradie.slug && (
                            <a
                              href={`/t/${tradie.slug}`}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent/90 transition-colors"
                            >
                              View Profile
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-mojo/10 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-mojo" />
                  <span className="text-xs font-semibold text-mojo">Mojo</span>
                </div>
                <div className="flex gap-1.5 py-1">
                  <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
                  <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
                  <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center bg-surface rounded-2xl border-2 border-border hover:border-mojo/50 focus-within:border-mojo focus-within:shadow-lg focus-within:shadow-mojo/10 transition-all duration-200">
          <div className="pl-5">
            <Search className="w-5 h-5 text-muted" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Mojo... e.g. 'I need a plumber in Brisbane'"
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-muted/60"
          />
          <div className="pr-3">
            <Button
              type="submit"
              variant="mojo"
              size="sm"
              disabled={!query.trim() || isLoading}
              className="rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Suggested Queries */}
      {!isChat && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {suggestedQueries.map((sq) => (
            <button
              key={sq}
              onClick={() => {
                setQuery(sq);
                inputRef.current?.focus();
              }}
              className="text-xs px-3 py-1.5 bg-surface border border-border rounded-full text-muted hover:text-mojo hover:border-mojo/30 transition-all cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
