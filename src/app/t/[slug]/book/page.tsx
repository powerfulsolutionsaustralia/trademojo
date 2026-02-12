import BookingWidget from '@/components/tradie-site/BookingWidget';
import { ArrowLeft, Phone, MapPin, Star } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params;

  // TODO: Fetch from Supabase
  const tradie = {
    id: 'demo-123',
    business_name: slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    phone: '0400 000 000',
    service_areas: ['Brisbane', 'Gold Coast'],
    state: 'QLD',
    average_rating: 4.9,
    review_count: 47,
  };
  const services = ['Emergency Repairs', 'Installation', 'Maintenance', 'Inspections', 'Renovations'];
  const primaryColor = '#F97316';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href={`/t/${slug}`} className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to {tradie.business_name}
          </a>
          <a href={`tel:${tradie.phone}`} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: primaryColor }}>
            <Phone className="w-3.5 h-3.5" /> {tradie.phone}
          </a>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-2">
            Book an Appointment
          </h1>
          <p className="text-muted">
            Schedule a time with {tradie.business_name}
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tradie.service_areas.join(', ')}</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" /> {tradie.average_rating} ({tradie.review_count})</span>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border shadow-lg p-6 md:p-8">
          <BookingWidget
            tradieId={tradie.id}
            tradieName={tradie.business_name}
            services={services}
            primaryColor={primaryColor}
          />
        </div>
      </div>
    </div>
  );
}
