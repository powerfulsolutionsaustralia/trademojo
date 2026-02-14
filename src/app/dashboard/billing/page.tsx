'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Loader2, DollarSign, Receipt, Clock, ShieldCheck } from 'lucide-react';
import { useDashboard } from '../layout';
import Button from '@/components/ui/Button';

interface BillingEvent {
  id: string;
  event_type: string;
  amount_cents: number;
  description: string;
  status: string;
  lead_id: string;
  created_at: string;
  charged_at: string | null;
}

interface BillingRun {
  id: string;
  lead_count: number;
  total_cents: number;
  status: string;
  run_at: string;
  stripe_payment_intent_id: string | null;
}

export default function BillingPage() {
  const data = useDashboard();
  const tradie = data?.tradie as Record<string, unknown> | null;

  const hasPaymentMethod = (tradie?.has_payment_method as boolean) || false;
  const stripeCustomerId = tradie?.stripe_customer_id as string | null;

  const [events, setEvents] = useState<BillingEvent[]>([]);
  const [runs, setRuns] = useState<BillingRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCard, setAddingCard] = useState(false);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await fetch('/api/billing/history');
        if (res.ok) {
          const json = await res.json();
          setEvents(json.events || []);
          setRuns(json.runs || []);
        }
      } catch (err) {
        console.error('Billing fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, []);

  const handleAddCard = async () => {
    setAddingCard(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });

      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        }
      }
    } catch (err) {
      console.error('Add card error:', err);
    } finally {
      setAddingCard(false);
    }
  };

  const pendingEvents = events.filter((e) => e.status === 'pending');
  const pendingTotal = pendingEvents.reduce((sum, e) => sum + e.amount_cents, 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted text-sm">Manage your payment method and view charges</p>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-primary/5 to-mojo/5 rounded-2xl border border-primary/20 p-6">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-primary" /> How Billing Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
            <div>
              <p className="font-medium text-foreground">Leads come in</p>
              <p className="text-muted">Customers find you and submit a quote request.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
            <div>
              <p className="font-medium text-foreground">$10 per lead</p>
              <p className="text-muted">Each qualified lead is charged at a flat $10.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</span>
            <div>
              <p className="font-medium text-foreground">Daily charge</p>
              <p className="text-muted">Leads are batched and charged once daily.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-primary" /> Payment Method
        </h2>

        {hasPaymentMethod ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Card on file</p>
                <p className="text-xs text-muted">Your card is securely stored with Stripe</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddCard} disabled={addingCard}>
              {addingCard ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Card'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <CreditCard className="w-12 h-12 text-muted mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No payment method</h3>
            <p className="text-sm text-muted mb-4 max-w-sm mx-auto">
              Add a card to start receiving leads. You won&apos;t be charged until you get your first lead.
            </p>
            <Button variant="primary" size="lg" className="gap-2" onClick={handleAddCard} disabled={addingCard}>
              {addingCard ? <><Loader2 className="w-5 h-5 animate-spin" /> Setting up...</> : <><CreditCard className="w-5 h-5" /> Add Payment Card</>}
            </Button>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Secured by Stripe</span>
              <span>No upfront cost</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        )}
      </div>

      {/* Current Balance */}
      {hasPaymentMethod && (
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-500" /> Pending Charges
          </h2>
          {pendingEvents.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">${(pendingTotal / 100).toFixed(2)}</p>
                  <p className="text-sm text-muted">{pendingEvents.length} lead{pendingEvents.length === 1 ? '' : 's'} pending</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Next charge tonight</span>
              </div>
              <div className="space-y-2">
                {pendingEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-foreground font-medium">{event.description || 'Lead charge'}</p>
                      <p className="text-xs text-muted">
                        {new Date(event.created_at).toLocaleDateString('en-AU', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="font-semibold text-foreground">${(event.amount_cents / 100).toFixed(2)}</span>
                  </div>
                ))}
                {pendingEvents.length > 5 && (
                  <p className="text-xs text-muted text-center pt-2">
                    + {pendingEvents.length - 5} more
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted">No pending charges. Leads will appear here when they come in.</p>
            </div>
          )}
        </div>
      )}

      {/* Invoice History */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-mojo" /> Invoice History
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        ) : runs.length > 0 ? (
          <div className="space-y-2">
            {runs.map((run) => (
              <div key={run.id} className="flex items-center justify-between text-sm py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-foreground font-medium">
                    {run.lead_count} lead{run.lead_count === 1 ? '' : 's'}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(run.run_at).toLocaleDateString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">${(run.total_cents / 100).toFixed(2)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    run.status === 'success'
                      ? 'bg-accent/10 text-accent'
                      : run.status === 'failed'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {run.status === 'success' ? 'Paid' : run.status === 'failed' ? 'Failed' : 'Processing'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">No invoices yet. Charges will appear here after your first billing cycle.</p>
          </div>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-center text-muted">
        Questions about billing? Contact us at{' '}
        <a href="mailto:support@trademojo.com.au" className="text-primary hover:underline">support@trademojo.com.au</a>
      </p>
    </div>
  );
}
