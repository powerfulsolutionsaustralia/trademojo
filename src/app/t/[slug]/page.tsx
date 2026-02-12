import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LeadForm from '@/components/tradie-site/LeadForm';
import { Shield, Star, Clock, MapPin, Phone, Award, ArrowRight, Wrench, Users, ThumbsUp } from 'lucide-react';
import type { Tradie, TradieSite, Testimonial, TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';
import { generateTradieLd, generateTradieMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Fetch tradie + site from Supabase by slug.
 * Returns null if not found (will fall back to demo data or 404).
 */
async function getTradie(slug: string): Promise<{ tradie: Tradie; site: TradieSite } | null> {
  try {
    const supabase = await createClient();

    const { data: tradie, error } = await supabase
      .from('tradies')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !tradie) return null;

    const { data: site } = await supabase
      .from('tradie_sites')
      .select('*')
      .eq('tradie_id', tradie.id)
      .single();

    // Build default site if no site record exists
    const tradeLabel = tradeCategoryLabel(tradie.trade_category as TradeCategory);
    const areas = (tradie.service_areas as string[]) || [];
    const defaultSite: TradieSite = {
      id: '',
      tradie_id: tradie.id,
      primary_color: '#F97316',
      secondary_color: '#1E293B',
      hero_headline: `${areas[0] || tradie.state}'s Trusted ${tradeLabel}`,
      hero_subheadline: `Licensed, insured, and ready to help. Get a free, no-obligation quote from ${tradie.business_name} today.`,
      cta_text: 'Get a Free Quote',
      services_list: [
        'Emergency Repairs',
        `${tradeLabel} Installation`,
        'Maintenance & Servicing',
        'Inspections & Reports',
        'Renovations & Upgrades',
      ],
      about_text: tradie.description || `${tradie.business_name} provides quality ${tradeLabel.toLowerCase()} services.`,
      testimonials: [],
      show_booking: true,
      show_reviews: true,
      show_gallery: true,
      meta_title: `${tradie.business_name} - ${tradeLabel} in ${areas[0] || tradie.state}`,
      meta_description: tradie.short_description || `Trusted ${tradeLabel.toLowerCase()} services.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mergedSite = site
      ? {
          ...defaultSite,
          ...site,
          services_list: site.services_list?.length > 0 ? site.services_list : defaultSite.services_list,
          testimonials: site.testimonials || [],
        }
      : defaultSite;

    return {
      tradie: tradie as Tradie,
      site: mergedSite,
    };
  } catch (err) {
    console.error('Error fetching tradie:', err);
    return null;
  }
}

/**
 * Demo data fallback when no DB record exists.
 */
function getDemoTradie(slug: string): { tradie: Tradie; site: TradieSite } {
  const words = slug.split('-');
  const name = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const tradeMap: Record<string, string> = {
    plumb: 'plumber', plumbing: 'plumber', electric: 'electrician', electrical: 'electrician',
    build: 'builder', building: 'builder', paint: 'painter', painting: 'painter',
    roof: 'roofer', roofing: 'roofer', landscape: 'landscaper', landscaping: 'landscaper',
    tile: 'tiler', tiling: 'tiler', concrete: 'concreter', fence: 'fencer', fencing: 'fencer',
    solar: 'solar', clean: 'cleaning', pest: 'pest_control', lock: 'locksmith',
    pool: 'pool_builder', handy: 'handyman', air: 'air_conditioning', aircon: 'air_conditioning',
    carpenter: 'carpenter', carpentry: 'carpenter',
  };

  let detectedTrade: TradeCategory = 'handyman';
  for (const [keyword, trade] of Object.entries(tradeMap)) {
    if (slug.includes(keyword)) {
      detectedTrade = trade as TradeCategory;
      break;
    }
  }

  const tradie: Tradie = {
    id: 'demo-123',
    user_id: 'demo-user',
    business_name: name,
    slug,
    owner_name: 'Demo Owner',
    email: 'hello@trademojo.com.au',
    phone: '0400 000 000',
    trade_category: detectedTrade,
    description: `${name} provides reliable, high-quality ${tradeCategoryLabel(detectedTrade).toLowerCase()} services across the local area. We pride ourselves on honest pricing, quality workmanship, and turning up on time — every time. Fully licensed and insured with over a decade of experience.`,
    short_description: `Trusted local ${tradeCategoryLabel(detectedTrade).toLowerCase()} services.`,
    service_areas: ['Brisbane', 'Gold Coast', 'Sunshine Coast'],
    state: 'QLD',
    postcode: '4000',
    average_rating: 4.9,
    review_count: 47,
    years_experience: 12,
    plan_tier: 'pro',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const tradeLabel = tradeCategoryLabel(tradie.trade_category as Tradie['trade_category']);

  const site: TradieSite = {
    id: 'site-123',
    tradie_id: 'demo-123',
    primary_color: '#F97316',
    secondary_color: '#1E293B',
    hero_headline: `${tradie.service_areas[0]}'s Trusted ${tradeLabel}`,
    hero_subheadline: `Licensed, insured, and backed by ${tradie.review_count}+ five-star reviews. Get a free, no-obligation quote today.`,
    cta_text: 'Get a Free Quote',
    services_list: [
      'Emergency Repairs',
      `${tradeLabel} Installation`,
      'Maintenance & Servicing',
      'Inspections & Reports',
      'Renovations & Upgrades',
      'New Builds & Fit-Outs',
    ],
    about_text: tradie.description,
    testimonials: [
      { name: 'Sarah M.', text: 'Showed up on time, got the job done right, and cleaned up afterwards. Exactly what you want. Will definitely use again.', rating: 5, date: '2 weeks ago' },
      { name: 'James T.', text: 'Called them for an emergency and they were here within the hour. Professional, honest pricing, and great work. Lifesavers.', rating: 5, date: '1 month ago' },
      { name: 'Lisa K.', text: 'Best value for money. Quoted fair, did quality work, and even gave us tips on maintenance. Highly recommend.', rating: 5, date: '3 weeks ago' },
    ] as Testimonial[],
    show_booking: true,
    show_reviews: true,
    show_gallery: true,
    meta_title: `${tradie.business_name} - ${tradeLabel} in ${tradie.service_areas[0]}`,
    meta_description: tradie.short_description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return { tradie, site };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbResult = await getTradie(slug);
  const { tradie } = dbResult || getDemoTradie(slug);
  return generateTradieMetadata(tradie);
}

export default async function TradieSitePage({ params }: Props) {
  const { slug } = await params;

  // Try fetching from Supabase first, fall back to demo data
  const dbResult = await getTradie(slug);
  const { tradie, site } = dbResult || getDemoTradie(slug);

  if (!tradie) notFound();

  const jsonLd = generateTradieLd(tradie);
  const color = site?.primary_color || '#F97316';
  const tradeLabel = tradeCategoryLabel(tradie.trade_category as Tradie['trade_category']);
  const serviceAreas = tradie.service_areas || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 border-b border-black/10 backdrop-blur-xl" style={{ backgroundColor: `${color}f5` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              {tradie.logo_url ? (
                <img src={tradie.logo_url} alt={tradie.business_name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{tradie.business_name.charAt(0)}</span>
                </div>
              )}
              <span className="font-[family-name:var(--font-outfit)] text-white font-bold text-base truncate max-w-[200px] sm:max-w-none">
                {tradie.business_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${tradie.phone}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-white/90 text-sm font-medium hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                {tradie.phone}
              </a>
              <a
                href="#quote"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-sm font-bold transition-all hover:shadow-lg"
                style={{ color }}
              >
                Get Quote
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="lg:pt-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
                  style={{ borderColor: `${color}30`, backgroundColor: `${color}08`, color }}
                >
                  <Shield className="w-3.5 h-3.5" />
                  {tradie.license_number ? 'Licensed & Insured' : 'Verified Business'}
                </span>
                {tradie.years_experience && tradie.years_experience > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Award className="w-3.5 h-3.5" />
                    {tradie.years_experience}+ Years
                  </span>
                )}
                {tradie.average_rating && tradie.average_rating > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    {tradie.average_rating} Rating
                  </span>
                )}
              </div>

              <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-[1.1]">
                {site.hero_headline}
              </h1>
              <p className="text-muted text-lg mb-8 leading-relaxed max-w-lg">
                {site.hero_subheadline}
              </p>

              {/* Social proof */}
              {tradie.average_rating && tradie.average_rating > 0 && (
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-5 h-5 ${
                            n <= Math.round(tradie.average_rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-foreground">{tradie.average_rating}</span>
                    {tradie.review_count && tradie.review_count > 0 && (
                      <span className="text-sm text-muted">({tradie.review_count} reviews)</span>
                    )}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 hover:shadow-xl shadow-lg"
                  style={{ backgroundColor: color }}
                >
                  {site.cta_text || 'Get a Free Quote'}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${tradie.phone}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-200 font-bold text-base text-foreground hover:border-gray-400 transition-all bg-white"
                >
                  <Phone className="w-5 h-5" /> Call Now
                </a>
              </div>

              {/* Service areas */}
              {serviceAreas.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-6">
                  <MapPin className="w-3.5 h-3.5 text-muted" />
                  <span className="text-xs text-muted">Servicing:</span>
                  {serviceAreas.map((area) => (
                    <span key={area} className="text-xs font-medium text-foreground bg-gray-100 px-2 py-0.5 rounded-md">
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Lead form */}
            <div id="quote" className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Quick response</span>
              </div>
              <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-1">
                Get a Free Quote
              </h2>
              <p className="text-muted text-sm mb-5">Fill in your details and {tradie.business_name} will get back to you ASAP.</p>
              <LeadForm
                tradieId={tradie.id}
                tradieName={tradie.business_name}
                services={site.services_list}
                primaryColor={color}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-8 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
                <Shield className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-sm font-semibold text-foreground">Licensed &amp; Insured</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
                <Clock className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-sm font-semibold text-foreground">Fast Response</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
                <ThumbsUp className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-sm font-semibold text-foreground">Satisfaction Guaranteed</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
                <Users className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {tradie.review_count && tradie.review_count > 0 ? `${tradie.review_count}+ Happy Clients` : 'Local Business'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      {site.services_list && site.services_list.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-2">
                Our Services
              </h2>
              <p className="text-muted text-sm max-w-md mx-auto">
                Professional {tradeLabel.toLowerCase()} services for residential and commercial properties
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {site.services_list.map((service, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <Wrench className="w-5 h-5" style={{ color }} />
                  </div>
                  <span className="font-medium text-foreground text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About & Stats */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-4">
                About {tradie.business_name}
              </h2>
              <p className="text-muted leading-relaxed text-base">{site.about_text || tradie.description}</p>
              {serviceAreas.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {serviceAreas.map((area) => (
                    <span key={area} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-foreground">
                      <MapPin className="w-3 h-3 text-muted" />
                      {area}
                    </span>
                  ))}
                </div>
              )}
              {tradie.abn && (
                <p className="text-xs text-muted mt-4">ABN: {tradie.abn}</p>
              )}
              {tradie.license_number && (
                <p className="text-xs text-muted mt-1">License: {tradie.license_number}</p>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-6 text-center text-sm uppercase tracking-wider">At a Glance</h3>
                <div className="space-y-6">
                  {tradie.years_experience && tradie.years_experience > 0 && (
                    <>
                      <div className="text-center">
                        <div className="text-4xl font-bold" style={{ color }}>{tradie.years_experience}+</div>
                        <div className="text-xs text-muted font-medium mt-1">Years of Experience</div>
                      </div>
                      <div className="border-t border-gray-100" />
                    </>
                  )}
                  {tradie.review_count && tradie.review_count > 0 && (
                    <>
                      <div className="text-center">
                        <div className="text-4xl font-bold" style={{ color }}>{tradie.review_count}</div>
                        <div className="text-xs text-muted font-medium mt-1">Happy Customers</div>
                      </div>
                      <div className="border-t border-gray-100" />
                    </>
                  )}
                  {tradie.average_rating && tradie.average_rating > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold" style={{ color }}>{tradie.average_rating}</span>
                        <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="text-xs text-muted font-medium mt-1">Average Rating</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {site.show_reviews && site.testimonials && site.testimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-2">
                What Our Customers Say
              </h2>
              <p className="text-muted text-sm">Real feedback from real customers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(site.testimonials as Testimonial[]).map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: color }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-foreground block">{t.name}</span>
                      {t.date && <span className="text-xs text-muted">{t.date}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `radial-gradient(white 1.5px, transparent 1.5px)`,
          backgroundSize: '30px 30px',
        }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Get a free, no-obligation quote from {tradie.business_name} today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#quote"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white font-bold text-base transition-all hover:shadow-2xl shadow-lg"
              style={{ color }}
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`tel:${tradie.phone}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 font-bold text-base text-white hover:bg-white/10 transition-all"
            >
              <Phone className="w-5 h-5" /> {tradie.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-[family-name:var(--font-outfit)] font-bold text-lg">{tradie.business_name}</p>
              <p className="text-sm text-white/40 mt-1">
                {tradeLabel}{serviceAreas.length > 0 ? ` · ${serviceAreas.join(' · ')}` : ''}{tradie.state ? `, ${tradie.state}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${tradie.phone}`}
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" /> {tradie.phone}
              </a>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <span>Powered by</span>
                <a href="https://trademojo.com.au" className="font-semibold hover:text-white transition-colors" style={{ color }}>
                  TradeMojo
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
