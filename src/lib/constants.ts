// TradeMojo Brand Constants

export const BRAND = {
  name: 'TradeMojo',
  tagline: 'Find trusted tradies in your area',
  description:
    'Australia\'s smartest trade directory. Search thousands of verified tradies with Mojo, your AI-powered assistant.',
  url: 'https://trademojo.com.au',
  ai_name: 'Mojo',
  colors: {
    primary: '#F97316', // Orange - energetic, trades-y
    primaryDark: '#EA580C',
    secondary: '#1E293B', // Dark slate
    accent: '#10B981', // Emerald green for CTAs
    accentDark: '#059669',
    background: '#FAFAF9',
    surface: '#FFFFFF',
    mojo: '#8B5CF6', // Purple for Mojo AI
    mojoDark: '#7C3AED',
  },
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },
} as const;

export const PLAN_PRICING = {
  free: {
    name: 'Starter',
    price: 0,
    priceLabel: 'Free',
    features: [
      'Directory listing',
      'Basic profile',
      'Up to 3 photos',
    ],
  },
  pro: {
    name: 'Pro',
    price: 14900, // cents
    priceLabel: '$149/mo',
    features: [
      'Full lead-gen website',
      '20 leads/month included',
      'Online booking',
      'Google review funnel',
      'Lead notifications (SMS + Email)',
      'Dashboard analytics',
    ],
  },
  premium: {
    name: 'Premium',
    price: 29900,
    priceLabel: '$299/mo',
    features: [
      'Everything in Pro',
      'Unlimited leads',
      'Priority directory listing',
      'Social media creatives',
      'Custom domain support',
      'Mojo AI website assistant',
      'Dedicated account manager',
    ],
  },
  payg: {
    name: 'Pay As You Go',
    price: 0,
    priceLabel: '$25/lead',
    features: [
      'Full lead-gen website',
      'Pay only for leads received',
      'Online booking',
      'Google review funnel',
      'Dashboard analytics',
    ],
  },
} as const;
