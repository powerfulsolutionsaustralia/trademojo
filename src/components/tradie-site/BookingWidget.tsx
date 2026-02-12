'use client';

import { useState } from 'react';
import { Calendar, Clock, CheckCircle, Loader2, User, Phone, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BookingWidgetProps {
  tradieId: string;
  tradieName: string;
  services: string[];
  primaryColor?: string;
}

const TIME_SLOTS = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];

export default function BookingWidget({ tradieId, tradieName, services, primaryColor = '#F97316' }: BookingWidgetProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // TODO: Submit to /api/bookings when live
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  };

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 font-[family-name:var(--font-outfit)] mb-2">
          Booking Requested!
        </h3>
        <p className="text-green-700 mb-1">
          {tradieName} will confirm your appointment shortly.
        </p>
        <p className="text-green-600 text-sm">
          {formData.date} at {formData.time} — {formData.service}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 1: Service & Date */}
      {step >= 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Service</label>
            <select
              name="service" required value={formData.service} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            >
              <option value="">Select a service...</option>
              {services.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <Calendar className="inline w-4 h-4 mr-1" /> Date
              </label>
              <input
                type="date" name="date" required value={formData.date} onChange={handleChange}
                min={minDate}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <Clock className="inline w-4 h-4 mr-1" /> Time
              </label>
              <select
                name="time" required value={formData.time} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              >
                <option value="">Pick a time...</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {step === 1 && formData.service && formData.date && formData.time && (
            <Button type="button" variant="primary" size="md" className="w-full" onClick={() => setStep(2)}>
              Continue
            </Button>
          )}
        </div>
      )}

      {/* Step 2: Contact Details */}
      {step >= 2 && (
        <div className="space-y-4 border-t border-border pt-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              <User className="inline w-4 h-4 mr-1" /> Your Name
            </label>
            <input
              type="text" name="name" required value={formData.name} onChange={handleChange}
              placeholder="John Smith"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <Phone className="inline w-4 h-4 mr-1" /> Phone
              </label>
              <input
                type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                placeholder="0400 000 000"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <Mail className="inline w-4 h-4 mr-1" /> Email
              </label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Address</label>
            <input
              type="text" name="address" value={formData.address} onChange={handleChange}
              placeholder="Job site address"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Notes</label>
            <textarea
              name="notes" value={formData.notes} onChange={handleChange} rows={2}
              placeholder="Anything we should know?"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            />
          </div>

          <button
            type="submit" disabled={status === 'submitting'}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            {status === 'submitting' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Booking...</>
            ) : (
              <><Calendar className="w-5 h-5" /> Request Booking</>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
