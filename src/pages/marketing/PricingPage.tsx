import React, { useState } from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEOHead } from '../../components/seo/SEOHead';
import { SOFTWARE_APPLICATION_SCHEMA } from '../../utils/seoConfig';
import { Link, useRouter } from '../../router/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, HelpCircle, ArrowRight, Sparkles, Shield, ChevronDown, ChevronUp } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { navigate } = useRouter();
  const { signInQuickDemo } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const plans = [
    {
      name: 'Starter',
      badge: 'Free Forever',
      price: '$0',
      period: 'forever',
      description: 'Ideal for solo operators and founders launching their sales pipeline.',
      features: [
        'Up to 250 active contacts & leads',
        'Action Center with overdue task flags',
        'Visual Kanban pipeline board',
        '1-click deterministic lead conversion',
        'Instant guest workspace access',
        'Community support',
      ],
      ctaText: 'Start Free Forever',
      isPopular: false,
    },
    {
      name: 'Growth Team',
      badge: 'Most Popular',
      price: billingCycle === 'annual' ? '$29' : '$35',
      period: 'per user / mo',
      description: 'Engineered for growing sales teams requiring zero-loss deal execution.',
      features: [
        'Unlimited contacts, companies & deals',
        'Algorithmic 7-day Stale Deal Sentry',
        'Priority Action Center escalation',
        'Attribute-Based Access Control (ABAC)',
        'Full activity timeline & call logging',
        'Role switcher & manager oversight',
        'Standard email & chat support',
      ],
      ctaText: 'Start 14-Day Free Trial',
      isPopular: true,
    },
    {
      name: 'Scale & Agency',
      badge: 'High Velocity',
      price: billingCycle === 'annual' ? '$69' : '$79',
      period: 'per user / mo',
      description: 'For high-volume sales organizations and multi-client consultancies.',
      features: [
        'Everything in Growth Team',
        'Immutable compliance audit logging',
        'Custom pipeline stage probabilities',
        'Automated executive revenue reports',
        'Dedicated onboarding session',
        'Priority 24/7 engineering response',
      ],
      ctaText: 'Upgrade to Scale',
      isPopular: false,
    },
  ];

  const faqs = [
    {
      q: 'Can I test CoreDesk CRM before creating an account?',
      a: 'Yes! CoreDesk includes an instant guest workspace preview. You can click "Instant Guest Workspace" on any page to test the live CRM with preloaded leads, deals, and the Action Center without entering an email or credit card.',
    },
    {
      q: 'What is the "Action-First" philosophy?',
      a: 'Traditional CRMs are passive data warehouses where reps only log data when forced. CoreDesk is built around an active loop: every morning, reps are handed an actionable queue of overdue follow-ups and flagged stale opportunities so no revenue slips away.',
    },
    {
      q: 'Does CoreDesk lock me into long-term contracts?',
      a: 'No. You can choose month-to-month billing and cancel at any time, or choose annual billing to receive a discount. Your customer data can be exported at any time.',
    },
    {
      q: 'How does Deterministic Lead Conversion work?',
      a: 'When you qualify a lead in CoreDesk, our system atomically creates the Company account, the primary Contact record, and a high-priority Deal in one unified transaction, preventing duplicates or broken relations.',
    },
    {
      q: 'Are our customer records isolated and secure?',
      a: 'Yes. CoreDesk enforces Zero-Trust Attribute-Based Access Control (ABAC) backed by database security rules. Multi-tenant customer data is strictly isolated by organization ID.',
    },
  ];

  const handleLaunchDemo = async () => {
    try {
      setIsDemoLoading(true);
      await signInQuickDemo();
      navigate('/app');
    } catch (err) {
      console.error('Demo error:', err);
      navigate('/login');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <SEOHead
        title="Pricing | CoreDesk CRM - Transparent Plans for Growing Sales Teams"
        description="Simple, transparent pricing for CoreDesk CRM. Free starter tier, scalable team plans, zero long-term contracts, and instant guest demo preview."
        canonicalPath="/pricing"
        schema={SOFTWARE_APPLICATION_SCHEMA}
      />

      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Predictable Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Predictable Plans for <span className="text-emerald-400">High-Velocity Teams</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            No surprise add-on fees. No complex tiered storage quotas. Choose the plan that fits your sales motion.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 border border-slate-700 relative transition-colors focus:outline-none"
              aria-label="Toggle billing frequency"
            >
              <div
                className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'text-white' : 'text-slate-400'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold">
                Save ~18%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                plan.isPopular
                  ? 'bg-slate-800/90 border-2 border-emerald-500 shadow-2xl relative'
                  : 'bg-slate-800/60 border border-slate-700/80'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {!plan.isPopular && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-bold">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">{plan.description}</p>

                <div className="border-t border-slate-700/80 pt-4 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included:</div>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                {plan.name === 'Starter' ? (
                  <button
                    onClick={handleLaunchDemo}
                    disabled={isDemoLoading}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <span>{isDemoLoading ? 'Loading...' : plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors ${
                      plan.isPopular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Got questions about onboarding, guest previews, or data security?
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl bg-slate-800/70 border border-slate-700/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-750/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Security guarantee */}
      <section className="py-12 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Shield className="w-4 h-4" />
            <span>Zero-Risk Guarantee</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Test our system completely free in sandbox mode. No credit card required, zero sales pressure.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
};
