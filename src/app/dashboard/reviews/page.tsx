'use client';

import { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, Clock, MousePointer, Phone, Mail, Copy, ExternalLink, MessageSquare } from 'lucide-react';
import { useDashboard } from '../layout';
import Button from '@/components/ui/Button';

interface ReviewRequest {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  method: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_public: boolean;
  source: string;
  created_at: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-muted" />,
  sent: <Send className="w-4 h-4 text-blue-500" />,
  clicked: <MousePointer className="w-4 h-4 text-yellow-500" />,
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
};

export default function ReviewsPage() {
  const data = useDashboard();
  const tradie = data?.tradie as Record<string, unknown> | null;
  const slug = (tradie?.slug as string) || '';
  const reviewRequests = (data?.reviews || []) as unknown as ReviewRequest[];

  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState<'sms' | 'email'>('sms');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'requests' | 'feedback'>('requests');

  // Fetch actual reviews (private feedback)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews/list');
        if (res.ok) {
          const json = await res.json();
          setReviews(json.reviews || []);
        }
      } catch (err) {
        console.error('Reviews fetch error:', err);
      }
    };
    fetchReviews();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradie?.id) return;
    setSending(true);

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradie_id: tradie.id,
          customer_name: name,
          ...(method === 'sms' ? { customer_phone: contact } : { customer_email: contact }),
          method,
        }),
      });
      setSent(true);
      setName('');
      setContact('');
      setTimeout(() => setSent(false), 3000);
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  const copyReviewLink = () => {
    navigator.clipboard.writeText(`https://trademojo.com.au/t/${slug}/review`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sentCount = reviewRequests.filter((r) => r.status !== 'pending').length;
  const clickedCount = reviewRequests.filter((r) => r.status === 'clicked' || r.status === 'completed').length;
  const completedCount = reviewRequests.filter((r) => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">Reviews</h1>
          <p className="text-muted text-sm">Send review requests and manage customer feedback</p>
        </div>
      </div>

      {/* Review Link Card */}
      {slug && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground text-sm mb-1">Your Review Link</p>
            <p className="text-sm text-muted font-mono">trademojo.com.au/t/{slug}/review</p>
            <p className="text-xs text-muted mt-1">Share this with customers to collect reviews</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={copyReviewLink}>
              {copied ? <CheckCircle className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <a href={`/t/${slug}/review`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="w-4 h-4" /> Open
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-border p-5 text-center">
          <div className="text-2xl font-bold text-foreground">{sentCount}</div>
          <div className="text-sm text-muted">Sent</div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-center">
          <div className="text-2xl font-bold text-yellow-500">{clickedCount}</div>
          <div className="text-sm text-muted">Clicked</div>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-center">
          <div className="text-2xl font-bold text-green-500">{completedCount}</div>
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

        {/* Review History / Feedback tabs */}
        <div className="bg-surface rounded-2xl border border-border">
          <div className="flex border-b border-border">
            <button
              onClick={() => setTab('requests')}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors cursor-pointer ${
                tab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-foreground'
              }`}
            >
              Review Requests ({reviewRequests.length})
            </button>
            <button
              onClick={() => setTab('feedback')}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors cursor-pointer ${
                tab === 'feedback' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-foreground'
              }`}
            >
              Feedback ({reviews.length})
            </button>
          </div>

          {tab === 'requests' ? (
            <div className="divide-y divide-border">
              {reviewRequests.length > 0 ? (
                reviewRequests.map((review) => (
                  <div key={review.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {statusIcons[review.status] || statusIcons.pending}
                      <div>
                        <div className="text-sm font-medium text-foreground">{review.customer_name}</div>
                        <div className="text-xs text-muted">
                          via {review.method} &middot;{' '}
                          {new Date(review.created_at).toLocaleDateString('en-AU', {
                            day: 'numeric', month: 'short',
                          })}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                      review.status === 'completed' ? 'bg-green-100 text-green-700' :
                      review.status === 'clicked' ? 'bg-yellow-100 text-yellow-700' :
                      review.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Send className="w-8 h-8 text-muted mx-auto mb-2" />
                  <p className="text-sm text-muted">No review requests yet. Send your first one!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{review.customer_name}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        review.is_public ? 'bg-accent/10 text-accent' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {review.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted leading-relaxed">{review.comment}</p>
                    )}
                    <p className="text-xs text-muted mt-2">
                      {new Date(review.created_at).toLocaleDateString('en-AU', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="w-8 h-8 text-muted mx-auto mb-2" />
                  <p className="text-sm text-muted">No feedback received yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
