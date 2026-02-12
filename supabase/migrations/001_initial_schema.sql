-- ============================================
-- TradeMojo Database Schema
-- Full schema for trade directory + lead-gen platform
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================
-- TRADIES - Core business profiles
-- ============================================
CREATE TABLE tradies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  abn TEXT,
  trade_category TEXT NOT NULL,
  secondary_trades TEXT[] DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  service_areas TEXT[] DEFAULT '{}',
  state TEXT NOT NULL DEFAULT 'QLD',
  postcode TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  google_review_link TEXT,
  average_rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  license_number TEXT,
  insurance_details TEXT,
  years_experience INTEGER,
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'premium', 'payg')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  custom_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_tradies_slug ON tradies(slug);
CREATE INDEX idx_tradies_trade_category ON tradies(trade_category);
CREATE INDEX idx_tradies_state ON tradies(state);
CREATE INDEX idx_tradies_user_id ON tradies(user_id);
CREATE INDEX idx_tradies_is_active ON tradies(is_active);
CREATE INDEX idx_tradies_plan_tier ON tradies(plan_tier);
CREATE INDEX idx_tradies_custom_domain ON tradies(custom_domain);

-- GIN index for full-text search on service areas
CREATE INDEX idx_tradies_service_areas ON tradies USING GIN(service_areas);

-- Trigram index for fuzzy search on business name
CREATE INDEX idx_tradies_business_name_trgm ON tradies USING GIN(business_name gin_trgm_ops);

-- ============================================
-- TRADIE_SITES - Website configuration
-- ============================================
CREATE TABLE tradie_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tradie_id UUID REFERENCES tradies(id) ON DELETE CASCADE UNIQUE,
  primary_color TEXT DEFAULT '#F97316',
  secondary_color TEXT DEFAULT '#1E293B',
  hero_headline TEXT NOT NULL DEFAULT '',
  hero_subheadline TEXT NOT NULL DEFAULT '',
  cta_text TEXT DEFAULT 'Get a Free Quote',
  services_list TEXT[] DEFAULT '{}',
  about_text TEXT DEFAULT '',
  testimonials JSONB DEFAULT '[]',
  show_booking BOOLEAN DEFAULT TRUE,
  show_reviews BOOLEAN DEFAULT TRUE,
  show_gallery BOOLEAN DEFAULT TRUE,
  custom_css TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tradie_sites_tradie_id ON tradie_sites(tradie_id);

