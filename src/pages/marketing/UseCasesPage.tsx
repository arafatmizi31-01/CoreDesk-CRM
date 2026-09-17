import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEOHead } from '../../components/seo/SEOHead';
import { ORGANIZATION_SCHEMA } from '../../utils/seoConfig';
import { Link, useRouter } from '../../router/RouterContext';
import {
  Inbox,
  AlertTriangle,
  Kanban,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface UseCaseData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  badge: string;
  icon: any;
  summary: string;
  painPoints: string[];
  coreDeskFixes: string[];
  workflow: string[];
}

const USE_CASES: Record<string, UseCaseData> = {
  'inbound-lead-triage': {
    slug: 'inbound-lead-triage',
    title: 'Rapid Inbound Lead Triage & Qualification',
    metaTitle: 'Inbound Lead Triage & Qualification | CoreDesk CRM Use Case',
    metaDesc:
      'Convert inbound website inquiries and demo requests into verified accounts, contacts, and active pipeline deals in under 30 seconds with zero data duplication.',
    badge: 'Lead Qualification',
    icon: Inbox,
    summary:
      'Inbound leads rot when reps are forced to manually copy emails, domain names, and job titles across multiple CRM tables. CoreDesk eliminates the friction with atomic 1-click conversion.',
    painPoints: [
      'Inbound leads sitting unattended for days without owner assignment',
      'Duplicate contacts and fragmented company accounts created by manual data entry',
      'Disconnection between the initial inquiry message and the pipeline deal',
    ],
    coreDeskFixes: [
      'Visual lead queue highlighting qualification status (New, Contacted, Qualified)',
      'Deterministic Lead-to-Account conversion in one unified transaction',
      'Automatic generation of Company, Contact, and Deal with zero lost notes',
    ],
    workflow: [
      'Inbound lead appears instantly in the Leads triage view.',
      'Rep qualifies interest and clicks "Convert Lead".',
      'CoreDesk automatically links or creates the Company and Contact record.',
      'A new Deal is immediately generated in the Pipeline board with next action scheduled.',
    ],
  },
  'stale-deal-recovery': {
    slug: 'stale-deal-recovery',
    title: 'Stale Deal Recovery & Inactivity Alerting',
    metaTitle: 'Stale Deal Recovery & Pipeline Inactivity Alerting | CoreDesk CRM',
    metaDesc:
      'Prevent deals from silently stalling. CoreDesk CRM automatically alerts sales managers and reps when an opportunity has had no logged activity for 7+ calendar days.',
    badge: 'Pipeline Hygiene',
    icon: AlertTriangle,
    summary:
      'Pipeline rot is the #1 silent killer of sales forecasts. Opportunities sit in "Proposal Sent" for weeks while reps assume everything is fine. CoreDesk flags inactivity mathematically.',
    painPoints: [
      'Deals sitting in late pipeline stages without any client communication',
      'End-of-quarter surprises where forecast deals turn out to have gone cold weeks earlier',
      'Managers lacking a quick way to audit rep pipeline hygiene',
    ],
    coreDeskFixes: [
      'Algorithmic 7-day inactivity calculation based on verified activity logs',
      'Visual warning tags on both Kanban boards and list views',
      'Action Center reminders prompting reps to schedule re-engagement touches',
    ],
    workflow: [
      'Opportunity passes 7 calendar days without a logged meeting, note, or task.',
      'Stale Deal engine flags the deal card with an amber/rose warning indicator.',
      'Action Center prompts rep: "Opportunity Inactive - Schedule Follow-up".',
      'Rep logs a call or note, automatically resetting the freshness timer.',
    ],
  },
  'pipeline-transparency': {
    slug: 'pipeline-transparency',
    title: 'Multi-Rep Pipeline Transparency & Forecasting',
    metaTitle: 'Pipeline Transparency & Stage Forecasting | CoreDesk CRM Use Case',
    metaDesc:
      'Give founders and sales leaders real-time visibility into stage probabilities, deal sizes, and rep activity without interrupting reps with status meetings.',
    badge: 'Sales Operations',
    icon: Kanban,
    summary:
      'Stop holding weekly pipeline interrogations. CoreDesk CRM provides interactive Kanban visibility with automatic stage totals, weighted forecasts, and activity history.',
    painPoints: [
      'Wasted hours every Monday reconciling spreadsheets for sales standups',
      'Uncertainty about true pipeline value vs wishful thinking',
      'Lack of clear owner attribution across shared territories',
    ],
    coreDeskFixes: [
      'Interactive Kanban board with fluid drag-and-drop stage progression',
      'Weighted revenue forecasting calculated from stage probabilities',
      'Filterable by rep, company, and expected close month',
    ],
    workflow: [
      'Reps drag deals across stages (Discovery ➔ Demo ➔ Proposal ➔ Won).',
      'Pipeline metrics update in real time with calculated stage values.',
      'Managers inspect the live board during 1-on-1s without spreadsheet exports.',
    ],
  },
  'b2b-agency-crm': {
    slug: 'b2b-agency-crm',
    title: 'B2B Agency & Retainer Client Management',
    metaTitle: 'B2B Agency CRM: Account & Retainer Management | CoreDesk CRM',
    metaDesc:
      'Manage complex multi-stakeholder agency proposals, scope approvals, and ongoing client relationships with clean contact hierarchies and activity histories.',
    badge: 'Agencies & Consultancies',
    icon: Briefcase,
    summary:
      'Agencies operate on relationships, not transactional checkouts. CoreDesk maps multiple client contacts to companies, logs discovery notes, and manages retainer proposals.',
    painPoints: [
      'Multiple decision-makers at client accounts causing communication overlaps',
      'Lost context when account directors transition accounts to delivery teams',
      'Scattered proposal notes across emails, Slack, and Google Docs',
    ],
    coreDeskFixes: [
      'Unified Company record linking all subsidiary contacts and active deals',
      'Centralized activity timeline capturing calls, briefs, and next steps',
      'Secure ABAC permissions keeping client databases organized',
    ],
    workflow: [
      'Agency logs prospective client brand and contacts under one Company.',
      'Scoping discovery calls and proposal versions are attached to the Deal timeline.',
      'Upon closing, the delivery team references the full audit log and notes.',
    ],
  },
};

