import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEOHead } from '../../components/seo/SEOHead';
import { SOFTWARE_APPLICATION_SCHEMA } from '../../utils/seoConfig';
import { Link } from '../../router/RouterContext';
import {
  Clock,
  AlertTriangle,
  Zap,
  Kanban,
  Shield,
  FileText,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  return (
    <MarketingLayout>
      <SEOHead
        title="Features | CoreDesk CRM - Action Center, Stale Deal Engine & ABAC Security"
        description="Explore CoreDesk CRM features: Overdue action triage, algorithmic stale deal detection, deterministic lead conversion, and zero-trust ABAC security."
        canonicalPath="/features"
        schema={SOFTWARE_APPLICATION_SCHEMA}
      />

      {/* Hero Header */}
      <section className="py-16 sm:py-20 border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineered for Execution</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Features Built Around <span className="text-emerald-400">Action</span>, Not Administration
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every feature in CoreDesk CRM serves one purpose: giving reps total clarity on what to do next to convert pipeline into revenue.
          </p>
        </div>
      </section>

      {/* Feature Deep Dive Sections */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Feature 1: Action Center */}
        <div id="action-center" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Action Center: Never Let Follow-ups Expire
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sales reps lose high-intent deals not from lack of ambition, but from missed follow-up windows.
              The Action Center continuously surfaces overdue tasks, unconfirmed meeting summaries, and pending inquiries.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time overdue badges on rep dashboards</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority escalation based on deal stage and revenue size</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-click completion and instant next-action scheduling</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-3">
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              CoreDesk Action Center • Priority View
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-100">Deliver Enterprise Security Questionnaire</div>
                <div className="text-[11px] text-rose-400">Overdue by 24h • High Priority</div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
                Action Required
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-100">Schedule Solution Deep-Dive with VP of Eng</div>
                <div className="text-[11px] text-amber-400">Due today • Moderate Priority</div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Pending Touch
              </span>
            </div>
          </div>
        </div>

        {/* Feature 2: Stale Deal Sentry */}
        <div id="stale-detection" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-800">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/60 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Stale Deal Engine: 7-Day Inactivity Warning
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Deals without logged touches for 7+ calendar days are automatically flagged across your pipeline board
              and deals list. Sales managers can instantly spot stalled conversations and intervene before prospects buy elsewhere.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic timestamp calculation on all deal interactions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Distinct amber and rose visual indicators on pipeline cards</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Managerial oversight on neglected territories</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 lg:order-1 p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-3">
            <div className="text-[11px] font-mono text-rose-400 uppercase tracking-wider">
              Automated Stale Deal Alert • Pipeline Board
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-rose-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Quantum Logistics - Fleet Deployment</span>
                <span className="text-[11px] font-mono font-bold text-emerald-400">$64,000</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Last activity: 11 days ago (Stage: Negotiation)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automatic flag triggered. Recommended: schedule follow-up or mark as Stale Lost.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 3: Deterministic Lead Conversion */}
        <div id="lead-conversion" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-800">
          <div className="lg:col-span-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Deterministic Lead-to-Account Conversion
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional CRMs force users through multi-page wizards that create orphaned contacts or duplicate company records.
              CoreDesk converts qualified leads into an Account, a Contact, and an active Pipeline Deal in one atomic operation.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero duplicate company or contact record creation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atomic transaction preserving audit history</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Auto-populates deal stage and expected revenue</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-3">
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              1-Click Conversion Pipeline
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-800/60 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-slate-300">Source Lead:</span>
                <span className="font-bold text-white">David Miller (Vertex Cloud)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <div className="text-emerald-400 font-bold">Company</div>
                  <div className="text-slate-300 truncate">Vertex Cloud</div>
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <div className="text-emerald-400 font-bold">Contact</div>
                  <div className="text-slate-300 truncate">David Miller</div>
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <div className="text-emerald-400 font-bold">Deal</div>
                  <div className="text-slate-300 truncate">$32,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4: Zero-Trust Security */}
        <div id="security" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-800">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Zero-Trust ABAC Security & Immutable Audit Logs
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Protect your customer database from unauthorized export or accidental tampering.
              Attribute-based access control enforces least-privilege boundaries between Owner, Manager, and Sales Rep roles.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tenant isolation at the database security rules layer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complete audit logging of deal adjustments and deletions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Secure role-switching simulator for workspace admins</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 lg:order-1 p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-3">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              Attribute-Based Access Control Architecture
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-800/50 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Owner/Admin</span>
                <span className="font-mono text-emerald-400">Full Workspace & Billing Scope</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Sales Manager</span>
                <span className="font-mono text-cyan-400">Team Pipeline & Reassignment Scope</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Sales Rep</span>
                <span className="font-mono text-amber-400">Assigned Deals & Activity Scope</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 5: Visual Pipeline Board */}
        <div id="pipeline" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-800">
          <div className="lg:col-span-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <Kanban className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Action-Driven Pipeline & Stage Forecasting
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Maintain an accurate pulse on your pipeline with an interactive drag-and-drop Kanban board.
              Calculates weighted revenue forecasts and stage conversion rates automatically without tedious spreadsheet exports.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fluid drag-and-drop deal stage progression</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Weighted pipeline forecasting based on verified stage probability</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Filters by rep, company, priority tier, and close date</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-3">
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              Visual Pipeline Kanban • Multi-Stage Board
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/70 space-y-1">
                <div className="text-[11px] text-slate-400 font-medium">Discovery (20%)</div>
                <div className="font-bold text-white">$45,000</div>
                <div className="text-[10px] text-emerald-400 font-mono">3 deals</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/70 space-y-1">
                <div className="text-[11px] text-slate-400 font-medium">Proposal (60%)</div>
                <div className="font-bold text-white">$82,000</div>
                <div className="text-[10px] text-emerald-400 font-mono">2 deals</div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 space-y-1">
                <div className="text-[11px] text-emerald-300 font-medium">Won (100%)</div>
                <div className="font-bold text-white">$120,000</div>
                <div className="text-[10px] text-emerald-400 font-mono">4 deals</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 6: Audit Trails & Activity History */}
        <div id="audit" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-800">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-violet-950 text-violet-400 border border-violet-800/60 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Immutable Activity Timelines & Audit Trails
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every client interaction is logged in a chronological audit stream. Calls, meeting notes, stage advancements,
              and deal reassignments are permanently recorded for team accountability and compliance.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Centralized timeline linking calls, emails, notes, and tasks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Accountability on rep ownership changes and value revisions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chronological event log accessible from any deal or contact card</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 lg:order-1 p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-3">
            <div className="text-[11px] font-mono text-violet-400 uppercase tracking-wider">
              Chronological Activity & Audit Stream
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200">Call Logged: Q3 Tech Demo</span>
                  <div className="text-[10px] text-slate-400">By Alex Morgan • Today at 10:15 AM</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Call</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200">Stage Advanced: Proposal Sent</span>
                  <div className="text-[10px] text-slate-400">Probability updated to 60%</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">Stage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-950 border-t border-slate-800 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Experience all features in action</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Jump straight into our interactive guest workspace to test the Action Center, Stale Deal Engine, and Pipeline Board.
        </p>
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <span>Launch Live Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
};
