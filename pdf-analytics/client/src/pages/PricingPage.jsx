import React from 'react';
import { Link } from 'react-router-dom';


// PricingCard component to display individual pricing plans
const PricingCard = ({ title, price, features, ctaText, popular = false }) => (
  <div className={`bg-slate-800/50 p-8 rounded-2xl shadow-2xl border-2 transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 ${popular ? 'border-indigo-500 ring-4 ring-indigo-500/20 relative' : 'border-slate-700/50'}`}>
    {popular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-xl text-sm font-bold shadow-lg">Most Popular</div>}
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <div className="text-4xl font-bold text-indigo-400 mb-6">${price}<span className="text-xl text-slate-400">/mo</span></div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="w-5 h-5 bg-indigo-500 rounded-full mt-0.5 flex-shrink-0"></div>
          <span className="text-slate-300">{feature}</span>
        </li>
      ))}
    </ul>
    <Link to="/upload" className={`w-full block py-4 px-6 text-center font-bold rounded-xl transition-all duration-300 ${popular ? 'bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600 hover:border-indigo-500'}`}>
      {ctaText}
    </Link>
  </div>
);

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">Simple Pricing</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">No tricks. No overages. Pay monthly, cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
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
        <div className="text-center mt-24">
          <p className="text-lg text-slate-400 mb-8">Not sure? <Link to="/upload" className="text-indigo-400 hover:underline font-semibold">Try Free</Link> first</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <span>14-day Pro trial •</span>
            <span>Monthly or annual billing •</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
