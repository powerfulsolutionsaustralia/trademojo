'use client';

import { useEffect, useState } from 'react';
import { Star, ExternalLink, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [step, setStep] = useState<'rate' | 'redirect' | 'feedback'>('rate');
  const [feedback, setFeedback] = useState('');

  // TODO: Fetch tradie's Google review link from Supabase
  const googleReviewLink = 'https://search.google.com/local/writereview?placeid=PLACEHOLDER';
  const tradieName = 'Demo Business';

  const handleRate = (stars: number) => {
    setRating(stars);
    if (stars >= 4) {
      setStep('redirect');
    } else {
      setStep('feedback');
    }
  };

  useEffect(() => {
    if (step === 'redirect') {
      const timer = setTimeout(() => {
        window.open(googleReviewLink, '_blank');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, googleReviewLink]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        {/* Rate Step */}
        {step === 'rate' && (
          <div className="bg-surface rounded-2xl border border-border shadow-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-2">
              How was your experience?
            </h1>
            <p className="text-muted mb-8">
              Your feedback helps {tradieName} improve and helps others find great tradies.
            </p>

            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-border'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted">Tap a star to rate</p>
          </div>
        )}

        {/* Redirect to Google (4-5 stars) */}
        {step === 'redirect' && (
          <div className="bg-surface rounded-2xl border border-border shadow-xl p-8 text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-2">
              Awesome! Thanks for the {rating}-star rating!
            </h1>
            <p className="text-muted mb-6">
              We&apos;d love if you could share your experience on Google too. It really helps our business!
            </p>
            <p className="text-sm text-muted mb-4">Redirecting to Google Reviews...</p>
            <a href={googleReviewLink} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" className="gap-2">
                <ExternalLink className="w-5 h-5" />
                Leave a Google Review
              </Button>
            </a>
          </div>
        )}

        {/* Private Feedback (1-3 stars) */}
        {step === 'feedback' && (
          <div className="bg-surface rounded-2xl border border-border shadow-xl p-8 text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-2">
              We&apos;re sorry to hear that
            </h1>
            <p className="text-muted mb-6">
              Help us improve — what could we have done better?
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Your feedback is private and goes directly to the business owner..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none mb-4"
            />
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                // TODO: Submit private feedback to Supabase
                setStep('rate');
                setRating(0);
                setFeedback('');
              }}
            >
              Send Feedback
            </Button>
          </div>
        )}

        {/* TradeMojo branding */}
        <div className="text-center mt-6">
          <a href="https://trademojo.com.au" className="text-xs text-muted hover:text-foreground transition-colors">
            Powered by TradeMojo
          </a>
        </div>
      </div>
    </div>
  );
}
