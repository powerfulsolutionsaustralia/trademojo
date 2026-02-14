import { notFound } from 'next/navigation';
import { getTradie } from '@/lib/tradie';
import LeadForm from '@/components/tradie-site/LeadForm';
import { Shield, Star, Clock, MapPin, Phone, Award, ArrowRight, Wrench, Users, ThumbsUp } from 'lucide-react';
import type { TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';
import { generateTradieLd } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TradieSiteHomePage({ params }: Props) {
  const { slug } = await params;
  const result = await getTradie(slug);
  if (!result) notFound();

  const { tradie, site } = result;
  const jsonLd = generateTradieLd(tradie);
  const color = site?.primary_color || '#F97316';
  const tradeLabel = tradeCategoryLabel(tradie.trade_category as TradeCategory);
  const serviceAreas = tradie.service_areas || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      {/* Services Preview */}
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
            <div className="text-center mt-8">
              <a href={`/t/${tradie.slug}/services`} className="text-sm font-medium hover:underline" style={{ color }}>
                View all services →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Google Reviews CTA */}
      <section className="py-12 px-4 bg-yellow-50 border-y border-yellow-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground mb-2">
            Had a great experience?
          </h2>
          <p className="text-muted text-sm mb-4">
            Your review helps us grow and helps others find great tradies.
          </p>
          <a
            href={`/t/${tradie.slug}/review`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            <Star className="w-4 h-4" /> Leave a Review
          </a>
        </div>
      </section>

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
    </>
  );
}
