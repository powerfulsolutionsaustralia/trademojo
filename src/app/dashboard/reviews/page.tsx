'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle, Clock, MousePointer, Phone, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

const mockReviews = [
  { id: '1', customer_name: 'Sarah Mitchell', method: 'sms', status: 'completed', sent_at: '2 days ago' },
  { id: '2', customer_name: 'James Wong', method: 'sms', status: 'clicked', sent_at: '3 days ago' },
  { id: '3', customer_name: 'Emma Davis', method: 'email', status: 'sent', sent_at: '5 days ago' },
  { id: '4', customer_name: 'Michael Brown', method: 'sms', status: 'completed', sent_at: '1 week ago' },
];

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-muted" />,
  sent: <Send className="w-4 h-4 text-blue-500" />,
  clicked: <MousePointer className="w-4 h-4 text-yellow-500" />,
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
};

export default function ReviewsPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState<'sms' | 'email'>('sms');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradie_id: 'demo-123',
          customer_name: name,
          ...(method === 'sms' ? { customer_phone: contact } : { customer_email: contact }),
          method,
        }),
      });
      setSent(true);
      setName('');
      setContact('');
      setTimeout(() => setSent(false), 3000);
    } catch { /* TODO */ } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">Reviews</h1>
        <p className="text-muted text-sm">Send review requests and track Google reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-border p-5 text-center">
          <div className="text-2xl font-bold text-foreground">8</div>
          <div className="text-sm text-muted">Sent</div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-center">
          <div className="text-2xl font-bold text-yellow-500">6</div>
          <div className="text-sm text-muted">Clicked</div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-center">
          <div className="text-2xl font-bold text-green-500">5</div>
          <div className="text-sm text-muted">Completed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Review Request */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Send Review Request
          </h2>

          {sent ? (
            <div className="text-center py-6">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Review request sent!</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Customer Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Send via</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setMethod('sms')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${method === 'sms' ? 'border-primary text-primary' : 'border-border text-muted'}`}>
                    <Phone className="w-4 h-4" /> SMS
                  </button>
                  <button type="button" onClick={() => setMethod('email')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${method === 'email' ? 'border-primary text-primary' : 'border-border text-muted'}`}>
                    <Mail className="w-4 h-4" /> Email
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  {method === 'sms' ? 'Phone Number' : 'Email Address'}
                </label>
                <input type={method === 'sms' ? 'tel' : 'email'} required value={contact} onChange={(e) => setContact(e.target.value)} placeholder={method === 'sms' ? '0400 000 000' : 'john@email.com'} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full gap-2" disabled={sending}>
                <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Review Request'}
              </Button>
            </form>
          )}
        </div>

        {/* Review History */}
        <div className="bg-surface rounded-2xl border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-foreground">Review History</h2>
          </div>
          <div className="divide-y divide-border">
            {mockReviews.map((review) => (
              <div key={review.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {statusIcons[review.status]}
                  <div>
                    <div className="text-sm font-medium text-foreground">{review.customer_name}</div>
                    <div className="text-xs text-muted">via {review.method} • {review.sent_at}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                  review.status === 'completed' ? 'bg-green-100 text-green-700' :
                  review.status === 'clicked' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
