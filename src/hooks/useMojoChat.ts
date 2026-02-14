'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { TRADE_GROUPS, tradeCategoryLabel, tradeCategoryIcon } from '@/lib/utils';
import type { TradeCategory } from '@/types/database';
import type { MojoMessage, MojoTradieResult, ConversationStep } from '@/types/mojo';

// ─── All trades flat list for matching ─────────────────────────
const ALL_TRADES = TRADE_GROUPS.flatMap(g =>
  g.trades.map(t => ({
    value: t,
    label: tradeCategoryLabel(t),
    keywords: [
      t.replace(/_/g, ' '),
      tradeCategoryLabel(t).toLowerCase(),
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
export const KNOWN_LOCATIONS = [
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

// ─── Quick reply options ─────────────────────────
export const POPULAR_TRADE_CHIPS = [
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

export const CITY_CHIPS = ['Brisbane', 'Sydney', 'Melbourne', 'Gold Coast', 'Perth', 'Adelaide'];

// ─── Greeting / conversational detection ─────────────────────
const GREETINGS = [
  'hey', 'hi', 'hello', 'yo', 'sup', 'howdy', 'hiya',
  'gday', 'g\'day', 'good morning', 'good afternoon',
  'good evening', 'whats up', 'what\'s up', 'heya',
  'oi', 'mate', 'hey mate', 'hi there', 'hello there',
];

const THANKS = ['thanks', 'thank you', 'cheers', 'ta', 'legend', 'awesome', 'great', 'perfect', 'sweet'];
const FAREWELLS = ['bye', 'see ya', 'later', 'cya', 'goodbye', 'catch ya', 'seeya'];

function isGreeting(text: string): boolean {
  const cleaned = text.toLowerCase().replace(/[^a-z\s']/g, '').trim();
  return GREETINGS.some(g => cleaned === g || cleaned.startsWith(g + ' '));
}

function isThanks(text: string): boolean {
  const cleaned = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  return THANKS.some(t => cleaned === t || cleaned.startsWith(t + ' ') || cleaned.endsWith(' ' + t));
}

function isFarewell(text: string): boolean {
  const cleaned = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  return FAREWELLS.some(f => cleaned === f || cleaned.startsWith(f + ' ') || cleaned.endsWith(' ' + f));
}

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

  // 2. Try to match a location
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
      const knownMatch = KNOWN_LOCATIONS.find(loc => candidate.includes(loc) || loc.includes(candidate));
      if (knownMatch) {
        matchedLocation = knownMatch.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      } else if (candidate.length >= 3 && candidate.length <= 30) {
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

  // 3. The problem is the remaining text
  const problem = text.trim();

  return { trade: matchedTrade, location: matchedLocation, problem };
}

// ─── Hook ──────────────────────────────────────────────
interface UseMojoChatOptions {
  autoStart?: boolean;
  initialQuery?: string;
}

export function useMojoChat(options: UseMojoChatOptions = {}) {
  const { autoStart = false, initialQuery } = options;

  const [messages, setMessages] = useState<MojoMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ConversationStep>('idle');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const stepRef = useRef(step);
  const selectedTradeRef = useRef(selectedTrade);
  const selectedLocationRef = useRef(selectedLocation);
  const messagesRef = useRef(messages);

  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => { selectedTradeRef.current = selectedTrade; }, [selectedTrade]);
  useEffect(() => { selectedLocationRef.current = selectedLocation; }, [selectedLocation]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const startConversation = useCallback(() => {
    setMessages([
      {
        role: 'mojo',
        content: "G'day! I'm Mojo — tell me what you need and where you are, and I'll find the right tradie.\n\nFor example: \"plumber in Brisbane\" or \"I need my solar panels checked on the Gold Coast\"",
        quickReplies: POPULAR_TRADE_CHIPS.map(t => `${t.emoji} ${t.label}`),
      },
    ]);
    setStep('trade');
  }, []);

  const handleReset = useCallback(() => {
    setMessages([]);
    setSelectedTrade('');
    setSelectedLocation('');
    setInput('');
    setStep('idle');
    // Use setTimeout to avoid calling startConversation during the same render
    setTimeout(() => {
      setMessages([
        {
          role: 'mojo',
          content: "G'day! I'm Mojo — tell me what you need and where you are, and I'll find the right tradie.\n\nFor example: \"plumber in Brisbane\" or \"I need my solar panels checked on the Gold Coast\"",
          quickReplies: POPULAR_TRADE_CHIPS.map(t => `${t.emoji} ${t.label}`),
        },
      ]);
      setStep('trade');
    }, 0);
  }, []);

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

    const currentStep = stepRef.current;

    // ─── Greeting detection (runs first, any step except searching) ───
    if (currentStep !== 'searching' && isGreeting(text)) {
      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: "G'day! I'm Mojo, your tradie-finding assistant.\n\nWhat do you need done? Tell me the trade and where you are, like \"plumber in Brisbane\" or just tap one below.",
          quickReplies: POPULAR_TRADE_CHIPS.map(t => `${t.emoji} ${t.label}`),
        },
      ]);
      setStep('trade');
      setIsLoading(false);
      return;
    }

    // ─── Thanks detection ───
    if (currentStep !== 'searching' && isThanks(text)) {
      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: "No worries! Need help finding another tradie?",
          quickReplies: ['New search'],
        },
      ]);
      setIsLoading(false);
      return;
    }

    // ─── Farewell detection ───
    if (currentStep !== 'searching' && isFarewell(text)) {
      setMessages(prev => [
        ...prev,
        {
          role: 'mojo',
          content: "Catch ya later! Come back anytime you need a tradie. \u{1F44B}",
        },
      ]);
      setIsLoading(false);
      return;
    }

    // ─── Results stage — handle follow-ups ───
    if (currentStep === 'results') {
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
    if (currentStep === 'trade') {
      if (parsed.trade && parsed.location) {
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
    if (currentStep === 'location') {
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
    if (currentStep === 'problem') {
      const problem = text.toLowerCase().includes('just search') ? '' : text.trim();
      await doSearch(selectedTradeRef.current, selectedLocationRef.current, problem);
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
          history: messagesRef.current.filter(m => !m.quickReplies || m.role === 'user').slice(-6),
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
  }, [doSearch, handleReset]);

  // Auto-start conversation
  useEffect(() => {
    if (autoStart && messages.length === 0) {
      startConversation();
    }
  }, [autoStart, messages.length, startConversation]);

  // Handle initial query
  const initialQueryProcessed = useRef(false);
  useEffect(() => {
    if (initialQuery && !initialQueryProcessed.current && messages.length > 0) {
      initialQueryProcessed.current = true;
      setTimeout(() => sendMessage(initialQuery), 300);
    }
  }, [initialQuery, messages.length, sendMessage]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    step,
    sendMessage,
    handleReset,
    startConversation,
    selectedTrade,
    selectedLocation,
  };
}
