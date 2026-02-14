import type { Metadata } from 'next';
import Navbar from '@/components/directory/Navbar';
import Footer from '@/components/directory/Footer';
import Button from '@/components/ui/Button';
import {
  Globe, Star, CheckCircle, ArrowRight,
  Zap, MessageSquare, TrendingUp, Shield, Clock,
  DollarSign, Megaphone, CreditCard, BarChart3,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Tradies - Free Professional Website + $10/Lead | TradeMojo',
  description: 'Get a free professional website for your trade business. Only pay $10 per lead you receive. No subscriptions, no upfront costs. Built for Australian tradies.',
};

export default function ForTradiesPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-secondary via-secondary to-secondary/95 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-mojo/10 blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                100% Free Website
              </div>
              <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Get a Professional Website.<br />
                <span className="text-primary">Completely Free.</span>
              </h1>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                TradeMojo builds you a 4-page professional website with lead capture,
                Google review system, and a business dashboard.
                You only pay <strong className="text-white">$10 per lead</strong> you receive. No subscriptions. No lock-in.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/onboard">
                  <Button variant="primary" size="lg">
                    Get Your Free Website
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
                <a href="#how-it-works">
                  <Button variant="ghost" size="lg" className="text-white border border-white/20 hover:bg-white/10">
                    See How It Works
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-6 mt-6 text-white/50 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-accent" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-accent" /> Set up in 60 seconds</span>
              </div>
            </div>

            {/* Price card */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1">
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-muted mb-2">Your Website Costs</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-bold text-foreground">$0</span>
                  </div>
                  <p className="text-muted text-sm mt-1">forever</p>
                </div>
                <div className="border-t border-border pt-6 mb-6">
                  <p className="text-sm font-medium text-foreground text-center mb-4">What&apos;s included — free:</p>
                  <ul className="space-y-3">
                    {[
                      '4-page professional website',
                      'Lead capture form',
                      'Google review system',
                      'Business dashboard',
                      'Directory listing',
                      'Custom domain support',
                      'AI marketing tools',
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-primary/5 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-foreground">Only pay when it works</p>
                  <p className="text-2xl font-bold text-primary mt-1">$10 per lead</p>
                  <p className="text-xs text-muted mt-1">Charged daily. No lead = no charge.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted">Three simple steps to start getting leads.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Sign Up Free',
                desc: 'Business name, trade, phone, and email. Takes 60 seconds. We instantly build your 4-page website.',
                time: '60 seconds',
              },
              {
                step: '2',
                title: 'Customise Your Site',
                desc: 'Add your services, about text, brand colour, and Google review link from your dashboard. All free.',
                time: '5 minutes',
              },
              {
                step: '3',
                title: 'Get Leads, Pay $10 Each',
                desc: 'Customers find your site, submit a quote request, and you get notified. You only pay for leads you actually receive.',
                time: 'Ongoing',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 bg-surface rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-3">
              Everything Included — Free
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              No premium tiers. No feature gates. Every tradie gets the full platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Globe className="w-6 h-6" />,
                title: '4-Page Professional Website',
                desc: 'Home page, Services, About, and Reviews pages — all branded to your business with your colours and content.',
                color: 'text-primary bg-primary/10',
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: 'Lead Capture Form',
                desc: 'A conversion-focused form on your site. Customers enter their details, what they need, and urgency level. You get notified instantly.',
                color: 'text-accent bg-accent/10',
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'Google Review System',
                desc: '5-star reviews go straight to Google. Lower ratings come to you as private feedback first. Build your reputation automatically.',
                color: 'text-yellow-500 bg-yellow-50',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Business Dashboard',
                desc: 'Manage leads, send review requests, track your billing, and customise your website — all from one place.',
                color: 'text-blue-500 bg-blue-50',
              },
              {
                icon: <Megaphone className="w-6 h-6" />,
                title: 'AI Marketing Tools',
                desc: 'Generate social media posts, ad copy, and promo flyer text with AI. Just enter a topic and we write the content.',
                color: 'text-mojo bg-mojo/10',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Directory Listing',
                desc: 'Your business appears in the TradeMojo directory. Get found by people searching for your trade in your area.',
                color: 'text-emerald-500 bg-emerald-50',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-background rounded-2xl border border-border p-6 flex gap-4">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center shrink-0`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — simple */}
      <section className="py-16 px-4" id="pricing">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-3">
              Simple, Fair Pricing
            </h2>
            <p className="text-muted">No subscriptions. No hidden fees. Pay only for results.</p>
          </div>

          <div className="bg-surface rounded-2xl border-2 border-primary p-8 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              Only Option You Need
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm font-medium text-muted mb-2">Website &amp; Platform</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-foreground">$0</span>
                </div>
                <p className="text-muted text-sm mt-1">Free forever</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted mb-2">Per Lead</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-primary">$10</span>
                </div>
                <p className="text-muted text-sm mt-1">Only when you receive a lead</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <Shield className="w-4 h-4 text-accent shrink-0" />
                  No lock-in
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <CreditCard className="w-4 h-4 text-accent shrink-0" />
                  Daily billing
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <DollarSign className="w-4 h-4 text-accent shrink-0" />
                  No hidden fees
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                  Cancel anytime
                </div>
              </div>
            </div>

            <a href="/onboard" className="inline-block mt-8">
              <Button variant="primary" size="lg">
                Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>

          <p className="text-center text-muted text-xs mt-4">
            All prices in AUD. No credit card required to sign up.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-8 text-center">
            Common Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is the website really free?',
                a: 'Yes. You get a full 4-page website (Home, Services, About, Reviews) with your branding, lead capture form, and Google review system — completely free. No catches.',
              },
              {
                q: 'What exactly is a lead?',
                a: 'A lead is when a potential customer submits a quote request through your website. You receive their name, phone, email, what service they need, and how urgent it is. Each lead costs $10.',
              },
              {
                q: 'How does billing work?',
                a: 'Leads accumulate during the day and are charged as a single batch at midnight. So if you get 3 leads in a day, you are charged $30 that night. No leads = no charge.',
              },
              {
                q: 'Do I need any tech skills?',
                a: 'No. Sign up in 60 seconds with your business name, trade, and phone number. We build your website instantly. Customise your content from the dashboard — no coding needed.',
              },
              {
                q: 'Can I use my own domain?',
                a: 'Yes. You can point your own domain (e.g. joesplumbing.com.au) to your TradeMojo site. We provide the DNS setup instructions in your dashboard.',
              },
              {
                q: 'How does the Google review system work?',
                a: 'When you share your review link with a customer: if they rate 5 stars, they are redirected to leave a Google review. If they rate 1-4 stars, their feedback is sent to you privately so you can address it first.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. There are no contracts or lock-in periods. You can remove your payment method at any time. Your free website stays active.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-background rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-3xl font-bold text-white mb-4">
            Ready to Get More Work?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Join tradies across Australia who are growing their business with TradeMojo.
            Free website, $10 per lead. Simple as that.
          </p>
          <a href="/onboard">
            <Button variant="accent" size="lg" className="text-white text-lg px-10">
              Get Your Free Website Now
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