-- ============================================
-- LEADS - Customer inquiries
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tradie_id UUID REFERENCES tradies(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  service_needed TEXT NOT NULL,
  description TEXT,
  suburb TEXT,
  postcode TEXT,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost')),
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'directory', 'mojo', 'referral')),
  is_qualified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_tradie_id ON leads(tradie_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_tradie_status ON leads(tradie_id, status);

-- ============================================
-- BOOKINGS - Appointment scheduling
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tradie_id UUID REFERENCES tradies(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_tradie_id ON bookings(tradie_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_tradie_date ON bookings(tradie_id, date);

-- ============================================
-- REVIEW_REQUESTS - Google review automation
-- ============================================
CREATE TABLE review_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tradie_id UUID REFERENCES tradies(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  sent_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  method TEXT DEFAULT 'sms' CHECK (method IN ('sms', 'email')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'clicked', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_review_requests_tradie_id ON review_requests(tradie_id);
CREATE INDEX idx_review_requests_status ON review_requests(status);

-- ============================================
-- MOJO_CONVERSATIONS - AI search analytics
-- ============================================
CREATE TABLE mojo_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_query TEXT NOT NULL,
  mojo_response TEXT NOT NULL,
  trades_shown TEXT[] DEFAULT '{}',
  location_searched TEXT,
  trade_searched TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mojo_conversations_session ON mojo_conversations(session_id);
CREATE INDEX idx_mojo_conversations_created ON mojo_conversations(created_at DESC);

-- ============================================
-- DIRECTORY_LISTINGS - SEO-optimized listings
-- ============================================
CREATE TABLE directory_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tradie_id UUID REFERENCES tradies(id) ON DELETE CASCADE UNIQUE,
  trade_category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  suburbs TEXT[] DEFAULT '{}',
  state TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  schema_markup JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_directory_listings_tradie_id ON directory_listings(tradie_id);
CREATE INDEX idx_directory_listings_trade_category ON directory_listings(trade_category);
CREATE INDEX idx_directory_listings_state ON directory_listings(state);
CREATE INDEX idx_directory_listings_suburbs ON directory_listings USING GIN(suburbs);
CREATE INDEX idx_directory_listings_keywords ON directory_listings USING GIN(keywords);

-- ============================================
-- BILLING_EVENTS - Lead credit tracking (PAYG)
-- ============================================
CREATE TABLE billing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tradie_id UUID REFERENCES tradies(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('lead_charge', 'subscription', 'credit', 'refund')),
  amount_cents INTEGER NOT NULL,
  description TEXT,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_billing_events_tradie_id ON billing_events(tradie_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE tradies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tradie_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mojo_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

-- TRADIES: Public can read active tradies, owners can update their own
CREATE POLICY "Public can view active tradies"
  ON tradies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Tradies can update own profile"
  ON tradies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage tradies"
  ON tradies FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- TRADIE_SITES: Public can read (needed to render sites), owners can update
CREATE POLICY "Public can view tradie sites"
  ON tradie_sites FOR SELECT
  USING (true);

CREATE POLICY "Tradies can update own site"
  ON tradie_sites FOR UPDATE
  USING (
    tradie_id IN (SELECT id FROM tradies WHERE user_id = auth.uid())
  );

-- LEADS: Only the tradie who owns them can see/manage
CREATE POLICY "Tradies can view own leads"
  ON leads FOR SELECT
  USING (
    tradie_id IN (SELECT id FROM tradies WHERE user_id = auth.uid())
  );

CREATE POLICY "Tradies can update own leads"
  ON leads FOR UPDATE
  USING (
    tradie_id IN (SELECT id FROM tradies WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can create leads (public forms)"
  ON leads FOR INSERT
  WITH CHECK (true);

-- BOOKINGS: Similar to leads
CREATE POLICY "Tradies can view own bookings"
  ON bookings FOR SELECT
  USING (
    tradie_id IN (SELECT id FROM tradies WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can create bookings (public forms)"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Tradies can update own bookings"
  ON bookings FOR UPDATE
  USING (
    tradie_id IN (SELECT id FROM tradies WHERE user_id = auth.uid())
  );

-- REVIEW_REQUESTS: Only the tradie can manage
CREATE POLICY "Tradies can manage own review requests"
  ON review_requests FOR ALL
  USING (
    tradie_id IN (SELECT id FROM tradies WHERE user_id = auth.uid())
  );

-- MOJO_CONVERSATIONS: Public can insert, admin can read
CREATE POLICY "Anyone can create mojo conversations"
  ON mojo_conversations FOR INSERT
  WITH CHECK (true);

-- DIRECTORY_LISTINGS: Public can read active listings
CREATE POLICY "Public can view active listings"
  ON directory_listings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Tradies can update own listing"
  ON directory_listings FOR UPDATE
  USING (
    tradie_id IN (SELECT id FROM tradies WHERE user_id = auth.uid())
  );

-- BILLING_EVENTS: Only the tradie can see their own
CREATE POLICY "Tradies can view own billing"
  ON billing_events FOR SELECT
  USING (
    tradie_id IN (SELECT id FROM tradies WHERE user_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tradies_updated_at
  BEFORE UPDATE ON tradies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tradie_sites_updated_at
  BEFORE UPDATE ON tradie_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER directory_listings_updated_at
  BEFORE UPDATE ON directory_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to search tradies by location and trade
CREATE OR REPLACE FUNCTION search_tradies(
  search_trade TEXT DEFAULT NULL,
  search_location TEXT DEFAULT NULL,
  search_state TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 20
)
RETURNS SETOF tradies AS $$
BEGIN
  RETURN QUERY
  SELECT t.*
  FROM tradies t
  WHERE t.is_active = true
    AND (search_trade IS NULL OR t.trade_category = search_trade OR search_trade = ANY(t.secondary_trades))
    AND (search_location IS NULL OR search_location = ANY(t.service_areas) OR t.business_name ILIKE '%' || search_location || '%')
    AND (search_state IS NULL OR t.state = search_state)
  ORDER BY
    t.is_featured DESC,
    t.average_rating DESC NULLS LAST,
    t.review_count DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
