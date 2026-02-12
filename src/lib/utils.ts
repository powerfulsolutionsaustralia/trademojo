import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TradeCategory } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

export function tradeCategoryLabel(category: TradeCategory): string {
  const labels: Record<TradeCategory, string> = {
    plumber: 'Plumber',
    electrician: 'Electrician',
    carpenter: 'Carpenter',
    painter: 'Painter',
    roofer: 'Roofer',
    landscaper: 'Landscaper',
    builder: 'Builder',
    tiler: 'Tiler',
    concreter: 'Concreter',
    fencer: 'Fencer',
    air_conditioning: 'Air Conditioning',
    solar: 'Solar',
    pest_control: 'Pest Control',
    cleaning: 'Cleaning',
    locksmith: 'Locksmith',
    glazier: 'Glazier',
    demolition: 'Demolition',
    earthmoving: 'Earthmoving',
    pool_builder: 'Pool Builder',
    handyman: 'Handyman',
    other: 'Other',
  };
  return labels[category] || category;
}

export function tradeCategoryIcon(category: TradeCategory): string {
  const icons: Record<TradeCategory, string> = {
    plumber: '🔧',
    electrician: '⚡',
    carpenter: '🪚',
    painter: '🎨',
    roofer: '🏠',
    landscaper: '🌿',
    builder: '🏗️',
    tiler: '🔲',
    concreter: '🧱',
    fencer: '🏗️',
    air_conditioning: '❄️',
    solar: '☀️',
    pest_control: '🐛',
    cleaning: '🧹',
    locksmith: '🔑',
    glazier: '🪟',
    demolition: '💥',
    earthmoving: '🚜',
    pool_builder: '🏊',
    handyman: '🔨',
    other: '🛠️',
  };
  return icons[category] || '🛠️';
}

export const AUSTRALIAN_STATES = [
  { value: 'QLD', label: 'Queensland' },
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'ACT', label: 'Australian Capital Territory' },
] as const;

export const TRADE_CATEGORIES: TradeCategory[] = [
  'plumber',
  'electrician',
  'carpenter',
  'painter',
  'roofer',
  'landscaper',
  'builder',
  'tiler',
  'concreter',
  'fencer',
  'air_conditioning',
  'solar',
  'pest_control',
  'cleaning',
  'locksmith',
  'glazier',
  'demolition',
  'earthmoving',
  'pool_builder',
  'handyman',
  'other',
];
