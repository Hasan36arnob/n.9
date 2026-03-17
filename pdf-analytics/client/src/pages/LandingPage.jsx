import React from 'react';
import { Link } from 'react-router-dom';

const PricingCard = ({ title, price, features, ctaText, popular = false }) => (
  <div className={`bg-card p-8 rounded-2xl shadow-2xl border-2 transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 ${popular ? 'border-primary ring-4 ring-primary/20 relative' : 'border-border'}`}>
    {popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-xl text-sm font-bold">Most Popular</div>}
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <div className="text-4xl font-bold text-primary mb-6">${price}<span className="text-xl text-muted-foreground">/mo</span></div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="w-5 h-5 bg-primary rounded-full mt-0.5 flex-shrink-0"></div>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Link to="/upload" className={`w-full block py-4 px-6 text-center font-bold rounded-xl transition-all duration-300 ${popular ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25' : 'bg-muted text-muted-foreground hover:bg-accent border border-border hover:border-primary'}`}>
      {ctaText}
    </Link>
  </div>
);
//
const Testimonial = ({ quote, author, role, company }) => (
  <div className="bg-card/50 p-8 rounded-2xl backdrop-blur-sm border border-border">
    <p className="text-lg mb-6 italic">"{quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-indigo-500 rounded-full"></div>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-muted-foreground">{role}, {company}</p>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navbar Space */}
      <div className="h-16"></div>
      
      {/* Hero */}
      <section className="pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-primary to-indigo-400 bg-clip-text text-transparent mb-6 leading-tight">
            Track Every&nbsp;Page&nbsp;Turn
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Know exactly how prospects engage with your PDFs. See time spent, drop-off rates, completion, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              to="/upload" 
              className="px-12 py-5 bg-primary text-xl font-bold rounded-2xl hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/pricing" 
              className="px-12 py-5 border-2 border-white/30 text-xl font-bold rounded-2xl hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-8">
            <span>Trusted by 500+ teams</span>
            <span>•</span>
            <span>10M+ PDFs tracked</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Everything You Need to Convert</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">From upload to insights in seconds. No setup required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/40 transition-all">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Upload & Track</h3>
              <p className="text-muted-foreground">Upload PDF, get instant tracking links. Works everywhere.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/40 transition-all">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-Time Analytics</h3>
              <p className="text-muted-foreground">Live page-by-page analytics, drop-off, time spent, completion rates.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-500/40 transition-all">
                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Convert More</h3>
              <p className="text-muted-foreground">Optimize content with behavioral insights. Increase conversions 3x.</p>
            </div>
          </div>
        </div>
      </section>
//
      {/* Testimonials */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Loved by Growth Teams Everywhere</h2>
            <p className="text-xl text-muted-foreground">Join 500+ teams driving revenue with DocSight insights.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Testimonial 
              quote="DocSight showed us 78% drop off on page 3. We fixed it and sales increased 40% overnight."
              author="Sarah Chen" 
              role="Head of Growth" 
              company="ScaleUp Inc" 
            />
            <Testimonial 
              quote="The completion rates dashboard changed how we create proposals. ROI was immediate."
              author="Mike Rodriguez" 
              role="VP Sales" 
              company="EnterpriseSoft" 
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Start free. Scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <PricingCard 
              title="Starter" 
              price="0" 
              features={[
                "10 PDFs/month",
                "Basic analytics",
                "1 team member",
                "Email support"
              ]} 
              ctaText="Get Started Free" 
            />
            <PricingCard 
              title="Pro" 
              price="29" 
              features={[
                "Unlimited PDFs",
                "Advanced analytics", 
                "5 team members",
                "Embed & exports",
                "Priority support"
              ]} 
              ctaText="Start Pro Trial"
              popular={true}
            />
            <PricingCard 
              title="Enterprise" 
              price="99" 
              features={[
                "Everything in Pro",
                "Custom branding",
                "API access",
                "SLA & SSO",
                "Dedicated support"
              ]} 
              ctaText="Contact Sales" 
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Unlock PDF Insights?</h2>
          <p className="text-xl text-muted-foreground mb-12">No credit card required. Cancel anytime.</p>
          <Link to="/upload" className="inline-flex px-12 py-5 bg-primary text-xl font-bold rounded-2xl hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 mr-4">
            Start Free
          </Link>
          <Link to="/pricing" className="inline-flex px-12 py-5 border-2 border-white/50 text-xl font-bold rounded-2xl hover:bg-white hover:text-slate-900 transition-all duration-300">
            See All Plans
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
