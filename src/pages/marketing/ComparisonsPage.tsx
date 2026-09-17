import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEOHead } from '../../components/seo/SEOHead';
import { Link } from '../../router/RouterContext';
import {
  Scale,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Layers,
  FileSpreadsheet,
  Building2,
} from 'lucide-react';

interface ComparisonData {
  slug: string;
  competitor: string;
  badge: string;
  icon: any;
  title: string;
  metaTitle: string;
  metaDesc: string;
  summary: string;
  coreDeskAdvantages: string[];
  competitorDrawbacks: string[];
  featureMatrix: Array<{ feature: string; coredesk: string | boolean; competitor: string | boolean }>;
}

const COMPARISONS: Record<string, ComparisonData> = {
  'coredesk-vs-traditional-crm': {
    slug: 'coredesk-vs-traditional-crm',
    competitor: 'Traditional Enterprise CRMs',
    badge: 'Enterprise Comparison',
    icon: Building2,
    title: 'CoreDesk CRM vs Traditional Enterprise CRMs',
    metaTitle: 'CoreDesk CRM vs Traditional Enterprise CRMs | Honest Comparison',
    metaDesc:
      'Compare CoreDesk CRM with traditional legacy CRMs. See why small businesses and growing teams choose an action-first sales loop over multi-month setups and bloated licensing.',
    summary:
      'Legacy CRMs were designed twenty years ago to satisfy corporate IT managers and CFO audit committees. CoreDesk CRM was built specifically for modern frontline sales reps who need to move pipeline fast.',
    coreDeskAdvantages: [
      'Zero onboarding delay: start logging calls and deals in under 60 seconds',
      'Automated daily Action Center highlights overdue follow-ups',
      'Algorithmic 7-day stale deal alert prevents pipeline rot',
      'Predictable pricing without multi-tier storage extortion',
    ],
    competitorDrawbacks: [
      'Mandatory 3 to 6-month consulting implementations costing thousands',
      'Dozens of mandatory fields that slow down rep deal logging',
      'Fragmented UI with complex nested menus and slow page loads',
      'Opaque contracts requiring annual upfront commitments per seat',
    ],
    featureMatrix: [
      { feature: 'Time to First Value', coredesk: '< 1 minute (Instant sandbox)', competitor: '3 - 6 months' },
      { feature: 'Daily Overdue Action Triage', coredesk: 'Automated 1-click center', competitor: 'Manual query reports' },
      { feature: '7-Day Stale Deal Engine', coredesk: 'Algorithmic automatic alerts', competitor: 'Custom scripting required' },
      { feature: 'Deterministic Lead Conversion', coredesk: 'Atomic 1-click transaction', competitor: 'Multi-step manual wizard' },
      { feature: 'Zero Unsolicited Modules', coredesk: true, competitor: false },
      { feature: 'Role-Based ABAC Security', coredesk: true, competitor: 'Add-on license required' },
    ],
  },
  'coredesk-vs-spreadsheets': {
    slug: 'coredesk-vs-spreadsheets',
    competitor: 'Spreadsheets (Excel / Google Sheets)',
    badge: 'Spreadsheet Comparison',
    icon: FileSpreadsheet,
    title: 'CoreDesk CRM vs Spreadsheets & Google Sheets',
    metaTitle: 'CoreDesk CRM vs Spreadsheets: Why Sales Teams Graduate | CoreDesk',
    metaDesc:
      'Why spreadsheets fail growing sales teams: lack of follow-up notifications, broken cell references, zero activity histories, and no pipeline visualization.',
    summary:
      'Spreadsheets are a great scratchpad for day one, but quickly become a liability as soon as you have more than 20 deals or multiple team members touching customer relationships.',
    coreDeskAdvantages: [
      'Visual Kanban pipeline board with automated stage probabilities',
      'Never miss a customer touchpoint with integrated Action Center',
      'Complete, immutable activity timelines (calls, notes, meetings)',
      'Attribute-based access control prevents accidental record overwrites',
    ],
    competitorDrawbacks: [
      'Zero automated follow-up reminders or notification triggers',
      'Reps constantly overwrite each other’s notes or accidentally delete rows',
      'No relationship mapping between people, companies, and deals',
      'No visual sales pipeline or real-time conversion forecasting',
    ],
    featureMatrix: [
      { feature: 'Visual Pipeline Kanban', coredesk: true, competitor: false },
      { feature: 'Automated Action Reminders', coredesk: true, competitor: false },
      { feature: 'Company & Contact Linkage', coredesk: true, competitor: 'Manual copy-paste' },
      { feature: 'Audit Trail / Change History', coredesk: true, competitor: 'Cluttered version history' },
      { feature: 'Concurrent Rep Access Guard', coredesk: true, competitor: 'Risk of cell overwrites' },
    ],
  },
  'coredesk-vs-bloated-sales-platforms': {
    slug: 'coredesk-vs-bloated-sales-platforms',
    competitor: 'Bloated All-in-One Sales Suites',
    badge: 'Bloat-Free Architecture',
    icon: Layers,
    title: 'CoreDesk CRM vs Bloated All-in-One Platforms',
    metaTitle: 'CoreDesk CRM vs Bloated All-in-One Platforms | Speed & Velocity',
    metaDesc:
      'Why paying for marketing automation, ticketing, and CMS bundles inside your CRM slows your sales reps down. Choose an action-focused sales execution engine.',
    summary:
      'Many software suites attempt to bundle marketing hubs, customer support desks, and website builders into a single platform. The result is a slow, convoluted interface where basic sales tasks take minutes instead of seconds.',
    coreDeskAdvantages: [
      '100% focused on sales execution and deal progression',
      'Sub-second page transitions and rapid keyboard shortcuts (Ctrl+K)',
      'No unsolicited module notifications or cross-selling upsells',
      'Transparent flat pricing that does not charge for unused modules',
    ],
    competitorDrawbacks: [
      'Confusing navigation menus packed with tools your sales team never uses',
      'Heavier web bundle size causing laggy mobile and desktop performance',
      'Inflated per-seat pricing justified by unneeded software modules',
      'Constant vendor emails upselling additional marketing or support tiers',
    ],
    featureMatrix: [
      { feature: 'Clean Sales-Only Interface', coredesk: true, competitor: false },
      { feature: 'Sub-Second Navigation', coredesk: true, competitor: false },
      { feature: 'Zero Unsolicited Upsell Popups', coredesk: true, competitor: false },
      { feature: 'Focus on Sales Velocity', coredesk: true, competitor: 'Divided among 6 product suites' },
    ],
  },
};

