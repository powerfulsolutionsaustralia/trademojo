import { Search, MessageSquare, Star, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-7 h-7" />,
      title: 'Search or Ask Mojo',
      description:
        'Tell Mojo what you need or browse by trade category and location.',
      color: 'text-primary bg-primary/10',
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      title: 'Get Matched',
      description:
        'See verified tradies in your area with ratings, reviews, and availability.',
      color: 'text-mojo bg-mojo/10',
    },
    {
      icon: <CheckCircle className="w-7 h-7" />,
      title: 'Book Instantly',
      description:
        'Request a quote or book an appointment directly — no phone tag.',
      color: 'text-accent bg-accent/10',
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: 'Rate & Review',
      description:
        'Help the community by sharing your experience after the job is done.',
      color: 'text-yellow-500 bg-yellow-50',
    },
  ];

  return (
    <section className="py-16 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-foreground mb-3">
            How TradeMojo Works
          </h2>
          <p className="text-muted text-lg">
            From search to 5-star review in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div
                className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}
              >
                {step.icon}
              </div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Step {i + 1}
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
