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

// ─── Trade data: label (singular), plural, icon, search keywords ────────────

interface TradeInfo {
  label: string;       // "Plumber"
  plural: string;      // "Plumbers"
  pageTitle: string;    // "Plumbers" (what shows in "Find X in Location")
  icon: string;
}

const TRADE_INFO: Record<TradeCategory, TradeInfo> = {
  // Plumbing & Gas
  plumber:            { label: 'Plumber',              plural: 'Plumbers',              pageTitle: 'Plumbers',                icon: '🔧' },
  gas_fitter:         { label: 'Gas Fitter',           plural: 'Gas Fitters',           pageTitle: 'Gas Fitters',             icon: '🔥' },
  drain_specialist:   { label: 'Drain Specialist',     plural: 'Drain Specialists',     pageTitle: 'Drain Specialists',       icon: '🚿' },
  // Electrical & Solar
  electrician:        { label: 'Electrician',          plural: 'Electricians',          pageTitle: 'Electricians',            icon: '⚡' },
  solar:              { label: 'Solar Installer',      plural: 'Solar Installers',      pageTitle: 'Solar Installers',        icon: '☀️' },
  air_conditioning:   { label: 'Air Conditioning Tech', plural: 'Air Conditioning Techs', pageTitle: 'Air Conditioning Specialists', icon: '❄️' },
  data_cabling:       { label: 'Data Cabler',          plural: 'Data Cablers',          pageTitle: 'Data Cablers',            icon: '🔌' },
  security_systems:   { label: 'Security Installer',   plural: 'Security Installers',   pageTitle: 'Security System Installers', icon: '📹' },
  // Building & Renovation
  builder:            { label: 'Builder',              plural: 'Builders',              pageTitle: 'Builders',                icon: '🏗️' },
  carpenter:          { label: 'Carpenter',            plural: 'Carpenters',            pageTitle: 'Carpenters',              icon: '🪚' },
  tiler:              { label: 'Tiler',                plural: 'Tilers',                pageTitle: 'Tilers',                  icon: '🔲' },
  concreter:          { label: 'Concreter',            plural: 'Concreters',            pageTitle: 'Concreters',              icon: '🧱' },
  glazier:            { label: 'Glazier',              plural: 'Glaziers',              pageTitle: 'Glaziers',                icon: '🪟' },
  plasterer:          { label: 'Plasterer',            plural: 'Plasterers',            pageTitle: 'Plasterers',              icon: '🏠' },
  bricklayer:         { label: 'Bricklayer',           plural: 'Bricklayers',           pageTitle: 'Bricklayers',             icon: '🧱' },
  cabinet_maker:      { label: 'Cabinet Maker',        plural: 'Cabinet Makers',        pageTitle: 'Cabinet Makers',          icon: '🗄️' },
  bathroom_renovator: { label: 'Bathroom Renovator',   plural: 'Bathroom Renovators',   pageTitle: 'Bathroom Renovators',     icon: '🛁' },
  kitchen_renovator:  { label: 'Kitchen Renovator',    plural: 'Kitchen Renovators',    pageTitle: 'Kitchen Renovators',      icon: '🍳' },
  // Roofing & Exterior
  roofer:             { label: 'Roofer',               plural: 'Roofers',               pageTitle: 'Roofers',                 icon: '🏠' },
  painter:            { label: 'Painter',              plural: 'Painters',              pageTitle: 'Painters',                icon: '🎨' },
  renderer:           { label: 'Renderer',             plural: 'Renderers',             pageTitle: 'Renderers',               icon: '🏗️' },
  cladding:           { label: 'Cladding Specialist',  plural: 'Cladding Specialists',  pageTitle: 'Cladding Specialists',    icon: '🏢' },
  gutter_specialist:  { label: 'Gutter Specialist',    plural: 'Gutter Specialists',    pageTitle: 'Gutter Specialists',      icon: '🌧️' },
  // Outdoor & Property
  landscaper:         { label: 'Landscaper',           plural: 'Landscapers',           pageTitle: 'Landscapers',             icon: '🌿' },
  fencer:             { label: 'Fencer',               plural: 'Fencers',               pageTitle: 'Fencing Contractors',     icon: '🏡' },
  pool_builder:       { label: 'Pool Builder',         plural: 'Pool Builders',         pageTitle: 'Pool Builders',           icon: '🏊' },
  earthmoving:        { label: 'Earthmover',           plural: 'Earthmovers',           pageTitle: 'Earthmoving Contractors', icon: '🚜' },
  demolition:         { label: 'Demolition Contractor', plural: 'Demolition Contractors', pageTitle: 'Demolition Contractors',  icon: '💥' },
  paver:              { label: 'Paver',                plural: 'Pavers',                pageTitle: 'Paving Contractors',      icon: '🧱' },
  retaining_walls:    { label: 'Retaining Wall Builder', plural: 'Retaining Wall Builders', pageTitle: 'Retaining Wall Builders', icon: '🪨' },
  tree_lopper:        { label: 'Tree Lopper',          plural: 'Tree Loppers',          pageTitle: 'Tree Loppers',            icon: '🌳' },
  irrigation:         { label: 'Irrigation Specialist', plural: 'Irrigation Specialists', pageTitle: 'Irrigation Specialists',  icon: '💧' },
  // Home Services
  handyman:           { label: 'Handyman',             plural: 'Handymen',              pageTitle: 'Handymen',                icon: '🔨' },
  locksmith:          { label: 'Locksmith',            plural: 'Locksmiths',            pageTitle: 'Locksmiths',              icon: '🔑' },
  pest_control:       { label: 'Pest Control Tech',    plural: 'Pest Control Techs',    pageTitle: 'Pest Control Services',   icon: '🐛' },
  cleaning:           { label: 'Cleaner',              plural: 'Cleaners',              pageTitle: 'Cleaners',                icon: '🧹' },
  carpet_cleaning:    { label: 'Carpet Cleaner',       plural: 'Carpet Cleaners',       pageTitle: 'Carpet Cleaners',         icon: '🧼' },
  // Appliances & Systems
  appliance_repair:   { label: 'Appliance Repairer',   plural: 'Appliance Repairers',   pageTitle: 'Appliance Repair Services', icon: '🔧' },
  water_filtration:   { label: 'Water Filtration Specialist', plural: 'Water Filtration Specialists', pageTitle: 'Water Filtration Specialists', icon: '💧' },
  hot_water_systems:  { label: 'Hot Water Specialist',  plural: 'Hot Water Specialists',  pageTitle: 'Hot Water System Specialists', icon: '🔥' },
  garage_doors:       { label: 'Garage Door Specialist', plural: 'Garage Door Specialists', pageTitle: 'Garage Door Specialists', icon: '🚗' },
  antenna_specialist: { label: 'Antenna Specialist',   plural: 'Antenna Specialists',   pageTitle: 'Antenna Specialists',     icon: '📡' },
  // Flooring
  flooring:           { label: 'Flooring Specialist',  plural: 'Flooring Specialists',  pageTitle: 'Flooring Specialists',    icon: '🪵' },
  // Other
  other:              { label: 'Tradesperson',         plural: 'Tradespeople',          pageTitle: 'Tradespeople',            icon: '🛠️' },
};

