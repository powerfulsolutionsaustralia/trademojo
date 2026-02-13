'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, Sparkles, MapPin, Phone, Star, Globe,
  ExternalLink, Wrench,
} from 'lucide-react';
import { TRADE_GROUPS, tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';

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

// ─── All trades flat list for matching ─────────────────────────
const ALL_TRADES = TRADE_GROUPS.flatMap(g =>
  g.trades.map(t => ({
    value: t,
    label: tradeCategoryLabel(t),
    keywords: [
      t.replace(/_/g, ' '),
      tradeCategoryLabel(t).toLowerCase(),
      // Extra keywords for fuzzy matching
      ...(t === 'solar' ? ['solar', 'solar panel', 'solar system', 'solar guy'] : []),
      ...(t === 'plumber' ? ['plumbing', 'pipes', 'tap', 'taps', 'toilet', 'leaking'] : []),
      ...(t === 'electrician' ? ['electrical', 'power', 'wiring', 'lights', 'light'] : []),
      ...(t === 'air_conditioning' ? ['aircon', 'ac', 'air con', 'hvac', 'cooling', 'heating'] : []),
      ...(t === 'roofer' ? ['roof', 'roofing', 'roof leak', 'gutters'] : []),
      ...(t === 'painter' ? ['painting', 'paint'] : []),
      ...(t === 'landscaper' ? ['landscaping', 'garden', 'yard'] : []),
      ...(t === 'builder' ? ['building', 'construction', 'renovate', 'renovation', 'reno'] : []),
      ...(t === 'cleaning' ? ['cleaner', 'cleaning', 'house clean', 'end of lease'] : []),
      ...(t === 'pest_control' ? ['pest', 'termite', 'termites', 'cockroach', 'ants', 'spider'] : []),
      ...(t === 'handyman' ? ['handy man', 'odd jobs', 'fix', 'repair'] : []),
      ...(t === 'locksmith' ? ['lock', 'keys', 'locked out'] : []),
      ...(t === 'pool_builder' ? ['pool', 'swimming pool'] : []),
      ...(t === 'tiler' ? ['tiles', 'tiling', 'tile'] : []),
      ...(t === 'carpenter' ? ['carpentry', 'wood', 'timber'] : []),
      ...(t === 'concreter' ? ['concrete', 'slab', 'driveway'] : []),
      ...(t === 'fencer' ? ['fence', 'fencing'] : []),
      ...(t === 'glazier' ? ['glass', 'window', 'windows'] : []),
      ...(t === 'demolition' ? ['demo', 'demolish', 'knock down'] : []),
      ...(t === 'earthmoving' ? ['excavation', 'excavator', 'dig'] : []),
      ...(t === 'hot_water_systems' ? ['hot water', 'water heater'] : []),
      ...(t === 'water_filtration' ? ['water filter', 'filtered water', 'water purifier'] : []),
      ...(t === 'appliance_repair' ? ['appliance', 'washing machine', 'dishwasher', 'fridge', 'oven', 'dryer'] : []),
      ...(t === 'garage_doors' ? ['garage door', 'roller door'] : []),
      ...(t === 'flooring' ? ['floor', 'floors', 'timber floor', 'floorboards'] : []),
      ...(t === 'carpet_cleaning' ? ['carpet', 'carpet clean', 'steam clean'] : []),
      ...(t === 'bathroom_renovator' ? ['bathroom', 'bathroom reno'] : []),
      ...(t === 'kitchen_renovator' ? ['kitchen', 'kitchen reno'] : []),
      ...(t === 'tree_lopper' ? ['tree', 'tree removal', 'arborist', 'tree cutting'] : []),
      ...(t === 'antenna_specialist' ? ['antenna', 'tv antenna', 'tv reception'] : []),
      ...(t === 'gutter_specialist' ? ['gutter', 'gutters', 'gutter clean'] : []),
      ...(t === 'security_systems' ? ['security', 'cctv', 'alarm', 'camera'] : []),
      ...(t === 'data_cabling' ? ['data cable', 'network', 'ethernet'] : []),
      ...(t === 'plasterer' ? ['plaster', 'plastering', 'gyprocking'] : []),
      ...(t === 'bricklayer' ? ['brick', 'bricks', 'brickwork'] : []),
      ...(t === 'cabinet_maker' ? ['cabinet', 'cabinets', 'cabinetry', 'joinery'] : []),
      ...(t === 'renderer' ? ['render', 'rendering'] : []),
      ...(t === 'cladding' ? ['cladding', 'wall cladding'] : []),
      ...(t === 'paver' ? ['paving', 'pavers', 'pave'] : []),
      ...(t === 'retaining_walls' ? ['retaining wall', 'retaining'] : []),
      ...(t === 'irrigation' ? ['irrigation', 'reticulation', 'sprinkler'] : []),
      ...(t === 'gas_fitter' ? ['gas', 'gas fitting', 'gas line', 'gas heater'] : []),
      ...(t === 'drain_specialist' ? ['drain', 'blocked drain', 'drainage', 'sewer'] : []),
    ],
  }))
);

// Common Australian locations for matching
const KNOWN_LOCATIONS = [
  'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold coast',
  'sunshine coast', 'canberra', 'newcastle', 'wollongong', 'hobart',
  'geelong', 'townsville', 'cairns', 'darwin', 'toowoomba', 'ballarat',
  'bendigo', 'albury', 'launceston', 'mackay', 'rockhampton', 'bunbury',
  'bundaberg', 'hervey bay', 'wagga wagga', 'mildura', 'gladstone',
  'shepparton', 'tamworth', 'port macquarie', 'orange', 'dubbo',
  'north lakes', 'caboolture', 'redcliffe', 'ipswich', 'logan',
  'springfield', 'browns plains', 'beenleigh', 'robina', 'southport',
  'burleigh', 'coolangatta', 'tweed heads', 'byron bay', 'lismore',
  'caloundra', 'maroochydore', 'noosa', 'nambour', 'mooloolaba',
];

/**
 * Parse a freeform message to extract trade, location, and problem
 */
function parseMessage(text: string): {
  trade: TradeCategory | null;
  location: string | null;
  problem: string | null;
} {
  const lower = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Try to match a trade
  let matchedTrade: TradeCategory | null = null;
  let bestTradeScore = 0;
  for (const t of ALL_TRADES) {
    for (const kw of t.keywords) {
      if (lower.includes(kw) && kw.length > bestTradeScore) {
        matchedTrade = t.value;
        bestTradeScore = kw.length;
      }
    }
  }

  // 2. Try to match a location — look for known cities, postcodes, "in/on/near [place]"
  let matchedLocation: string | null = null;

  // Check for postcodes (4 digit numbers)
  const postcodeMatch = text.match(/\b(\d{4})\b/);
  if (postcodeMatch) {
    matchedLocation = postcodeMatch[1];
  }

  // Check for "in/on/at/near [location]" pattern
  if (!matchedLocation) {
    const locationPattern = lower.match(/(?:in|on|at|near|around)\s+(?:the\s+)?([a-z\s]+?)(?:\s+(?:area|region|i|and|but|they|we|he|she|it|that|who|which)|$)/);
    if (locationPattern) {
      const candidate = locationPattern[1].trim();
      // Check if it's a known location
      const knownMatch = KNOWN_LOCATIONS.find(loc => candidate.includes(loc) || loc.includes(candidate));
      if (knownMatch) {
        matchedLocation = knownMatch.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      } else if (candidate.length >= 3 && candidate.length <= 30) {
        // Accept it as a potential suburb name
        matchedLocation = candidate.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }
  }

  // Direct check for known locations anywhere in text
  if (!matchedLocation) {
    for (const loc of KNOWN_LOCATIONS) {
      if (lower.includes(loc)) {
        matchedLocation = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      }
    }
  }

  // 3. The problem is the remaining text (simplified — the whole message is the context)
  const problem = text.trim();

  return { trade: matchedTrade, location: matchedLocation, problem };
}

// ─── Quick reply options ─────────────────────────
const POPULAR_TRADE_CHIPS = [
  { label: 'Plumber', value: 'plumber', emoji: '🔧' },
  { label: 'Electrician', value: 'electrician', emoji: '⚡' },
  { label: 'Builder', value: 'builder', emoji: '🏗️' },
  { label: 'Solar', value: 'solar', emoji: '☀️' },
  { label: 'Air Con', value: 'air_conditioning', emoji: '❄️' },
  { label: 'Painter', value: 'painter', emoji: '🎨' },
  { label: 'Roofer', value: 'roofer', emoji: '🏠' },
  { label: 'Landscaper', value: 'landscaper', emoji: '🌿' },
  { label: 'Handyman', value: 'handyman', emoji: '🔨' },
  { label: 'Cleaner', value: 'cleaning', emoji: '🧹' },
  { label: 'Pest Control', value: 'pest_control', emoji: '🐛' },
  { label: 'Locksmith', value: 'locksmith', emoji: '🔑' },
];

const CITY_CHIPS = ['Brisbane', 'Sydney', 'Melbourne', 'Gold Coast', 'Perth', 'Adelaide'];

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
        content: "G'day! I'm Mojo — tell me what you need and where you are, and I'll find the right tradie.\n\nFor example: \"plumber in Brisbane\" or \"I need my solar panels checked on the Gold Coast\"",
        quickReplies: POPULAR_TRADE_CHIPS.map(t => `${t.emoji} ${t.label}`),
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

  // ─── Execute search ────────────────────────────────────────
  const doSearch = useCallback(async (trade: string, location: string, problem: string) => {
    setStep('searching');
    setIsLoading(true);

    try {
      const res = await fetch('/api/mojo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `I need a ${trade.replace(/_/g, ' ')} in ${location}. ${problem}`,
          trade,
          location,
          problem,
          history: [],
        }),
      });

      const data = await res.json();
      const tradeLabel = tradeCategoryLabel(trade as TradeCategory);

      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: data.tradies?.length > 0
            ? `Found ${data.tradies.length} ${tradeLabel.toLowerCase()}${data.tradies.length !== 1 ? 's' : ''} near ${location}:`
            : data.message || `No results found for ${tradeLabel.toLowerCase()} in ${location}. Try a different area?`,
          tradies: data.tradies || [],
          quickReplies: data.tradies?.length > 0
            ? ['New search', 'Different area', 'Different trade']
            : ['Try a different area', 'Try a different trade'],
        },
      ]);
      setStep('results');
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: "Sorry, hit a snag. Give it another go!",
          quickReplies: ['Try again', 'New search'],
        },
      ]);
      setStep('results');
    }
    setIsLoading(false);
  }, []);

  // ─── Send message ───────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: MojoMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // ─── Results stage — handle follow-ups ───
    if (step === 'results') {
      const lower = text.toLowerCase();
      if (lower.includes('new search') || lower.includes('start over') || lower.includes('different trade')) {
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
            quickReplies: CITY_CHIPS,
          },
        ]);
        setStep('location');
        setIsLoading(false);
        return;
      }
    }

    // ─── Smart parse: try to extract trade + location from any message ───
    const parsed = parseMessage(text);

    // If we're in the trade step
    if (step === 'trade') {
      if (parsed.trade && parsed.location) {
        // User gave us everything in one message! Skip ahead.
        setSelectedTrade(parsed.trade);
        setSelectedLocation(parsed.location);
        const tradeLabel = tradeCategoryLabel(parsed.trade as TradeCategory);

        setMessages(prev => [
          ...prev,
          {
            role: 'mojo',
            content: `${tradeCategoryIcon(parsed.trade as TradeCategory)} ${tradeLabel} in ${parsed.location} — searching now...`,
          },
        ]);

        await doSearch(parsed.trade, parsed.location, parsed.problem || '');
        return;
      }

      if (parsed.trade) {
        // Got trade, need location
        const tradeLabel = tradeCategoryLabel(parsed.trade as TradeCategory);
        setSelectedTrade(parsed.trade);

        setMessages(prev => [
          ...prev,
          {
            role: 'mojo',
            content: `${tradeCategoryIcon(parsed.trade as TradeCategory)} ${tradeLabel} — got it!\n\nWhere are you? (Suburb, postcode, or city)`,
            quickReplies: CITY_CHIPS,
          },
        ]);
        setStep('location');
        setIsLoading(false);
        return;
      }

      // Couldn't match a trade — quick reply might have been used
      const tradeLower = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
      const chipMatch = POPULAR_TRADE_CHIPS.find(t =>
        tradeLower.includes(t.label.toLowerCase()) || tradeLower === t.value.replace('_', ' ')
      );
      if (chipMatch) {
        setSelectedTrade(chipMatch.value);
        setMessages(prev => [
          ...prev,
          {
            role: 'mojo',
            content: `${chipMatch.emoji} ${chipMatch.label} — got it!\n\nWhere are you? (Suburb, postcode, or city)`,
            quickReplies: CITY_CHIPS,
          },
        ]);
        setStep('location');
        setIsLoading(false);
        return;
      }

      // Last resort — ask them to be more specific
      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: "Not sure I got that — what type of tradie do you need? You can tap one below or type something like \"plumber\" or \"solar installer\".",
          quickReplies: POPULAR_TRADE_CHIPS.map(t => `${t.emoji} ${t.label}`),
        },
      ]);
      setIsLoading(false);
      return;
    }

    // ─── Location step ───
    if (step === 'location') {
      const loc = parsed.location || text.trim();
      setSelectedLocation(loc);

      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: `Searching near ${loc}...\n\nAnything specific? (optional — or tap below to just search)`,
          quickReplies: ['Just search', 'Need a quote', 'Emergency', 'Routine maintenance'],
        },
      ]);
      setStep('problem');
      setIsLoading(false);
      return;
    }

    // ─── Problem step ───
    if (step === 'problem') {
      const problem = text.toLowerCase().includes('just search') ? '' : text.trim();
      await doSearch(selectedTrade, selectedLocation, problem);
      return;
    }

    // ─── Fallback: try to parse and search directly ───
    if (parsed.trade && parsed.location) {
      setSelectedTrade(parsed.trade);
      setSelectedLocation(parsed.location);
      const tradeLabel = tradeCategoryLabel(parsed.trade as TradeCategory);

      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: `${tradeCategoryIcon(parsed.trade as TradeCategory)} ${tradeLabel} in ${parsed.location} — searching...`,
        },
      ]);
      await doSearch(parsed.trade, parsed.location, parsed.problem || '');
      return;
    }

    // Absolute fallback: send to API for freeform
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
            ? ['New search', 'Different trade']
            : ['New search'],
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
  }, [step, selectedTrade, selectedLocation, messages, doSearch, handleReset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <>
      {/* ─── Floating Button ─── */}
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
                  step === 'trade' ? "e.g. plumber in Brisbane, solar on the coast..."
                    : step === 'location' ? 'Suburb, postcode, or city...'
                    : step === 'problem' ? "What's happening? (or tap Just search)"
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
