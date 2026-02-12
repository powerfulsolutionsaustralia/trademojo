import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LeadForm from '@/components/tradie-site/LeadForm';
import { Shield, Star, Clock, MapPin, Phone, CheckCircle, Camera } from 'lucide-react';
import type { Tradie, TradieSite, Testimonial } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';
import { generateTradieLd, generateTradieMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

// Demo data for preview before DB is live
function getDemoTradie(slug: string): { tradie: Tradie; site: TradieSite } {
  const tradie: Tradie = {
    id: 'demo-123',
    user_id: 'demo-user',
    business_name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug,
    owner_name: 'Demo Owner',
    email: 'demo@trademojo.com.au',
    phone: '0400 000 000',
    trade_category: 'plumber',
    description: 'We are a trusted local business providing high-quality services to homes and businesses across the area. With years of experience and a commitment to excellence, we guarantee your satisfaction on every job.',
    short_description: 'Trusted local trade services with 5-star reviews.',
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

  const site: TradieSite = {
    id: 'site-123',
    tradie_id: 'demo-123',
    primary_color: '#F97316',
    secondary_color: '#1E293B',
    hero_headline: `Your Local ${tradeCategoryLabel(tradie.trade_category as Tradie['trade_category'])} You Can Trust`,
    hero_subheadline: 'Licensed, insured, and backed by hundreds of 5-star reviews. Get a free quote today.',
    cta_text: 'Get a Free Quote',
    services_list: ['Emergency Repairs', 'Installation', 'Maintenance & Servicing', 'Inspections', 'Renovations & Upgrades'],
    about_text: tradie.description,
    testimonials: [
      { name: 'Sarah M.', text: 'Fantastic service! On time, professional, and great value. Highly recommend.', rating: 5, date: '2 weeks ago' },
      { name: 'James T.', text: 'Called them for an emergency and they were here within the hour. Lifesavers!', rating: 5, date: '1 month ago' },
      { name: 'Lisa K.', text: 'Best in the business. Will definitely use again for our next project.', rating: 5, date: '2 months ago' },
    ] as Testimonial[],
    show_booking: true,
    show_reviews: true,
    show_gallery: true,
    meta_title: `${tradie.business_name} - ${tradeCategoryLabel(tradie.trade_category as Tradie['trade_category'])} in ${tradie.service_areas[0]}`,
    meta_description: tradie.short_description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return { tradie, site };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Fetch from Supabase
  const { tradie } = getDemoTradie(slug);
  return generateTradieMetadata(tradie);
}

export default async function TradieSitePage({ params }: Props) {
  const { slug } = await params;

  // TODO: Replace with Supabase fetch
  // const supabase = await createClient();
  // const { data: tradie } = await supabase.from('tradies').select('*').eq('slug', slug).single();
  // if (!tradie) notFound();
  // const { data: site } = await supabase.from('tradie_sites').select('*').eq('tradie_id', tradie.id).single();

  const { tradie, site } = getDemoTradie(slug);
  if (!tradie) notFound();

  const jsonLd = generateTradieLd(tradie);
  const color = site?.primary_color || '#F97316';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Bar */}
      <div className="bg-secondary text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:${tradie.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5" /> {tradie.phone}
            </a>
            <span className="hidden sm:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {tradie.service_areas.join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-semibold">{tradie.average_rating}</span>
            <span className="text-white/60">({tradie.review_count} reviews)</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative py-20 md:py-28 px-4"
        style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: `${color}15`, color }}>
                <Shield className="w-4 h-4" />
                Licensed &amp; Insured
              </div>
              <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
                {site.hero_headline}
              </h1>
              <p className="text-muted text-lg mb-6 leading-relaxed">
                {site.hero_subheadline}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: <Star className="w-4 h-4 text-yellow-500" />, text: `${tradie.average_rating} Star Rating` },
                  { icon: <Clock className="w-4 h-4" style={{ color }} />, text: `${tradie.years_experience}+ Years` },
                  { icon: <MapPin className="w-4 h-4" style={{ color }} />, text: tradie.service_areas[0] },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-sm text-foreground/80">
                    {badge.icon}
                    {badge.text}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#quote" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 hover:shadow-xl" style={{ backgroundColor: color }}>
                  {site.cta_text || 'Get a Free Quote'}
                </a>
                <a href={`tel:${tradie.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-border font-bold text-lg text-foreground hover:border-gray-400 transition-all">
                  <Phone className="w-5 h-5" /> Call Now
                </a>
              </div>
            </div>

            {/* Right - Lead Form */}
            <div id="quote" className="bg-surface rounded-2xl border border-border shadow-xl p-6 lg:p-8">
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-1">
                Get a Free Quote
              </h2>
              <p className="text-muted text-sm mb-6">Fill in your details and we&apos;ll get back to you ASAP.</p>
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
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-8 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {site.services_list.map((service, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
                <CheckCircle className="w-5 h-5 shrink-0" style={{ color }} />
                <span className="font-medium text-foreground">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-4">
            About {tradie.business_name}
          </h2>
          <p className="text-muted text-lg leading-relaxed">{site.about_text}</p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {tradie.years_experience && (
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color }}>{tradie.years_experience}+</div>
                <div className="text-sm text-muted">Years Experience</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color }}>{tradie.review_count}</div>
              <div className="text-sm text-muted">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color }}>{tradie.average_rating}★</div>
              <div className="text-sm text-muted">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {site.show_reviews && site.testimonials.length > 0 && (
        <section className="py-16 px-4 bg-surface">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-8 text-center">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(site.testimonials as Testimonial[]).map((t, i) => (
                <div key={i} className="bg-background rounded-2xl border border-border p-6">
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
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-8">
              Our Work
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-border/30 rounded-2xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted/40" />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted mt-4">Photos coming soon</p>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 px-4" style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Get a free, no-obligation quote from {tradie.business_name} today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#quote" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white font-bold text-lg transition-all hover:shadow-xl" style={{ color }}>
              Get a Free Quote
            </a>
            <a href={`tel:${tradie.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 font-bold text-lg text-white hover:bg-white/10 transition-all">
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
            <p className="text-sm text-white/60">{tradie.service_areas.join(' • ')}, {tradie.state}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Powered by</span>
            <a href="https://trademojo.com.au" className="text-primary hover:text-primary font-semibold">
              TradeMojo
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
