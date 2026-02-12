'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Message {
  role: 'user' | 'mojo';
  content: string;
}

const suggestions = [
  'How can I get more 5-star reviews?',
  'Write a new hero headline for my site',
  'What services should I add?',
  'How are my leads this month?',
  'Help me write an about section',
  'Tips to convert more website visitors',
];

export default function MojoDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/mojo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, history: messages, context: 'dashboard' }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'mojo', content: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'mojo', content: "Sorry, I'm having trouble right now. Try again in a moment!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl">
      <div className="mb-4">
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-mojo" /> Ask Mojo
        </h1>
        <p className="text-muted text-sm">Your AI business assistant. Ask about your website, leads, or get marketing tips.</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-surface rounded-2xl border border-border overflow-y-auto p-4 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-mojo/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-mojo" />
            </div>
            <h2 className="font-semibold text-foreground mb-1">Hey! I&apos;m Mojo</h2>
            <p className="text-muted text-sm mb-6 max-w-sm">
              I can help with your website, marketing tips, lead conversion, and more. What can I help with?
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 bg-background border border-border rounded-full text-muted hover:text-mojo hover:border-mojo/30 transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-mojo/10 text-foreground rounded-bl-md'}`}>
              {msg.role === 'mojo' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-mojo" />
                  <span className="text-[10px] font-bold text-mojo uppercase">Mojo</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-mojo/10 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-mojo" />
                <span className="text-[10px] font-bold text-mojo uppercase">Mojo</span>
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

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Mojo anything about your business..."
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-mojo focus:border-transparent"
        />
        <Button type="submit" variant="mojo" size="md" disabled={!input.trim() || loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  );
}
