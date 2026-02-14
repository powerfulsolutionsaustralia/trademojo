import { notFound } from 'next/navigation';
import { getTradie } from '@/lib/tradie';
import { Wrench, ArrowRight, Phone } from 'lucide-react';
import type { TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ServicesPage({ params }: Props) {
  const { slug } = await params;
  const result = await getTradie(slug);
  if (!result) notFound();

  const { tradie, site } = result;
  const color = site?.primary_color || '#F97316';
  const tradeLabel = tradeCategoryLabel(tradie.trade_category as TradeCategory);

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Professional {tradeLabel.toLowerCase()} services for residential and commercial properties.
            Quality workmanship guaranteed.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {site.services_list.map((service, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}10` }}
                >
                  <Wrench className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">{service}</h3>
                  <p className="text-sm text-muted">
                    Professional {service.toLowerCase()} service by {tradie.business_name}.
                    Contact us for a free quote.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-4">
            Need a {tradeLabel}?
          </h2>
          <p className="text-muted mb-8">
            Get a free, no-obligation quote from {tradie.business_name} today.
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
              <Phone className="w-5 h-5" /> Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
