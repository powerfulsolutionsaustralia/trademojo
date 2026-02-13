// TradeMojo Database Types

export type TradeCategory =
  // Plumbing & Gas
  | 'plumber'
  | 'gas_fitter'
  | 'drain_specialist'
  // Electrical & Solar
  | 'electrician'
  | 'solar'
  | 'air_conditioning'
  | 'data_cabling'
  | 'security_systems'
  // Building & Renovation
  | 'builder'
  | 'carpenter'
  | 'tiler'
  | 'concreter'
  | 'glazier'
  | 'plasterer'
  | 'bricklayer'
  | 'cabinet_maker'
  | 'bathroom_renovator'
  | 'kitchen_renovator'
  // Roofing & Exterior
  | 'roofer'
  | 'painter'
  | 'renderer'
  | 'cladding'
  | 'gutter_specialist'
  // Outdoor & Property
  | 'landscaper'
  | 'fencer'
  | 'pool_builder'
  | 'earthmoving'
  | 'demolition'
  | 'paver'
  | 'retaining_walls'
  | 'tree_lopper'
  | 'irrigation'
  // Home Services
  | 'handyman'
  | 'locksmith'
  | 'pest_control'
  | 'cleaning'
  | 'carpet_cleaning'
  // Appliances & Systems
  | 'appliance_repair'
  | 'water_filtration'
  | 'hot_water_systems'
  | 'garage_doors'
  | 'antenna_specialist'
  // Flooring
  | 'flooring'
  // Other
  | 'other';

export type PlanTier = 'free' | 'pro' | 'premium' | 'payg';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Tradie {
  id: string;
  user_id: string;
  business_name: string;
  slug: string;
  owner_name: string;
  email: string;
  phone: string;
  abn?: string;
  trade_category: TradeCategory;
  secondary_trades?: TradeCategory[];
  description: string;
  short_description: string;
  service_areas: string[]; // suburbs/cities
  state: string;
  postcode: string;
  logo_url?: string;
  hero_image_url?: string;
  gallery_images?: string[];
  google_review_link?: string;
  average_rating?: number;
  review_count?: number;
  license_number?: string;
  insurance_details?: string;
  years_experience?: number;
  plan_tier: PlanTier;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  is_active: boolean;
  is_featured: boolean;
  custom_domain?: string;
  created_at: string;
  updated_at: string;
}

export interface TradieSite {
  id: string;
  tradie_id: string;
  primary_color: string;
  secondary_color: string;
  hero_headline: string;
  hero_subheadline: string;
  cta_text: string;
  services_list: string[];
  about_text: string;
  testimonials: Testimonial[];
  show_booking: boolean;
  show_reviews: boolean;
  show_gallery: boolean;
  custom_css?: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  date?: string;
}

export interface Lead {
  id: string;
  tradie_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  service_needed: string;
  description?: string;
  suburb?: string;
  postcode?: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: LeadStatus;
  source: 'website' | 'directory' | 'mojo' | 'referral';
  is_qualified: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  tradie_id: string;
  lead_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service: string;
  date: string;
  time: string;
  duration_minutes: number;
  address?: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
}

export interface ReviewRequest {
  id: string;
  tradie_id: string;
  lead_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  sent_at?: string;
  clicked_at?: string;
  reviewed_at?: string;
  method: 'sms' | 'email';
  status: 'pending' | 'sent' | 'clicked' | 'completed';
  created_at: string;
}

export interface MojoConversation {
  id: string;
  session_id: string;
  user_query: string;
  mojo_response: string;
  trades_shown: string[]; // tradie_ids
  location_searched?: string;
  trade_searched?: string;
  created_at: string;
}

export interface DirectoryListing {
  id: string;
  tradie_id: string;
  trade_category: TradeCategory;
  title: string;
  description: string;
  suburbs: string[];
  state: string;
  keywords: string[];
  schema_markup: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
