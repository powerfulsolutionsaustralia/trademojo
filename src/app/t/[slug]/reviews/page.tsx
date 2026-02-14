import { notFound } from 'next/navigation';
import { getTradie } from '@/lib/tradie';
import { Star, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ slug: string }>;
}

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_public: boolean;
  created_at: string;
}

export default async function ReviewsPage({ params }: Props) {
  const { slug } = await params;
  const result = await getTradie(slug);
  if (!result) notFound();

  const { tradie, site } = result;
  const color = site?.primary_color || '#F97316';

  // Fetch public reviews from Supabase
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('tradie_id', tradie.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  const publicReviews = (reviews || []) as Review[];
  const avgRating = publicReviews.length > 0
    ? (publicReviews.reduce((sum, r) => sum + r.rating, 0) / publicReviews.length).toFixed(1)
    : tradie.average_rating || 0;

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-4xl font-bold text-foreground mb-4">
            Customer Reviews
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-6">
            See what our customers have to say about {tradie.business_name}.
          </p>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-4xl font-bold text-foreground">{avgRating}</span>
            <div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-5 h-5 ${
                      n <= Math.round(Number(avgRating))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted mt-1">
                {publicReviews.length > 0
                  ? `Based on ${publicReviews.length} review${publicReviews.length === 1 ? '' : 's'}`
                  : `${tradie.review_count || 0} reviews`
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {publicReviews.length > 0 ? (
            <div className="space-y-4">
              {publicReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: color }}
                    >
                      {review.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{review.customer_name}</p>
                      <p className="text-xs text-muted">
                        {new Date(review.created_at).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-foreground text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No reviews yet</h3>
              <p className="text-muted text-sm mb-6">Be the first to leave a review!</p>
            </div>
          )}

          {/* Leave a review CTA */}
          <div className="mt-8 text-center">
            <a
              href={`/t/${tradie.slug}/review`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              <Star className="w-4 h-4" /> Leave a Review
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
