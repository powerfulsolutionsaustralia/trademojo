import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LeadForm from '@/components/tradie-site/LeadForm';
import { Shield, Star, Clock, MapPin, Phone, CheckCircle, Camera, Award } from 'lucide-react';
import type { Tradie, TradieSite, Testimonial, TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';
import { generateTradieLd, generateTradieMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

// Demo data for preview before DB is live
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
  const { tradie } = getDemoTradie(slug);
  return generateTradieMetadata(tradie);
}

export default async function TradieSitePage({ params }: Props) {
  const { slug } = await params;

  // TODO: Replace with Supabase fetch
  const { tradie, site } = getDemoTradie(slug);
  if (!tradie) notFound();

  const jsonLd = generateTradieLd(tradie);
  const color = site?.primary_color || '#F97316';
  const tradeLabel = tradeCategoryLabel(tradie.trade_category as Tradie['trade_category']);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Bar */}
      <div className="bg-secondary text-white py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:${tradie.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium">
              <Phone className="w-3.5 h-3.5" /> {tradie.phone}
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-white/60">
              <MapPin className="w-3.5 h-3.5" /> {tradie.service_areas.join(' • ')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(n => (
              <Star key={n} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="font-semibold ml-1">{tradie.average_rating}</span>
            <span className="text-white/50 ml-0.5">({tradie.review_count})</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="lg:pt-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${color}15`, color }}>
                  <Shield className="w-3.5 h-3.5" />
                  Licensed &amp; Insured
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                  <Award className="w-3.5 h-3.5" />
                  {tradie.years_experience}+ Years
                </span>
              </div>

              <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {site.hero_headline}
              </h1>
              <p className="text-muted text-base md:text-lg mb-6 leading-relaxed">
                {site.hero_subheadline}
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <div>
                    <span className="font-bold text-foreground">{tradie.average_rating}</span>
                    <span className="text-muted text-sm ml-1">({tradie.review_count} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Clock className="w-5 h-5" style={{ color }} />
                  <span className="text-sm">{tradie.years_experience}+ years</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <MapPin className="w-5 h-5" style={{ color }} />
                  <span className="text-sm">{tradie.service_areas[0]}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 hover:shadow-xl shadow-lg"
                  style={{ backgroundColor: color }}
                >
                  {site.cta_text || 'Get a Free Quote'}
                </a>
                <a
                  href={`tel:${tradie.phone}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-border font-bold text-base text-foreground hover:border-gray-400 transition-all"
                >
                  <Phone className="w-5 h-5" /> Call Now
                </a>
              </div>
            </div>

            <div id="quote" className="bg-white rounded-2xl border border-border shadow-xl p-6 lg:p-8">
              <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-1">
                Get a Free Quote
              </h2>
              <p className="text-muted text-sm mb-5">Fill in your details and we&apos;ll get back to you ASAP.</p>
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

      {/* Services */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            Our Services
          </h2>
          <p className="text-muted text-sm text-center mb-8">
            Professional {tradeLabel.toLowerCase()} services for homes and businesses
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {site.services_list.map((service, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border">
                <CheckCircle className="w-5 h-5 shrink-0" style={{ color }} />
                <span className="font-medium text-foreground text-sm">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Stats */}
      <section className="py-14 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-4">
                About {tradie.business_name}
              </h2>
              <p className="text-muted leading-relaxed">{site.about_text}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tradie.service_areas.map((area) => (
                  <span key={area} className="inline-flex items-center gap-1 px-3 py-1.5 bg-background border border-border rounded-full text-xs text-foreground">
                    <MapPin className="w-3 h-3 text-muted" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-background rounded-2xl border border-border p-6">
              <div className="space-y-6">
                {tradie.years_experience && (
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color }}>{tradie.years_experience}+</div>
                    <div className="text-xs text-muted font-medium uppercase tracking-wider mt-1">Years Experience</div>
                  </div>
                )}
                <div className="border-t border-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color }}>{tradie.review_count}</div>
                  <div className="text-xs text-muted font-medium uppercase tracking-wider mt-1">Happy Customers</div>
                </div>
                <div className="border-t border-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold" style={{ color }}>{tradie.average_rating}</span>
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="text-xs text-muted font-medium uppercase tracking-wider mt-1">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {site.show_reviews && site.testimonials.length > 0 && (
        <section className="py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
              What Our Customers Say
            </h2>
            <p className="text-muted text-sm text-center mb-8">
              Real feedback from real customers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(site.testimonials as Testimonial[]).map((t, i) => (
                <div key={i} className="bg-surface rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{t.name}</span>
                    {t.date && <span className="text-xs text-muted">{t.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery placeholder */}
      {site.show_gallery && (
        <section className="py-14 px-4 bg-surface">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-8">
              Our Work
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-background border border-border rounded-xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted/30" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-4">Gallery photos coming soon</p>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 px-4" style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8">
            Get a free, no-obligation quote from {tradie.business_name} today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#quote" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white font-bold text-base transition-all hover:shadow-xl" style={{ color }}>
              Get a Free Quote
            </a>
            <a href={`tel:${tradie.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 font-bold text-base text-white hover:bg-white/10 transition-all">
              <Phone className="w-5 h-5" /> {tradie.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold">{tradie.business_name}</p>
            <p className="text-sm text-white/50">{tradie.service_areas.join(' • ')}, {tradie.state}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/40">
            <span>Powered by</span>
            <a href="https://trademojo.com.au" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              TradeMojo
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