/** Singular label: "Plumber", "Solar Installer", "Cleaner" */
export function tradeCategoryLabel(category: TradeCategory): string {
  return TRADE_INFO[category]?.label || category;
}

/** Plural label: "Plumbers", "Solar Installers", "Cleaners" */
export function tradeCategoryPlural(category: TradeCategory): string {
  return TRADE_INFO[category]?.plural || `${tradeCategoryLabel(category)}s`;
}

/** Page title for directory pages: "Find X in Location" */
export function tradeCategoryPageTitle(category: TradeCategory): string {
  return TRADE_INFO[category]?.pageTitle || tradeCategoryPlural(category);
}

export function tradeCategoryIcon(category: TradeCategory): string {
  return TRADE_INFO[category]?.icon || '🛠️';
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

export const TRADE_CATEGORIES: TradeCategory[] = Object.keys(TRADE_INFO).filter(k => k !== 'other') as TradeCategory[];

// ─── Trade groups for navigation ────────────────────────────
export const TRADE_GROUPS: { label: string; trades: TradeCategory[] }[] = [
  {
    label: 'Plumbing & Gas',
    trades: ['plumber', 'gas_fitter', 'drain_specialist', 'hot_water_systems'],
  },
  {
    label: 'Electrical & Solar',
    trades: ['electrician', 'solar', 'air_conditioning', 'data_cabling', 'security_systems', 'antenna_specialist'],
  },
  {
    label: 'Building & Renovation',
    trades: ['builder', 'carpenter', 'tiler', 'concreter', 'glazier', 'plasterer', 'bricklayer', 'cabinet_maker', 'bathroom_renovator', 'kitchen_renovator'],
  },
  {
    label: 'Roofing & Exterior',
    trades: ['roofer', 'painter', 'renderer', 'cladding', 'gutter_specialist'],
  },
  {
    label: 'Outdoor & Property',
    trades: ['landscaper', 'fencer', 'pool_builder', 'paver', 'retaining_walls', 'tree_lopper', 'irrigation', 'earthmoving', 'demolition'],
  },
  {
    label: 'Flooring',
    trades: ['flooring', 'carpet_cleaning'],
  },
  {
    label: 'Home Services',
    trades: ['handyman', 'locksmith', 'pest_control', 'cleaning'],
  },
  {
    label: 'Appliances & Systems',
    trades: ['appliance_repair', 'water_filtration', 'garage_doors'],
  },
];
