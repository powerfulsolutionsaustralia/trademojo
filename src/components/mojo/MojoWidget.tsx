'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMojoChat } from '@/hooks/useMojoChat';
import MojoChatBubble from './MojoChatBubble';
import MojoTradieCard from './MojoTradieCard';
import MojoQuickReplies from './MojoQuickReplies';
import MojoLoadingDots from './MojoLoadingDots';

export default function MojoWidget() {
  const pathname = usePathname();

  // Don't render on homepage — inline chat handles it there
  if (pathname === '/') return null;

  return <MojoWidgetInner />;
}

function MojoWidgetInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);

  const {
    messages,
    input,
    setInput,
    isLoading,
    step,
    sendMessage,
    handleReset,
    startConversation,
  } = useMojoChat();

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

  // Listen for mojo-search events from other components
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.query) {
        setIsOpen(true);
        if (messages.length === 0) {
          startConversation();
        }
        setPendingSearch(detail.query);
      }
    };
    window.addEventListener('mojo-search', handler);
    return () => window.removeEventListener('mojo-search', handler);
  }, [messages.length, startConversation]);

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      startConversation();
    }
  };

  // Process pending search
  useEffect(() => {
    if (pendingSearch && isOpen && messages.length > 0) {
      const timer = setTimeout(() => {
        sendMessage(pendingSearch);
        setPendingSearch(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingSearch, isOpen, messages.length, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* ─── Floating Button ─── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-mojo text-white pl-3 pr-5 py-2.5 rounded-full shadow-xl shadow-mojo/30 hover:shadow-2xl hover:shadow-mojo/40 hover:scale-105 transition-all duration-200 group md:bottom-6 md:right-6"
          aria-label="Open Mojo assistant"
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors overflow-hidden">
            <img src="/mojo.png" alt="Mojo" className="w-full h-full object-cover" />
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
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img src="/mojo.png" alt="Mojo" className="w-full h-full object-cover" />
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
                <MojoChatBubble role={msg.role} content={msg.content} />

                {msg.tradies && msg.tradies.length > 0 && (
                  <div className="mt-2 space-y-2 pl-1">
                    {msg.tradies.map((tradie) => (
                      <MojoTradieCard key={tradie.id} tradie={tradie} />
                    ))}
                  </div>
                )}

                {msg.quickReplies && msg.quickReplies.length > 0 && i === messages.length - 1 && !isLoading && (
                  <MojoQuickReplies replies={msg.quickReplies} onReply={sendMessage} />
                )}
              </div>
            ))}

            {isLoading && <MojoLoadingDots />}
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
                  step === 'trade' ? "e.g. plumber in Brisbane, solar on the coast..."
                    : step === 'location' ? 'Suburb, postcode, or city...'
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
