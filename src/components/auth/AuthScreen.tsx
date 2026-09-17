import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Kanban,
  Target,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from '../../router/RouterContext';
import { SEOHead } from '../seo/SEOHead';

export const AuthScreen: React.FC<{ isSignup?: boolean }> = ({ isSignup = false }) => {
  const { user, signInWithGoogle, signInQuickDemo, loading } = useAuth();
  const { navigate } = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogle = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      navigate('/app');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDemo = async () => {
    try {
      setIsSigningIn(true);
      await signInQuickDemo();
      navigate('/app');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-sans antialiased">
      <SEOHead
        title={isSignup ? 'Create Workspace | CoreDesk CRM' : 'Sign In | CoreDesk CRM'}
        description="Secure authentication portal for CoreDesk CRM sales workspace."
        canonicalPath={isSignup ? '/signup' : '/login'}
        noIndex={true}
      />

      {/* Top Brand Bar */}
      <header className="px-6 sm:px-10 py-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-4">
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
              <span className="text-xs text-slate-400">Action-First Sales Execution</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Marketing Overview</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 pl-4 border-l border-slate-800">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Zero-Trust ABAC Security</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Sign-in Canvas */}
      <main className="max-w-6xl mx-auto px-6 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Column: Core Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Action-First Sales Execution Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Stop managing records. <br />
            <span className="text-emerald-400">Start closing deals.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            CoreDesk CRM is designed from the ground up for small teams who need clarity, not clutter.
            Built on a rigid operational workflow that converts attention into won revenue.
          </p>

          {/* The Operating Loop */}
          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 max-w-xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
              The CoreDesk Operating Loop
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700/60 font-semibold text-slate-200">
                Data
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700/60 font-semibold text-slate-200">
                Attention
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700/60 font-semibold text-slate-200">
                Priority
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700/60 font-semibold text-emerald-300">
                Next Action
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-700/60 font-semibold text-slate-200">
                Follow-up
              </div>
              <div className="p-2 rounded bg-emerald-900/80 border border-emerald-600 font-bold text-white">
                Outcome
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300 max-w-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Action Center flagging overdue follow-ups</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stale deal detection (≥ 7 days inactive)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Deterministic lead-to-account conversion</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Immutable audit logs for compliance</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5">
          <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                {isSignup ? 'New Workspace Registration' : 'Secure Authentication'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {isSignup ? 'Create CoreDesk Workspace' : 'Sign in to CoreDesk CRM'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isSignup
                  ? 'Get started immediately. Zero configuration required to launch.'
                  : 'Access your organization workspace, active pipeline, and daily action queue.'}
              </p>
            </div>

            {user ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="text-xs font-semibold text-emerald-800">
                  You are signed in as <span className="font-bold">{user.email || user.displayName}</span>.
                </div>
                <Link
                  to="/app"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>Go to CRM Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Google Authentication Button */}
                <button
                  id="google-signin-btn"
                  onClick={handleGoogle}
                  disabled={isSigningIn || loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-all hover:border-slate-400 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isSignup ? 'Sign up with Google' : 'Continue with Google'}</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">
                    or instant sandbox access
                  </span>
                </div>

                {/* Quick Demo Sign-In Button */}
                <button
                  id="quick-demo-signin-btn"
                  onClick={handleDemo}
                  disabled={isSigningIn || loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
                >
                  <span>Instant Guest Workspace Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Toggle between login and signup */}
                <div className="text-center text-xs text-slate-500 pt-1">
                  {isSignup ? (
                    <span>
                      Already have a CoreDesk workspace?{' '}
                      <Link to="/login" className="font-bold text-emerald-700 hover:underline">
                        Sign In
                      </Link>
                    </span>
                  ) : (
                    <span>
                      Need a new team workspace?{' '}
                      <Link to="/signup" className="font-bold text-emerald-700 hover:underline">
                        Create Free Account
                      </Link>
                    </span>
                  )}
                </div>

                <div className="pt-2 text-[11px] text-slate-500 text-center leading-relaxed border-t border-slate-100">
                  Multi-tenant organization data is strictly isolated by authenticated UID and protected by verified backend security rules.
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800/80">
        CoreDesk CRM • Production Small Business Edition • Zero Unsolicited Modules
      </footer>
    </div>
  );
};
