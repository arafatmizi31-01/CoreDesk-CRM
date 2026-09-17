import React from 'react';
import { Link } from '../../router/RouterContext';
import { Shield, Sparkles, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';

export const MarketingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                CD
              </div>
              <span className="font-bold text-white tracking-tight text-base">CoreDesk CRM</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Action-first CRM web application for small businesses and growing sales teams.
              Engineered to eliminate administrative sludge and turn operational attention into won revenue.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Zero-Trust ABAC Security • Strict Multi-Tenant Isolation</span>
            </div>
          </div>

          {/* Column: Product */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-slate-200 text-[11px]">Product</div>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="hover:text-emerald-400 transition-colors">
                  Overview & Features
                </Link>
              </li>
              <li>
                <Link to="/features#action-center" className="hover:text-emerald-400 transition-colors">
                  Action Center
                </Link>
              </li>
              <li>
                <Link to="/features#stale-detection" className="hover:text-emerald-400 transition-colors">
                  Stale Deal Engine
                </Link>
              </li>
              <li>
                <Link to="/features#lead-conversion" className="hover:text-emerald-400 transition-colors">
                  Deterministic Conversion
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-emerald-400 transition-colors">
                  Transparent Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Solutions & Use Cases */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-slate-200 text-[11px]">Solutions</div>
            <ul className="space-y-2">
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  All Solutions
                </Link>
              </li>
              <li>
                <Link to="/use-cases/inbound-lead-triage" className="hover:text-emerald-400 transition-colors">
                  Inbound Lead Triage
                </Link>
              </li>
              <li>
                <Link to="/use-cases/stale-deal-recovery" className="hover:text-emerald-400 transition-colors">
                  Stale Deal Recovery
                </Link>
              </li>
              <li>
                <Link to="/use-cases/pipeline-transparency" className="hover:text-emerald-400 transition-colors">
                  Pipeline Transparency
                </Link>
              </li>
              <li>
                <Link to="/use-cases/b2b-agency-crm" className="hover:text-emerald-400 transition-colors">
                  B2B Agency CRM
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Comparisons & Guides */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-slate-200 text-[11px]">Compare & Learn</div>
            <ul className="space-y-2">
              <li>
                <Link to="/compare" className="hover:text-emerald-400 transition-colors">
                  Competitor Matrix
                </Link>
              </li>
              <li>
                <Link to="/compare/coredesk-vs-traditional-crm" className="hover:text-emerald-400 transition-colors">
                  vs Traditional CRMs
                </Link>
              </li>
              <li>
                <Link to="/compare/coredesk-vs-spreadsheets" className="hover:text-emerald-400 transition-colors">
                  vs Spreadsheets
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-emerald-400 transition-colors">
                  Guides & Playbooks
                </Link>
              </li>
              <li>
                <Link to="/blog/action-first-crm-playbook" className="hover:text-emerald-400 transition-colors">
                  Action-First Playbook
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-300">
          <div>
            © {new Date().getFullYear()} CoreDesk CRM. Production Small Business Edition. Zero Unsolicited Modules.
          </div>
          <div className="flex items-center gap-6">
            <a href="/sitemap.xml" className="hover:text-emerald-400 transition-colors">
              Sitemap.xml
            </a>
            <a href="/robots.txt" className="hover:text-emerald-400 transition-colors">
              Robots.txt
            </a>
            <Link to="/login" className="hover:text-emerald-400 transition-colors">
              App Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
