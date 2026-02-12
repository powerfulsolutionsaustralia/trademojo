'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Phone, Mail, User, FileText } from 'lucide-react';

interface LeadFormProps {
  tradieId: string;
  tradieName: string;
  services: string[];
  primaryColor?: string;
}

type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

interface FormData {
  name: string;
  phone: string;
  email: string;
  service_needed: string;
  description: string;
  urgency: UrgencyLevel;
}

const urgencyOptions: { value: UrgencyLevel; label: string; desc: string }[] = [
  { value: 'low', label: 'Low', desc: 'Within a few weeks' },
  { value: 'medium', label: 'Medium', desc: 'Within a week' },
  { value: 'high', label: 'High', desc: 'Within 1-2 days' },
  { value: 'emergency', label: 'Emergency', desc: 'ASAP!' },
];

export default function LeadForm({ tradieId, tradieName, services, primaryColor = '#F97316' }: LeadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    service_needed: '',
    description: '',
    urgency: 'medium',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tradie_id: tradieId, source: 'website' }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 font-[family-name:var(--font-outfit)] mb-2">
          Request Sent!
        </h3>
        <p className="text-green-700 mb-1">
          Thanks! {tradieName} will be in touch shortly.
        </p>
        <p className="text-green-600 text-sm">
          You&apos;ll usually hear back within a few hours.
        </p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm underline text-green-700 cursor-pointer">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Your Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text" name="name" required value={formData.name} onChange={handleChange}
            placeholder="John Smith"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Phone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="tel" name="phone" required value={formData.phone} onChange={handleChange}
            placeholder="0400 000 000"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Email <span className="text-xs text-muted font-normal">(optional)</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="email" name="email" value={formData.email} onChange={handleChange}
            placeholder="john@example.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Service Needed */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Service Needed <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <select
            name="service_needed" required value={formData.service_needed} onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:border-transparent appearance-none"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          >
            <option value="">Select a service...</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Tell us about the job
        </label>
        <textarea
          name="description" value={formData.description} onChange={handleChange} rows={3}
          placeholder="What needs to be done? Any details that help..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
          style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
        />
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">How urgent?</label>
        <div className="grid grid-cols-4 gap-2">
          {urgencyOptions.map((opt) => (
            <button
              key={opt.value} type="button"
              onClick={() => setFormData((prev) => ({ ...prev, urgency: opt.value }))}
              className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                formData.urgency === opt.value ? 'shadow-md' : 'border-border hover:border-muted'
              }`}
              style={formData.urgency === opt.value ? { borderColor: primaryColor, color: primaryColor } : undefined}
            >
              <span className="block text-xs font-bold">{opt.label}</span>
              <span className="block text-[10px] text-muted mt-0.5 hidden sm:block">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit" disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 cursor-pointer"
        style={{ backgroundColor: primaryColor }}
      >
        {status === 'submitting' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-5 h-5" /> Get a Free Quote</>
        )}
      </button>

      <p className="text-xs text-center text-muted">
        No spam. Your details are only shared with {tradieName}.
      </p>
    </form>
  );
}
