'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Star, Shield, Zap, ArrowRight } from 'lucide-react';
import MojoMascot from './MojoMascot';
import MojoChatBubble from './MojoChatBubble';
import MojoQuickReplies from './MojoQuickReplies';
import MojoLoadingDots from './MojoLoadingDots';
import { useMojoChat, POPULAR_TRADE_CHIPS } from '@/hooks/useMojoChat';

const EXAMPLE_QUERIES = [
  'I need a plumber in Brisbane',
  'Find an electrician near Gold Coast',
  'Roof repair in Sydney',
  'Hot water system installer Melbourne',
  'Solar panels Sunshine Coast',
];

export default function MojoInlineChat() {
  const [placeholder, setPlaceholder] = useState('');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    setInput,
    isLoading,
    step,
    sendMessage,
  } = useMojoChat({ autoStart: true });

  // Typewriter effect for placeholder (only when no conversation started)
  const showTypewriter = messages.length <= 1 && !input;

  useEffect(() => {
    if (!showTypewriter) return;

    const example = EXAMPLE_QUERIES[exampleIdx];

    if (isTyping) {
      if (charIdx < example.length) {
        const timer = setTimeout(() => {
          setPlaceholder(example.slice(0, charIdx + 1));
          setCharIdx(charIdx + 1);
        }, 50);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (charIdx > 0) {
        const timer = setTimeout(() => {
          setPlaceholder(example.slice(0, charIdx - 1));
          setCharIdx(charIdx - 1);
        }, 30);
        return () => clearTimeout(timer);
      } else {
        setExampleIdx((exampleIdx + 1) % EXAMPLE_QUERIES.length);
        setIsTyping(true);
      }
    }
  }, [charIdx, exampleIdx, isTyping, showTypewriter]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Listen for mojo-trade-selected events from LocationAwareTradeButtons
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.trade) {
        const heroEl = document.getElementById('mojo-hero');
        if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
          sendMessage(detail.trade);
          inputRef.current?.focus();
        }, 400);
      }
    };
    window.addEventListener('mojo-trade-selected', handler);
    return () => window.removeEventListener('mojo-trade-selected', handler);
  }, [sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
  };

  const hasConversation = messages.length > 1;

  // Dynamic placeholder based on step
  const inputPlaceholder = showTypewriter
    ? placeholder + '|'
    : step === 'trade'
      ? 'e.g. plumber in Brisbane, solar on the coast...'
      : step === 'location'
        ? 'Suburb, postcode, or city...'
        : 'Ask Mojo anything...';

  return (
    <section id="mojo-hero" className="relative pt-8 pb-12 md:pt-12 md:pb-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-mojo/5 via-primary/3 to-transparent pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-primary/5 blur-2xl" />
      <div className="absolute top-40 right-[15%] w-24 h-24 rounded-full bg-mojo/5 blur-3xl" />
      <div className="absolute bottom-20 left-[20%] w-20 h-20 rounded-full bg-accent/5 blur-2xl" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Mojo Mascot — shrinks when chatting */}
        <div className={`flex justify-center transition-all duration-300 ${hasConversation ? 'mb-3' : 'mb-6'}`}>
          <MojoMascot size={hasConversation ? 'md' : 'xl'} />
        </div>

        {/* Headlines — collapse when chatting */}
        {!hasConversation && (
          <>
            <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              Meet <span className="text-mojo">Mojo</span> — Your Tradie Finder
            </h1>
            <p className="text-muted text-base md:text-lg mb-8 max-w-lg mx-auto">
              Tell Mojo what you need and where — it&apos;ll find the top-rated tradies with real reviews and contact details.
            </p>
          </>
        )}

        {/* Compact header when chatting */}
        {hasConversation && (
          <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-foreground mb-4">
            <span className="text-mojo">Mojo</span> — Tradie Finder
          </h2>
        )}

        {/* ─── Chat Card ─── */}
        {/* Contains: messages (scrollable) + input (pinned bottom) */}
        <div className="max-w-xl mx-auto">
          {hasConversation ? (
            <div className="bg-white rounded-2xl shadow-lg border border-border/60 overflow-hidden flex flex-col">
              {/* Messages area — scrolls internally */}
              <div className="max-h-[40vh] overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/30">
                {messages.slice(1).map((msg, i) => (
                  <div key={i}>
                    <MojoChatBubble role={msg.role} content={msg.content} />

                    {msg.quickReplies && msg.quickReplies.length > 0 && i === messages.slice(1).length - 1 && !isLoading && (
                      <MojoQuickReplies replies={msg.quickReplies} onReply={sendMessage} />
                    )}
                  </div>
                ))}

                {isLoading && <MojoLoadingDots />}
                <div ref={chatEndRef} />
              </div>

              {/* Input — pinned at bottom of card */}
              <div className="border-t border-border/60 bg-white px-3 py-3">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <div className="pl-2">
                    <Sparkles className="w-4 h-4 text-mojo/60" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={inputPlaceholder}
                    className="flex-1 py-2.5 px-2 text-foreground placeholder:text-muted/40 bg-transparent outline-none text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 bg-mojo text-white rounded-xl hover:bg-mojo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Initial state — big search input + quick chips */
            <>
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="relative flex items-center bg-white border-2 border-mojo/20 rounded-2xl shadow-lg hover:border-mojo/40 focus-within:border-mojo/60 focus-within:shadow-xl transition-all">
                  <div className="pl-4 pr-2">
                    <Sparkles className="w-5 h-5 text-mojo" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={inputPlaceholder}
                    className="flex-1 py-4 px-2 text-foreground placeholder:text-muted/40 bg-transparent outline-none text-base"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="mr-2 p-3 bg-mojo text-white rounded-xl hover:bg-mojo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Quick search chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {POPULAR_TRADE_CHIPS.slice(0, 5).map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => sendMessage(`${chip.emoji} ${chip.label}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-full text-sm font-medium text-foreground hover:border-mojo hover:text-mojo hover:shadow-sm transition-all cursor-pointer"
                  >
                    {chip.emoji} {chip.label}
                    <ArrowRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Trust line */}
        <div className={`flex flex-wrap items-center justify-center gap-4 text-xs text-muted ${hasConversation ? 'mt-4' : 'mt-0'}`}>
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
