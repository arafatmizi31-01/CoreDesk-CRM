import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEOHead } from '../../components/seo/SEOHead';
import { Link } from '../../router/RouterContext';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface ArticleData {
  slug: string;
  title: string;
  metaDesc: string;
  category: string;
  readTime: string;
  publishedDate: string;
  excerpt: string;
  content: string[];
}

const ARTICLES: Record<string, ArticleData> = {
  'action-first-crm-playbook': {
    slug: 'action-first-crm-playbook',
    title: 'The Action-First CRM Playbook: Turning Attention into Closed Revenue',
    metaDesc:
      'Discover the CoreDesk action-first framework. How modern sales teams replace passive database maintenance with operational urgency and clear daily priorities.',
    category: 'Sales Strategy',
    readTime: '6 min read',
    publishedDate: 'September 12, 2026',
    excerpt:
      'Traditional CRMs treat customer records like museum artifacts—carefully categorized, dusty, and rarely acted upon. Learn how the 6-stage Operating Loop converts attention into closed revenue.',
    content: [
      'For two decades, enterprise software vendors convinced businesses that the goal of a CRM was record-keeping. The more custom fields, dropdowns, and relationships you logged, the "better" your sales operation was assumed to be.',
      'In reality, the opposite occurred. Sales representatives spent 40% of their work week inputting data for sales managers, while active buyer inquiries sat unaddressed. When sales teams are burdened with administrative friction, deal velocity collapses.',
      'The Action-First CRM framework inverts this dynamic. Instead of expecting reps to dig through hundreds of account pages to find what needs attention, the CRM computes the highest-leverage touchpoints every morning.',
      'By combining automated overdue follow-up queues with 7-day stale deal sentinels, reps log in and immediately see their battle plan for the day: which contracts need signature nudges, which demos require recap notes, and which stalled negotiations need executive intervention.',
    ],
  },
  'why-traditional-crms-fail-sales-reps': {
    slug: 'why-traditional-crms-fail-sales-reps',
    title: 'Why Traditional CRMs Fail Sales Reps (And How to Fix It)',
    metaDesc:
      'Explore the root causes of CRM adoption failure: cognitive overload, slow interfaces, and misaligned incentives. Learn how streamlined workflows drive 100% rep adoption.',
    category: 'Sales Operations',
    readTime: '5 min read',
    publishedDate: 'September 8, 2026',
    excerpt:
      'Over 60% of CRM implementations fail or suffer low rep compliance. The culprit is not lazy reps—it is broken software architecture that favors compliance over velocity.',
    content: [
      'Ask any high-performing account executive how they feel about their CRM, and you will usually hear words like "clunky," "slow," and "bureaucratic." Most enterprise CRMs were built for CFOs and sales operations directors, not the frontline reps closing business.',
      'When logging a single phone call requires opening three nested tabs, clicking through five mandatory dropdown menus, and waiting for slow scripts to load, reps naturally resist. They keep their real notes in Apple Notes or scratchpads.',
      'CoreDesk CRM was engineered under a strict mandate: zero unsolicited modules. Every interaction must take fewer than three clicks. Global search (Ctrl+K) retrieves any company, contact, or deal instantly. Quick-add modals allow notes and tasks to be logged in 10 seconds without navigating away.',
    ],
  },
  'how-to-prevent-pipeline-stagnation': {
    slug: 'how-to-prevent-pipeline-stagnation',
    title: 'How to Prevent Pipeline Stagnation with Automated Stale Deal Triggers',
    metaDesc:
      'Pipeline rot destroys quarterly revenue forecasts. Learn how algorithmic inactivity monitoring prevents dormant opportunities from being counted as healthy deals.',
    category: 'Pipeline Management',
    readTime: '7 min read',
    publishedDate: 'August 29, 2026',
    excerpt:
      'Most deals do not end with a definitive "no." They die quietly of neglect in Proposal Sent or Negotiation. Here is how algorithmic inactivity monitoring keeps pipeline clean.',
    content: [
      'In sales forecasting, false optimism is more dangerous than bad news. When a deal sits untouched in the "Proposal Sent" stage for three weeks, reps often keep it in the forecast because no one has formally said no.',
      'At quarter end, the predictable surprise hits: 30% of forecast revenue drops out because the prospects disengaged weeks earlier.',
      'The solution is algorithmic stale deal detection. In CoreDesk CRM, the system monitors the elapsed calendar time since the last verified activity (call, email, or meeting note). If seven days elapse with zero touches, the deal is automatically stamped with a visual warning tag across all Kanban boards and list views.',
      'This gives sales leadership instant visibility during pipeline reviews: instead of asking "how is this deal going?", managers can ask "why has this account been untouched for 11 days?"',
    ],
  },
  'deterministic-lead-to-account-conversion': {
    slug: 'deterministic-lead-to-account-conversion',
    title: 'The Architecture of Deterministic Lead-to-Account Conversion',
    metaDesc:
      'Deep dive into the data integrity benefits of atomic lead conversion. Why atomic creation of companies, contacts, and deals eliminates orphaned CRM records.',
    category: 'CRM Architecture',
    readTime: '5 min read',
    publishedDate: 'August 15, 2026',
    excerpt:
      'How poor lead conversion logic ruins CRM database hygiene, and how an atomic, deterministic state machine guarantees clean multi-tenant sales entities.',
    content: [
      'Every CRM database admin has faced the nightmare of duplicate company records: "Acme Inc.", "Acme Corporation", and "Acme Corp" all existing simultaneously with different contacts attached to each.',
      'This fragmentation happens at the moment of lead conversion. When software leaves company matching to manual guesswork or creates disconnected records, data hygiene quickly degrades.',
      'CoreDesk implements deterministic lead conversion: when an inbound lead is qualified, an atomic transaction reconciles existing company domains or creates a single authoritative Company record, creates the associated Contact, and opens a new Pipeline Deal with full foreign key integrity.',
    ],
  },
};

