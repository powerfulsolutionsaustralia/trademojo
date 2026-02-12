import type { Metadata } from 'next';
import Navbar from '@/components/directory/Navbar';
import Footer from '@/components/directory/Footer';
import Button from '@/components/ui/Button';
import {
  Globe, BarChart3, Star, Phone, CheckCircle, ArrowRight,
  Zap, Calendar, MessageSquare, TrendingUp, Shield, Clock,
  Users, DollarSign,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Tradies - Get a Website, Leads & Reviews | TradeMojo',
  description: 'TradeMojo gives tradies a professional website, lead capture, online bookings, and automated Google review requests. Set up in under 60 seconds.',
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
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                Built for Australian Tradies
              </div>
              <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Stop Missing Jobs.<br />
                <span className="text-primary">Start Getting Leads.</span>
              </h1>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                TradeMojo gives you everything you need to get more work —
                a professional website, lead capture, online bookings, and
                automated Google reviews. Set up in under 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/onboard">
                  <Button variant="primary" size="lg">
                    Get Your Website Now — Free
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
                <a href="#how-it-works">
                  <Button variant="ghost" size="lg" className="text-white border border-white/20 hover:bg-white/10">
                    See How It Works
                  </Button>
                </a>
              </div>
            </div>

            {/* Visual mockup */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-5 transform rotate-1">
                <div className="bg-primary rounded-xl p-6 mb-4">
                  <h3 className="text-white text-xl font-bold mb-1">Mike&apos;s Plumbing</h3>
                  <p className="text-white/70 text-sm">Licensed Plumber - Brisbane, QLD</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-white/60 text-xs ml-1">4.9 (47 reviews)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">New Lead: Sarah M.</div>
                      <div className="text-xs text-muted">Blocked drain — Paddington</div>
                    </div>
                    <span className="text-xs text-muted">2m ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Booking: James T.</div>
                      <div className="text-xs text-muted">Hot water install — Tue 10am</div>
                    </div>
                    <span className="text-xs text-muted">1h ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">New 5-Star Review!</div>
                      <div className="text-xs text-muted">Lisa K. left a review on Google</div>
                    </div>
                    <span className="text-xs text-muted">3h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-4">
            Sound Familiar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                emoji: '📱',
                problem: 'Customers can&apos;t find you online',
                detail: 'No website means you&apos;re invisible to people searching for tradies in your area.',
              },
              {
                emoji: '📞',
                problem: 'You&apos;re missing calls while on the job',
                detail: 'By the time you call back, they&apos;ve already hired someone else.',
              },
              {
                emoji: '⭐',
                problem: 'Happy customers don&apos;t leave reviews',
                detail: 'You do great work but your Google profile doesn&apos;t show it.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-border p-6 text-left">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.problem}</h3>
                <p className="text-muted text-sm">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-4 bg-surface" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-3">
              Everything You Need to Get More Work
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              TradeMojo is an all-in-one platform built specifically for Australian tradies.
              No tech skills required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Professional Website',
                desc: 'A conversion-focused website for your business. Your services, service area, reviews, and a lead capture form — all branded to your business.',
                color: 'text-primary bg-primary/10',
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: 'Lead Capture',
                desc: 'Customers fill in a simple form on your site. You get notified instantly with their details, the job description, and urgency level.',
                color: 'text-accent bg-accent/10',
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: 'Online Bookings',
                desc: 'Let customers book an appointment directly from your site. Pick your available times and they choose a slot that works.',
                color: 'text-mojo bg-mojo/10',
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'Automated Reviews',
                desc: 'After each job, we send your customer a link to leave a Google review. Happy customers go to Google, unhappy ones come to you first.',
                color: 'text-yellow-500 bg-yellow-50',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Lead Dashboard',
                desc: 'See all your leads, bookings, and review requests in one place. Track which ones you&apos;ve contacted and which you&apos;ve won.',
                color: 'text-blue-500 bg-blue-50',
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

      {/* How It Works (Setup) */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-3">
              Set Up in Under 60 Seconds
            </h2>
            <p className="text-muted">No tech skills needed. We do the hard part.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Tell Us About Your Business',
                desc: 'Business name, trade, phone number, and service area. That&apos;s it.',
                time: '30 seconds',
              },
              {
                step: '2',
                title: 'We Build Your Website',
                desc: 'Your professional website is generated instantly with lead form, booking widget, and review funnel.',
                time: 'Instant',
              },
              {
                step: '3',
                title: 'Start Receiving Leads',
                desc: 'Share your link or point your own domain. Customers find you, fill in the form, and you get notified.',
                time: 'Right away',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 bg-surface rounded-xl border border-border p-4">
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

      {/* Pricing */}
      <section className="py-16 px-4 bg-surface" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-foreground mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted">Start free, upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-background rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground text-lg mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-muted text-sm">/month</span>
              </div>
              <p className="text-muted text-sm mb-6">Get started with the basics.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Your own website page',
                  'Lead capture form',
                  'Directory listing',
                  'Up to 5 leads/month',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/onboard">
                <Button variant="outline" size="md" className="w-full">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Pro - Featured */}
            <div className="bg-background rounded-2xl border-2 border-primary p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-primary">$49</span>
                <span className="text-muted text-sm">/month</span>
              </div>
              <p className="text-muted text-sm mb-6">Everything you need to grow.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Free',
                  'Unlimited leads',
                  'Online booking system',
                  'Automated review requests',
                  'Lead dashboard',
                  'Custom domain support',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/onboard">
                <Button variant="primary" size="md" className="w-full">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Premium */}
            <div className="bg-background rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground text-lg mb-1">Premium</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">$99</span>
                <span className="text-muted text-sm">/month</span>
              </div>
              <p className="text-muted text-sm mb-6">For tradies who want it all.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Pro',
                  'Featured directory listing',
                  'Priority in Mojo search',
                  'SMS lead notifications',
                  'Monthly performance report',
                  'Dedicated support',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-mojo shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/onboard">
                <Button variant="outline" size="md" className="w-full">
                  Get Started
                </Button>
              </a>
            </div>
          </div>

          <p className="text-center text-muted text-xs mt-6">
            All prices in AUD. No lock-in contracts. Cancel anytime.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground mb-8 text-center">
            Common Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do I need any tech skills?',
                a: 'No. We build your website for you. All you need is your business name, trade, and phone number. Takes under 60 seconds.',
              },
              {
                q: 'Can I use my own domain name?',
                a: 'Yes. On the Pro plan and above you can point your own domain (like mikesplumbing.com.au) to your TradeMojo site. We provide the DNS instructions.',
              },
              {
                q: 'How do the automated reviews work?',
                a: 'After you complete a job, you send a review request through TradeMojo (one click). Your customer gets a message asking them to rate their experience. If they give 4-5 stars, they go straight to your Google review page. If under 4 stars, the feedback comes to you privately first.',
              },
              {
                q: 'What happens with leads?',
                a: 'When a customer fills in your lead form, you get notified (email, and SMS on Premium). You can see all leads in your dashboard with their details, what they need, and urgency level.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. No lock-in contracts. Cancel your plan anytime and your site will revert to the free tier.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-surface rounded-xl border border-border p-5">
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
            Free to start, no credit card required.
          </p>
          <a href="/onboard">
            <Button variant="accent" size="lg" className="text-white text-lg px-10">
              Get Your Website Now — Free
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
