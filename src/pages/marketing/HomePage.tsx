import React, { useState } from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEOHead } from '../../components/seo/SEOHead';
import { ORGANIZATION_SCHEMA, SOFTWARE_APPLICATION_SCHEMA } from '../../utils/seoConfig';
import { Link, useRouter } from '../../router/RouterContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Kanban,
  Shield,
  Zap,
  Building2,
  Users,
  Briefcase,
  Rocket,
  Layers,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet,
  XCircle,
  TrendingUp,
  Activity,
  UserCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { signInQuickDemo } = useAuth();
  const [activeLoopStep, setActiveLoopStep] = useState(0);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const loopSteps = [
    {
      step: '01',
      title: 'Data',
      subtitle: 'Structured Ingestion',
      desc: 'Centralize leads, contacts, and companies with strict schema discipline. No messy custom-field bloat or duplicate records.',
      detail: 'CoreDesk links every contact to an authoritative company account, ensuring communication context is never fragmented across multiple sheets.',
    },
    {
      step: '02',
      title: 'Attention',
      subtitle: 'Inactivity Detection',
      desc: 'The system continuously monitors elapsed time since last verified touchpoint, highlighting dormant accounts automatically.',
      detail: 'If seven days pass without a logged call, meeting, or note, the deal is flagged before it goes cold.',
    },
    {
      step: '03',
      title: 'Priority',
      subtitle: 'Algorithmic Triage',
      desc: 'Sort opportunities by deal value, timeline urgency, and buying stage probability.',
      detail: 'Reps immediately see which high-value deals require prompt attention, preventing smaller tasks from crowding out major revenue.',
    },
    {
      step: '04',
      title: 'Next Action',
      subtitle: 'Mandatory Milestones',
      desc: 'Every active deal must have an explicit next milestone assigned—eliminating orphaned opportunities.',
      detail: 'CoreDesk treats next steps as first-class citizens, ensuring no deal lingers in the pipeline without an owner and a deadline.',
    },
    {
      step: '05',
      title: 'Follow-up',
      subtitle: 'Action Center Execution',
      desc: 'Automated morning action queue surfaces overdue calls, notes, and tasks with 1-click execution.',
      detail: 'Reps open their workspace and immediately receive their daily queue of required follow-ups, reducing administrative decision fatigue.',
    },
    {
      step: '06',
      title: 'Outcome',
      subtitle: 'Deterministic Close',
      desc: 'Clear win/loss attribution, stage conversion history, and immutable audit logs for sales management.',
      detail: 'Managers gain unambiguous visibility into deal cycles, team activity levels, and win rates without running manual report exports.',
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

  const handleScrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MarketingLayout>
      <SEOHead
        title="CoreDesk CRM | Action-First CRM for Small Businesses & Growing Sales Teams"
        description="Action-first CRM for small businesses and growing sales teams. Replace passive record-keeping with an operational action queue, stale deal detection, and deterministic pipeline execution."
        canonicalPath="/"
        schema={[ORGANIZATION_SCHEMA, SOFTWARE_APPLICATION_SCHEMA]}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 text-emerald-400 border border-slate-700/80 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>CoreDesk CRM • Built for Operational Momentum</span>
            </div>

            {/* Core Message Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Action-first CRM for <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                small businesses and growing sales teams.
              </span>
            </h1>

            {/* Sub-headline: What it is & problem it solves */}
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Traditional CRMs are passive digital filing cabinets where customer notes go to be forgotten.
              CoreDesk CRM transforms customer data into an active daily queue—flagging overdue follow-ups,
              surfacing dormant opportunities, and guiding reps on what to do next.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleLaunchDemo}
                disabled={isDemoLoading}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isDemoLoading ? 'Booting Sandbox...' : 'Try CoreDesk'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#how-it-works"
                onClick={handleScrollToHowItWorks}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>See how it works</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Authentic Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant guest sandbox access</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero complex IT configuration</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No credit card required to test</span>
              </span>
            </div>
          </div>

          {/* Interactive Live Teaser Card */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 ml-2 font-mono">coredesk-workspace // action-center</span>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Action Center Active: Overdue Touches Monitored</span>
              </div>
            </div>

            {/* Teaser 3-Column Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Item 1: Overdue follow-up queue */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Action Center Queue</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">
                    PRIORITY 1
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">Acme Industrial • Pricing Review</div>
                      <div className="text-[11px] text-rose-400 font-medium">Overdue by 24h</div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">$34,500</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">Northstar Logistics • Demo Call</div>
                      <div className="text-[11px] text-amber-400 font-medium">Due in 2 hours</div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">$18,000</span>
                  </div>
                </div>
              </div>

              {/* Item 2: Stale Deal Sentry */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>7-Day Stale Deal Engine</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-bold">
                    DORMANT
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-rose-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Atlas Health Partners</span>
                      <span className="text-[11px] font-bold text-rose-400">9 days inactive</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Proposal Sent stage. Automated prompt: Schedule follow-up or mark Lost.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-rose-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Apex Robotics</span>
                      <span className="text-[11px] font-bold text-rose-400">8 days inactive</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Negotiation stage. Contract review pending client touch.</p>
                  </div>
                </div>
              </div>

              {/* Item 3: Atomic 1-Click Conversion */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Deterministic Conversion</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                    ATOMIC
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/60 space-y-2 text-xs">
                  <div className="font-bold text-emerald-300">Lead Qualified ➔ 1 Click</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Atomically generates Company account, Contact profile, and Pipeline Deal in one clean transaction.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                    Lead ➔ Company + Contact + Deal($25k)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 & 2: WHAT COREDESK IS & WHO IT IS FOR */}
      <section className="py-16 sm:py-24 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* What CoreDesk Is */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Clear Purpose</h2>
            <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              What is CoreDesk CRM?
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              CoreDesk CRM is an operational sales platform engineered to eliminate administrative sludge.
              Instead of forcing sales reps to manually browse through endless contact tables, CoreDesk computes
              daily priorities so reps always know the exact next touchpoint required to advance each opportunity.
            </p>
          </div>

          {/* Who It Is For */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Target Audience</h3>
              <p className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                Who CoreDesk is Built For
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Tailored for high-intent teams that prioritize execution over complex administrative paperwork.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Persona 1 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Small Business Owners</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Need a simple, dependable system to organize client relationships and customer callbacks without hiring an IT consultant.
                </p>
              </div>

              {/* Persona 2 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Growing Sales Teams (3–25 Reps)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Require daily rep follow-up discipline, automated stale deal warnings, and pipeline transparency without enterprise pricing traps.
                </p>
              </div>

              {/* Persona 3 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">B2B Agencies & Consultancies</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage multi-stakeholder accounts, lengthy proposal cycles, and retainers with clean contact hierarchies and activity histories.
                </p>
              </div>

              {/* Persona 4 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Founder-Led Sales</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Founders closing their initial customer cohorts who need to log notes in 15 seconds and keep deals moving between product work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT PROBLEM IT SOLVES */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">The Core Friction</h2>
          <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            The Problems CoreDesk Solves
          </p>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Most sales opportunities are not lost to competitors—they are lost to neglect and administrative friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem 1 */}
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-900/60 text-rose-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Forgotten Follow-Ups & Missed Windows</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When tasks are scattered across personal calendars, notepads, and email inboxes, promised follow-up calls slip past their deadline. CoreDesk consolidates all pending touches into a single Action Center with automated urgency flags.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-900/60 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Silent Pipeline Rot (Dormant Deals)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deals often sit untouched in the "Proposal Sent" stage for weeks while sales managers assume negotiations are active. CoreDesk’s Stale Deal Sentry calculates inactivity mathematically and triggers visual alerts after 7 days without contact.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-900/60 text-rose-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Administrative Burden & Rep Resistance</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional CRMs require navigating through five nested menus and filling 30 mandatory fields just to log one meeting note. CoreDesk minimizes clicks with global search (Ctrl+K) and lightweight quick-add modals.
            </p>
          </div>

          {/* Problem 4 */}
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-900/60 text-rose-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Duplicate & Disconnected Records</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ad-hoc spreadsheets lead to conflicting versions, duplicate companies, and zero relationship mapping. CoreDesk enforces clean relational integrity between Companies, Contacts, Deals, and Activities in one place.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY COREDESK IS DIFFERENT */}
      <section className="py-16 sm:py-24 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Architectural Contrast</h2>
            <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Why CoreDesk is Different
            </p>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              A direct comparison of traditional CRM conventions versus CoreDesk’s action-oriented engineering.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-semibold">Aspect</th>
                  <th className="py-3 px-4 font-semibold text-rose-300">Traditional Legacy CRM</th>
                  <th className="py-3 px-4 font-bold text-emerald-400">CoreDesk CRM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Operational Philosophy</td>
                  <td className="py-3.5 px-4 text-slate-400">Passive database for reporting to executives</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-semibold">
                    Action-first queue guiding rep execution every morning
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Overdue Task Handling</td>
                  <td className="py-3.5 px-4 text-slate-400">Buried in buried report tabs or lost in notification spam</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-semibold">
                    Dedicated Action Center surfacing urgent touchpoints
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Inactivity Monitoring</td>
                  <td className="py-3.5 px-4 text-slate-400">Manual review during end-of-month pipeline meetings</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-semibold">
                    Automated 7-day stale deal sentry with visual tags
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Lead Conversion</td>
                  <td className="py-3.5 px-4 text-slate-400">Multi-page wizard with risk of orphaned records</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-semibold">
                    1-click atomic creation of Company, Contact & Deal
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">System Overhead</td>
                  <td className="py-3.5 px-4 text-slate-400">Unsolicited marketing modules and bundled bloat</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-semibold">
                    100% focused on sales execution; zero unwanted modules
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">Time to Value</td>
                  <td className="py-3.5 px-4 text-slate-400">Weeks to months of setup and consultant billing</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-semibold">
                    Instant sandbox preview; under 60 seconds onboarding
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS (THE 6-STAGE OPERATING LOOP) */}
      <section id="how-it-works" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Methodology</h2>
          <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            How CoreDesk Works: The 6-Stage Operating Loop
          </p>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From initial lead qualification to closed revenue, the CoreDesk Operating Loop ensures that every customer touchpoint produces immediate momentum.
          </p>
        </div>

        {/* Loop Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {loopSteps.map((step, idx) => {
            const isSelected = activeLoopStep === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveLoopStep(idx)}
                className={`p-3 sm:p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-slate-400">STEP {step.step}</div>
                <div
                  className={`text-sm font-bold mt-1 ${
                    isSelected ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{step.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Loop Step Detailed Spotlight */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                {loopSteps[activeLoopStep].step}
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {loopSteps[activeLoopStep].title} — {loopSteps[activeLoopStep].subtitle}
                </h3>
                <span className="text-xs text-slate-400">CoreDesk CRM Operational Phase</span>
              </div>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1 rounded border border-slate-750 self-start sm:self-auto">
              Stage {activeLoopStep + 1} of 6
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            {loopSteps[activeLoopStep].desc}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {loopSteps[activeLoopStep].detail}
          </p>

          <div className="pt-4 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveLoopStep((prev) => (prev > 0 ? prev - 1 : loopSteps.length - 1))}
              className="text-slate-400 hover:text-white"
            >
              ← Previous Phase
            </button>
            <button
              onClick={() => setActiveLoopStep((prev) => (prev < loopSteps.length - 1 ? prev + 1 : 0))}
              className="font-bold text-emerald-400 hover:text-emerald-300"
            >
              Next Phase →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: KEY CRM CAPABILITIES */}
      <section className="py-16 sm:py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Platform Scope</h2>
            <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Key CRM Capabilities
            </p>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Engineered with clean architectural boundaries to handle your entire sales lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Capability 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Action Center</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prioritizes overdue tasks and follow-up reminders in real-time. Reps begin every shift with a clear, unambiguous punch list.
              </p>
              <Link to="/features#action-center" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Capability 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">7-Day Stale Deal Sentry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flags deals that haven't received client communication for 7+ calendar days, preventing dormant opportunities from rotting in your pipeline.
              </p>
              <Link to="/features#stale-detection" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Capability 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Deterministic Conversion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converts qualified leads into an Account, primary Contact, and Pipeline Deal in one atomic transaction without manual copying.
              </p>
              <Link to="/features#lead-conversion" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Capability 4 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                <Kanban className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Visual Pipeline Board</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fluid drag-and-drop Kanban view with calculated stage totals, weighted forecast probabilities, and quick status advancement.
              </p>
              <Link to="/features#pipeline" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Capability 5 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero-Trust ABAC Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Attribute-based access control enforces rigid boundaries across Owner/Admin, Sales Manager, and Rep roles with strict multi-tenant isolation.
              </p>
              <Link to="/features#security" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Capability 6 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Audit Trails & Activity Timelines</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracks logged calls, meetings, notes, and deal adjustments in an immutable timeline, providing full accountability on account ownership.
              </p>
              <Link to="/features#audit" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CONVERSION BANNER */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to experience an action-first sales engine?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Test CoreDesk CRM right now in sandbox mode with our preloaded demo workspace. Zero forms, no sales pitches.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={handleLaunchDemo}
              disabled={isDemoLoading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{isDemoLoading ? 'Booting Sandbox...' : 'Try CoreDesk'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              onClick={handleScrollToHowItWorks}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>See how it works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            Includes full access to Action Center, Stale Deal Engine, and Visual Pipeline.
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};
