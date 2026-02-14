'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Star, Shield, Zap, ArrowRight, MessageCircle } from 'lucide-react';
import Image from 'next/image';
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  // Scroll chat container (NOT page) when new messages arrive
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

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
  const chatMessages = messages.slice(1); // skip the initial greeting in messages array

  // Dynamic placeholder based on step
  const inputPlaceholder = showTypewriter
    ? placeholder + '|'
    : step === 'trade'
      ? 'e.g. plumber in Brisbane, solar on the coast...'
      : step === 'location'
        ? 'Suburb, postcode, or city...'
        : 'Ask Mojo anything...';

  return (
    <section id="mojo-hero" className="relative pt-8 pb-12 md:pt-12 md:pb-16 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-mojo/5 via-primary/3 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        {/* ═══ IDLE STATE — Hero layout ═══ */}
        {!hasConversation && (
          <div className="text-center">
            {/* Mascot */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 md:w-28 md:h-28 relative">
                <Image
                  src="/mojo.png"
                  alt="Mojo"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              Meet <span className="text-mojo">Mojo</span> — Your Tradie Finder
            </h1>
            <p className="text-muted text-base md:text-lg mb-8 max-w-lg mx-auto">
              Tell Mojo what you need and where — it&apos;ll find the top-rated tradies with real reviews and contact details.
            </p>

            {/* Search input */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="relative flex items-center bg-white border-2 border-mojo/20 rounded-2xl shadow-lg hover:border-mojo/40 focus-within:border-mojo/60 focus-within:shadow-xl transition-all">
                <div className="pl-4 pr-2">
                  <MessageCircle className="w-5 h-5 text-mojo" />
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

            {/* Quick chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
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
          </div>
        )}

        {/* ═══ CHATTING STATE — Compact chat card ═══ */}
        {hasConversation && (
          <div className="bg-white rounded-2xl shadow-lg border border-border/40 overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/40 bg-gradient-to-r from-mojo/5 to-transparent">
              <div className="w-8 h-8 relative flex-shrink-0">
                <Image
                  src="/mojo.png"
                  alt="Mojo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold text-foreground leading-tight">Mojo</h2>
                <p className="text-[10px] text-muted leading-tight">Tradie Finder</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-muted">Online</span>
              </div>
            </div>

            {/* Messages area — scrolls internally, page stays put */}
            <div
              ref={messagesContainerRef}
              className="max-h-[35vh] min-h-[120px] overflow-y-auto px-4 py-3 space-y-2.5 bg-gray-50/50"
            >
              {chatMessages.map((msg, i) => (
                <div key={i}>
                  {/* Message bubble */}
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'mojo' && (
                      <div className="w-6 h-6 relative flex-shrink-0 mr-2 mt-1">
                        <Image src="/mojo.png" alt="" width={24} height={24} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-mojo text-white rounded-br-sm'
                          : 'bg-white text-foreground border border-border/60 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>

                  {/* Quick replies (only on last mojo message) */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && i === chatMessages.length - 1 && !isLoading && (
                    <div className="ml-8 mt-1.5">
                      <MojoQuickReplies replies={msg.quickReplies} onReply={sendMessage} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 relative flex-shrink-0 mr-2 mt-1">
                    <Image src="/mojo.png" alt="" width={24} height={24} className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-white border border-border/60 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-mojo/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-mojo/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-mojo/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input — pinned at bottom */}
            <div className="border-t border-border/40 bg-white px-3 py-2.5">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="flex-1 py-2 px-3 text-foreground placeholder:text-muted/40 bg-gray-50 rounded-xl outline-none text-sm border border-border/40 focus:border-mojo/40 transition-colors"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-mojo text-white rounded-xl hover:bg-mojo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

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
