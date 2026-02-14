import { notFound } from 'next/navigation';
import { getTradie } from '@/lib/tradie';
import { MapPin, Shield, Award, Star, ArrowRight, Phone } from 'lucide-react';
import type { TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AboutPage({ params }: Props) {
  const { slug } = await params;
  const result = await getTradie(slug);
  if (!result) notFound();

  const { tradie, site } = result;
  const color = site?.primary_color || '#F97316';
  const tradeLabel = tradeCategoryLabel(tradie.trade_category as TradeCategory);
  const serviceAreas = tradie.service_areas || [];

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-bold text-foreground mb-4">
            About {tradie.business_name}
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {tradie.short_description || `Trusted ${tradeLabel.toLowerCase()} services.`}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-4">
                Our Story
              </h2>
              <div className="prose prose-lg text-muted">
                <p className="leading-relaxed text-base whitespace-pre-line">
                  {site.about_text || tradie.description || `${tradie.business_name} provides quality ${tradeLabel.toLowerCase()} services.`}
                </p>
              </div>

              {/* Service Areas */}
              {serviceAreas.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-foreground mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {serviceAreas.map((area) => (
                      <span key={area} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-foreground">
                        <MapPin className="w-3 h-3 text-muted" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Business details */}
              <div className="mt-8 space-y-2">
                {tradie.abn && (
                  <p className="text-sm text-muted"><strong>ABN:</strong> {tradie.abn}</p>
                )}
                {tradie.license_number && (
                  <p className="text-sm text-muted"><strong>License:</strong> {tradie.license_number}</p>
                )}
                {tradie.state && (
                  <p className="text-sm text-muted"><strong>State:</strong> {tradie.state}</p>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-20">
                <h3 className="font-semibold text-foreground mb-6 text-center text-sm uppercase tracking-wider">At a Glance</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Shield className="w-8 h-8" style={{ color }} />
                    <div>
                      <div className="font-bold text-foreground">{tradie.license_number ? 'Licensed & Insured' : 'Verified Business'}</div>
                      <div className="text-xs text-muted">Professional and reliable</div>
                    </div>
                  </div>

                  {tradie.years_experience && tradie.years_experience > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <Award className="w-8 h-8" style={{ color }} />
                      <div>
                        <div className="font-bold text-foreground">{tradie.years_experience}+ Years</div>
                        <div className="text-xs text-muted">Industry experience</div>
                      </div>
                    </div>
                  )}

                  {tradie.average_rating && tradie.average_rating > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                      <div>
                        <div className="font-bold text-foreground">{tradie.average_rating} Star Rating</div>
                        <div className="text-xs text-muted">{tradie.review_count || 0} customer reviews</div>
                      </div>
                    </div>
                  )}

                  {serviceAreas.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="w-8 h-8" style={{ color }} />
                      <div>
                        <div className="font-bold text-foreground">{serviceAreas.length} Areas</div>
                        <div className="text-xs text-muted">Service coverage</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <a
                    href={`/t/${tradie.slug}#quote`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: color }}
                  >
                    Get a Free Quote <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-muted mb-8">
            Get in touch for a free, no-obligation quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`/t/${tradie.slug}#quote`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: color }}
            >
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`tel:${tradie.phone}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-200 font-bold text-foreground hover:border-gray-400 transition-all bg-white"
            >
              <Phone className="w-5 h-5" /> {tradie.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