export const ComparisonsPage: React.FC<{ slug?: string }> = ({ slug }) => {
  const currentComparison = slug ? COMPARISONS[slug] : null;

  if (currentComparison) {
    const Icon = currentComparison.icon;
    return (
      <MarketingLayout>
        <SEOHead
          title={currentComparison.metaTitle}
          description={currentComparison.metaDesc}
          canonicalPath={`/compare/${currentComparison.slug}`}
        />

        <article className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/compare" className="hover:text-white">
              Comparisons
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 font-semibold">{currentComparison.badge}</span>
          </div>

          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold">
              <Icon className="w-3.5 h-3.5" />
              <span>{currentComparison.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {currentComparison.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {currentComparison.summary}
            </p>
          </header>

          {/* Advantages vs Drawbacks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                CoreDesk CRM Advantages
              </h2>
              <ul className="space-y-3 text-xs text-slate-300">
                {currentComparison.coreDeskAdvantages.map((adv) => (
                  <li key={adv} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400">
                {currentComparison.competitor} Limitations
              </h2>
              <ul className="space-y-3 text-xs text-slate-300">
                {currentComparison.competitorDrawbacks.map((drw) => (
                  <li key={drw} className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{drw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature Matrix Table */}
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <h2 className="text-lg font-bold text-white">Feature & Velocity Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="py-3 px-4 font-semibold">Capability</th>
                    <th className="py-3 px-4 font-bold text-emerald-400">CoreDesk CRM</th>
                    <th className="py-3 px-4 font-semibold text-slate-300">{currentComparison.competitor}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {currentComparison.featureMatrix.map((row) => (
                    <tr key={row.feature} className="hover:bg-slate-750/30">
                      <td className="py-3 px-4 font-medium text-slate-200">{row.feature}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-300">
                        {typeof row.coredesk === 'boolean' ? (
                          row.coredesk ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )
                        ) : (
                          row.coredesk
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {typeof row.competitor === 'boolean' ? (
                          row.competitor ? (
                            <CheckCircle2 className="w-4 h-4 text-slate-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )
                        ) : (
                          row.competitor
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8 space-y-4 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white">Experience the CoreDesk difference yourself</h3>
            <div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                <span>Launch Free Sandbox Preview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>
      </MarketingLayout>
    );
  }

  // Directory View (/compare)
  return (
    <MarketingLayout>
      <SEOHead
        title="CoreDesk CRM Comparisons | How We Compare to Legacy & Bloated Tools"
        description="See how CoreDesk CRM compares against enterprise legacy CRMs, spreadsheets, and bloated software suites. Faster setup, action-first triage, and zero bloat."
        canonicalPath="/compare"
      />

      <section className="py-16 sm:py-20 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Honest Architectural Comparisons</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How CoreDesk CRM <span className="text-emerald-400">Compares</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Direct, factual comparisons highlighting operational speed, rep cognitive overhead, and total cost of ownership.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.values(COMPARISONS).map((comp) => {
            const Icon = comp.icon;
            return (
              <div
                key={comp.slug}
                className="p-6 sm:p-8 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-emerald-400 border border-slate-700 text-xs font-semibold">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{comp.badge}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{comp.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">{comp.summary}</p>
                </div>

                <div className="pt-4 border-t border-slate-700/60">
                  <Link
                    to={`/compare/${comp.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>View comparison matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
