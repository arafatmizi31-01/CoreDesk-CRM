import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEOHead } from '../../components/seo/SEOHead';
import { ORGANIZATION_SCHEMA } from '../../utils/seoConfig';
import { Link } from '../../router/RouterContext';
import {
  Building2,
  Users,
  Briefcase,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const solutions = [
    {
      id: 'small-business',
      icon: Building2,
      badge: 'Small Business Owners',
      title: 'Graduate from Spreadsheets Without Enterprise Overkill',
      description:
        'Small businesses do not need a 6-month consulting rollout or 400 configurable fields. CoreDesk gives you a clean, unified dashboard with immediate follow-up reminders and customer history.',
      benefits: [
        'Organize customer accounts and contacts in under 5 minutes',
        'Automatic Action Center ensures customer callbacks never slip',
        'Transparent flat pricing without hidden enterprise licensing fees',
        'Zero IT maintenance or complex custom code required',
      ],
      ctaText: 'Start for Small Business',
    },
    {
      id: 'growing-teams',
      icon: Users,
      badge: 'Sales Teams (3–25 Reps)',
      title: 'Action-First Accountability Across Your Reps',
      description:
        'Keep sales reps focused on their highest-value touches while giving sales leaders unambiguous pipeline health metrics and stale deal warnings.',
      benefits: [
        'Automated 7-day stale deal sentry flags dormant opportunities',
        'Role-based permissions (ABAC) keep customer data segmented safely',
        'Real-time pipeline metrics and stage conversion forecasting',
        'Audit logs provide accountability on deal stage updates',
      ],
      ctaText: 'Equip Your Sales Team',
    },
    {
      id: 'b2b-agencies',
      icon: Briefcase,
      badge: 'B2B Agencies & Consultancies',
      title: 'Master Multi-Stakeholder Client Lifecycles',
      description:
        'Managing complex proposals and retainer negotiations requires clean contact mapping and precise activity timelines. Track every meeting, deck, and agreement in one place.',
      benefits: [
        'Atomic lead-to-company conversion prevents duplicate records',
        'Comprehensive activity feeds tracking calls, notes, and emails',
        'Visual Kanban board mapped to proposal and contract stages',
        'Shared visibility for account directors and delivery leads',
      ],
      ctaText: 'Explore Agency Workflows',
    },
    {
      id: 'startups',
      icon: Rocket,
      badge: 'Startup Founders',
      title: 'Close Your First 100 Customers at High Velocity',
      description:
        'Founders wearing multiple hats need a CRM that takes 30 seconds to update after a customer discovery call. Focus on product-market fit and pipeline conversion.',
      benefits: [
        'Zero setup gate friction with pre-loaded demo sandbox',
        'Quick-add modals for deals, leads, and follow-up tasks',
        'Global search (Ctrl+K) for instant record retrieval',
        'Exportable records for investor and board reporting',
      ],
      ctaText: 'Launch Founder Workspace',
    },
  ];

  return (
    <MarketingLayout>
      <SEOHead
        title="Solutions by Industry & Team Size | CoreDesk CRM"
        description="Discover how CoreDesk CRM helps small businesses, sales teams, B2B agencies, and startups streamline pipeline execution and eliminate administrative waste."
        canonicalPath="/solutions"
        schema={ORGANIZATION_SCHEMA}
      />

      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Execution Systems</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Solutions Tailored to <span className="text-emerald-400">Your Sales Workflow</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you are a solo founder scaling your first client roster or a 15-rep sales team, CoreDesk CRM eliminates guesswork.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {solutions.map((sol, index) => {
          const Icon = sol.icon;
          const isEven = index % 2 === 1;
          return (
            <div
              key={sol.id}
              id={sol.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                index > 0 ? 'pt-12 border-t border-slate-800' : ''
              }`}
            >
              <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-2' : ''}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sol.badge}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  {sol.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{sol.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {sol.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    <span>{sol.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''}`}>
                <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-700 text-slate-400">
                    <span className="font-semibold text-white">Solution Playbook</span>
                    <span className="font-mono text-emerald-400">100% Focused</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                      <span className="text-slate-300">Administrative Overhead</span>
                      <span className="font-bold text-emerald-400">Reduced by 75%</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                      <span className="text-slate-300">Stale Deal Detection</span>
                      <span className="font-bold text-emerald-400">Automated (7-day rule)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                      <span className="text-slate-300">Onboarding Velocity</span>
                      <span className="font-bold text-emerald-400">&lt; 1 Minute Setup</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Conversion Banner */}
      <section className="py-16 bg-slate-950 border-t border-slate-800 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">See which solution fits your business</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Try CoreDesk CRM now with an instant guest workspace preview or create a free account.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <span>Launch Live Preview</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
};