export const UseCasesPage: React.FC<{ slug?: string }> = ({ slug }) => {
  const currentUseCase = slug ? USE_CASES[slug] : null;

  if (currentUseCase) {
    const Icon = currentUseCase.icon;
    return (
      <MarketingLayout>
        <SEOHead
          title={currentUseCase.metaTitle}
          description={currentUseCase.metaDesc}
          canonicalPath={`/use-cases/${currentUseCase.slug}`}
          schema={ORGANIZATION_SCHEMA}
        />

        <article className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/use-cases" className="hover:text-white">
              Use Cases
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 font-semibold">{currentUseCase.badge}</span>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold">
              <Icon className="w-3.5 h-3.5" />
              <span>{currentUseCase.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {currentUseCase.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {currentUseCase.summary}
            </p>
          </div>

          {/* Pain vs Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400">
                The Friction in Traditional Workflows
              </h2>
              <ul className="space-y-3 text-xs text-slate-300">
                {currentUseCase.painPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                The CoreDesk CRM Solution
              </h2>
              <ul className="space-y-3 text-xs text-slate-300">
                {currentUseCase.coreDeskFixes.map((fix) => (
                  <li key={fix} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step-by-Step Workflow */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-6">
            <h2 className="text-lg font-bold text-white">How It Executes in CoreDesk CRM</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentUseCase.workflow.map((step, idx) => (
                <div key={step} className="p-4 rounded-xl bg-slate-900 border border-slate-750/70 space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400">Step 0{idx + 1}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8 space-y-4 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white">Ready to test this use case live?</h3>
            <div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                <span>Launch Instant Guest Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>
      </MarketingLayout>
    );
  }

  // Directory View (/use-cases)
  return (
    <MarketingLayout>
      <SEOHead
        title="Sales Use Cases & Execution Playbooks | CoreDesk CRM"
        description="Explore CoreDesk CRM use cases: Inbound lead triage, stale deal recovery, pipeline transparency, and B2B agency client management."
        canonicalPath="/use-cases"
        schema={ORGANIZATION_SCHEMA}
      />

      <section className="py-16 sm:py-20 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operational Playbooks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Sales Use Cases Built for <span className="text-emerald-400">Pure Velocity</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            See how CoreDesk CRM automates key operational moments in the sales pipeline so your team can focus on closing.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(USE_CASES).map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.slug}
                className="p-6 sm:p-8 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-emerald-400 border border-slate-700 text-xs font-semibold">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{uc.badge}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{uc.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">{uc.summary}</p>
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <Link
                    to={`/use-cases/${uc.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Read complete playbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link to="/login" className="text-xs text-slate-400 hover:text-white">
                    Try in Demo
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </MarketingLayout>
  );
};
