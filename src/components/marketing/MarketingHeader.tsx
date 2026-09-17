import React, { useState } from 'react';
import { Link, useRouter } from '../../router/RouterContext';
import { Shield, Sparkles, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MarketingHeader: React.FC = () => {
  const { path, navigate } = useRouter();
  const { user, signInQuickDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Use Cases', href: '/use-cases' },
    { label: 'Comparisons', href: '/compare' },
    { label: 'Guides & Blog', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const handleLaunchDemo = async () => {
    try {
      setIsDemoLoading(true);
      if (user) {
        navigate('/app');
      } else {
        await signInQuickDemo();
        navigate('/app');
      }
    } catch (err) {
      console.error('Demo launch error:', err);
      navigate('/login');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-emerald-500 transition-colors">
            CD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-lg">CoreDesk</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                CRM
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-slate-400 font-medium">Action-First Sales Execution</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = path === link.href || (link.href !== '/' && path.startsWith(link.href));
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-emerald-400 bg-slate-800/80'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <Link
              to="/app"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <span>Go to CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </Link>
              <button
                onClick={handleLaunchDemo}
                disabled={isDemoLoading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <span>{isDemoLoading ? 'Launching...' : 'Try CoreDesk'}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = path === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive ? 'text-emerald-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm"
              >
                <span>Go to CRM Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 font-semibold text-xs"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLaunchDemo();
                  }}
                  disabled={isDemoLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm"
                >
                  <span>{isDemoLoading ? 'Launching...' : 'Try CoreDesk'}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