export const BlogPage: React.FC<{ slug?: string }> = ({ slug }) => {
  const currentArticle = slug ? ARTICLES[slug] : null;

  if (currentArticle) {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: currentArticle.title,
      description: currentArticle.metaDesc,
      datePublished: '2026-09-12',
      author: {
        '@type': 'Organization',
        name: 'CoreDesk Editorial Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'CoreDesk CRM',
        url: 'https://coredesk.crm',
      },
    };

    return (
      <MarketingLayout>
        <SEOHead
          title={`${currentArticle.title} | CoreDesk Guides`}
          description={currentArticle.metaDesc}
          canonicalPath={`/blog/${currentArticle.slug}`}
          ogType="article"
          schema={articleSchema}
        />

        <article className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/blog" className="hover:text-white">
              Guides & Playbooks
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 font-semibold">{currentArticle.category}</span>
          </div>

          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                {currentArticle.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {currentArticle.publishedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentArticle.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {currentArticle.title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed italic border-l-2 border-emerald-500 pl-4 py-1">
              {currentArticle.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <div className="pt-6 border-t border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
            {currentArticle.content.map((paragraph, index) => (
              <p key={index} className="text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Callout Box */}
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Put this playbook into practice</span>
            </div>
            <p className="text-xs text-slate-300">
              CoreDesk CRM is preconfigured with the Action Center and Stale Deal Engine discussed in this article.
              Test it immediately in sandbox mode.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </MarketingLayout>
    );
  }

  // Directory View (/blog)
  return (
    <MarketingLayout>
      <SEOHead
        title="Sales Playbooks, Guides & Execution Insights | CoreDesk CRM"
        description="Read actionable sales execution playbooks, pipeline hygiene strategies, and CRM engineering guides for high-velocity teams."
        canonicalPath="/blog"
      />

      <section className="py-16 sm:py-20 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Organic Growth & Sales Playbooks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Sales Guides & <span className="text-emerald-400">Execution Insights</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Practical strategies on pipeline velocity, preventing deal rot, and building sales execution loops that scale.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(ARTICLES).map((art) => (
            <article
              key={art.slug}
              className="p-6 sm:p-8 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col justify-between hover:border-emerald-500/50 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-semibold border border-slate-750">
                    {art.category}
                  </span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight hover:text-emerald-400 transition-colors">
                  <Link to={`/blog/${art.slug}`}>{art.title}</Link>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">{art.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <Link
                  to={`/blog/${art.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-xs text-slate-500">{art.publishedDate}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
};
