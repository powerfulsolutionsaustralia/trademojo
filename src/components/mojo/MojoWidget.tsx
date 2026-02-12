'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, Sparkles, MapPin, Phone, Star, Globe,
  ExternalLink, ChevronDown, Wrench,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────
interface MojoMessage {
  role: 'user' | 'mojo';
  content: string;
  tradies?: MojoTradieResult[];
  quickReplies?: string[];
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

// ─── Trade options for quick select ─────────────────────────
const POPULAR_TRADES = [
  { label: 'Plumber', value: 'plumber', emoji: '🔧' },
  { label: 'Electrician', value: 'electrician', emoji: '⚡' },
  { label: 'Builder', value: 'builder', emoji: '🏗️' },
  { label: 'Roofer', value: 'roofer', emoji: '🏠' },
  { label: 'Air Con', value: 'air_conditioning', emoji: '❄️' },
  { label: 'Solar', value: 'solar', emoji: '☀️' },
  { label: 'Painter', value: 'painter', emoji: '🎨' },
  { label: 'Landscaper', value: 'landscaper', emoji: '🌿' },
  { label: 'Tiler', value: 'tiler', emoji: '🔲' },
  { label: 'Carpenter', value: 'carpenter', emoji: '🪚' },
  { label: 'Fencer', value: 'fencer', emoji: '🏡' },
  { label: 'Pest Control', value: 'pest_control', emoji: '🐛' },
];

// ─── Component ──────────────────────────────────────────────
export default function MojoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MojoMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'idle' | 'trade' | 'location' | 'problem' | 'searching' | 'results'>('idle');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Start the conversation when opened for the first time
  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      startConversation();
    }
  };

  const startConversation = () => {
    setMessages([
      {
        role: 'mojo',
        content: "G'day! I'm Mojo. I'll help you find the right tradie.\n\nWhat kind of tradie do you need?",
        quickReplies: POPULAR_TRADES.map(t => `${t.emoji} ${t.label}`),
      },
    ]);
    setStep('trade');
  };

  const handleReset = () => {
    setMessages([]);
    setSelectedTrade('');
    setSelectedLocation('');
    setInput('');
    setStep('idle');
    startConversation();
  };

  // ─── Send message ───────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: MojoMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Step-based conversation
    if (step === 'trade') {
      // User selected/typed a trade
      const tradeLower = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
      const matched = POPULAR_TRADES.find(t =>
        tradeLower.includes(t.label.toLowerCase()) || tradeLower.includes(t.value.replace('_', ' '))
      );
      const tradeValue = matched?.value || tradeLower.replace(/\s+/g, '_');
      const tradeLabel = matched?.label || text.trim();
      setSelectedTrade(tradeValue);

      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: `${tradeLabel} — got it! 👍\n\nWhere are you? (Suburb, postcode, or city)`,
          quickReplies: ['Brisbane', 'Sydney', 'Melbourne', 'Gold Coast', 'Perth', 'Adelaide'],
        },
      ]);
      setStep('location');
      setIsLoading(false);
      return;
    }

    if (step === 'location') {
      setSelectedLocation(text.trim());

      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: `Nice, searching near ${text.trim()}.\n\nWhat's happening? (quick description helps me find the right person)`,
          quickReplies: ['Just need a quote', 'Emergency / urgent', 'Routine maintenance', 'New install'],
        },
      ]);
      setStep('problem');
      setIsLoading(false);
      return;
    }

    if (step === 'problem') {
      // Got all 3 pieces, do the search
      setStep('searching');
      try {
        const res = await fetch('/api/mojo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `I need a ${selectedTrade.replace(/_/g, ' ')} in ${selectedLocation}. ${text.trim()}`,
            trade: selectedTrade,
            location: selectedLocation,
            problem: text.trim(),
            history: [],
          }),
        });

        const data = await res.json();

        setMessages(prev => [
          ...prev,
          {
            role: 'mojo',
            content: data.message,
            tradies: data.tradies || [],
            quickReplies: data.tradies?.length > 0
              ? ['Search again', 'Different trade', 'Different area']
              : ['Try a different area', 'Try a different trade'],
          },
        ]);
        setStep('results');
      } catch {
        setMessages(prev => [
          ...prev,
          {
            role: 'mojo',
            content: "Sorry, I hit a snag searching. Give it another go!",
            quickReplies: ['Try again', 'Search again'],
          },
        ]);
        setStep('results');
      }
      setIsLoading(false);
      return;
    }

    // Results stage — handle follow-ups
    if (step === 'results') {
      const lower = text.toLowerCase();
      if (lower.includes('search again') || lower.includes('start over') || lower.includes('different trade')) {
        handleReset();
        setIsLoading(false);
        return;
      }
      if (lower.includes('different area') || lower.includes('different location')) {
        setMessages(prev => [
          ...prev,
          {
            role: 'mojo',
            content: 'No worries! Where else should I look?',
            quickReplies: ['Brisbane', 'Sydney', 'Melbourne', 'Gold Coast', 'Perth'],
          },
        ]);
        setStep('location');
        setIsLoading(false);
        return;
      }
    }

    // Fallback: send to API directly for freeform chat
    try {
      const res = await fetch('/api/mojo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text.trim(),
          history: messages.filter(m => !m.quickReplies || m.role === 'user').slice(-6),
        }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: data.message,
          tradies: data.tradies || [],
          quickReplies: data.tradies?.length > 0
            ? ['Search again', 'Different trade']
            : undefined,
        },
      ]);
      if (data.tradies?.length > 0) setStep('results');
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'mojo', content: "Something went wrong. Try again!" },
      ]);
    }
    setIsLoading(false);
  }, [step, selectedTrade, selectedLocation, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <>
      {/* ─── Floating Button (Desktop: bottom-right, Mobile: bottom center) ─── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-mojo text-white px-5 py-3.5 rounded-full shadow-xl shadow-mojo/30 hover:shadow-2xl hover:shadow-mojo/40 hover:scale-105 transition-all duration-200 group md:bottom-6 md:right-6"
          aria-label="Open Mojo assistant"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm">Ask Mojo</span>
        </button>
      )}

      {/* ─── Chat Panel ─── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:inset-auto md:bottom-6 md:right-6 md:w-[420px] md:h-[640px] md:max-h-[80vh] flex flex-col bg-white md:rounded-2xl md:shadow-2xl md:border md:border-border overflow-hidden animate-in">
          {/* Header */}
          <div className="bg-mojo text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm leading-tight">Mojo</div>
                <div className="text-[10px] text-white/60">AI Trade Assistant</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-white/15 transition-colors text-xs font-medium"
                title="New search"
              >
                <Wrench className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/15 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i}>
                {/* Message bubble */}
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-mojo text-white rounded-br-md'
                        : 'bg-white text-foreground border border-border rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.role === 'mojo' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-mojo" />
                        <span className="text-[10px] font-semibold text-mojo">Mojo</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>

                {/* Tradie Results */}
                {msg.tradies && msg.tradies.length > 0 && (
                  <div className="mt-2 space-y-2 pl-1">
                    {msg.tradies.map((tradie) => (
                      <div
                        key={tradie.id}
                        className="bg-white rounded-xl p-3 border border-border shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-foreground text-[13px] truncate">
                              {tradie.business_name}
                            </h4>
                            <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{tradie.short_description || `${tradie.suburb}, ${tradie.state}`}</span>
                            </p>
                          </div>
                          {tradie.average_rating > 0 && (
                            <div className="flex items-center gap-1 shrink-0">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-bold">{tradie.average_rating?.toFixed(1)}</span>
                              {tradie.review_count > 0 && (
                                <span className="text-[10px] text-muted">({tradie.review_count})</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-2">
                          {tradie.phone && (
                            <a
                              href={`tel:${tradie.phone.replace(/\s/g, '')}`}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary text-white rounded-lg text-[11px] font-semibold hover:bg-primary-dark transition-colors"
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
                              className="flex items-center justify-center gap-1 py-1.5 px-2.5 border border-border rounded-lg text-[11px] font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
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
                              className="flex items-center justify-center py-1.5 px-2 border border-border rounded-lg text-muted hover:border-primary hover:text-primary transition-colors"
                              title="Google Maps"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick replies */}
                {msg.quickReplies && msg.quickReplies.length > 0 && i === messages.length - 1 && !isLoading && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-1">
                    {msg.quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="text-[11px] px-3 py-1.5 bg-white border border-border rounded-full text-foreground hover:border-mojo hover:text-mojo transition-all cursor-pointer shadow-sm"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-mojo" />
                    <span className="text-[10px] font-semibold text-mojo">Mojo</span>
                  </div>
                  <div className="flex gap-1.5 py-0.5">
                    <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
                    <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
                    <div className="w-2 h-2 bg-mojo/40 rounded-full mojo-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-white px-3 py-3 shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  step === 'trade' ? 'Type a trade or tap one above...'
                    : step === 'location' ? 'Suburb, postcode, or city...'
                    : step === 'problem' ? "What's happening? e.g. 'leaking tap'"
                    : 'Ask Mojo anything...'
                }
                className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-mojo/20 border border-border transition-all placeholder:text-muted/60"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-mojo text-white flex items-center justify-center hover:bg-mojo-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-center mt-1.5">
              <span className="text-[9px] text-muted/50">Powered by TradeMojo</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
