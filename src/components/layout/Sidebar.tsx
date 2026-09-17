import React from 'react';
import {
  LayoutDashboard,
  Users2,
  Contact,
  Building2,
  Briefcase,
  Kanban,
  CheckSquare,
  Activity,
  BarChart3,
  Shield,
  Settings,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavView =
  | 'dashboard'
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'deals'
  | 'pipeline'
  | 'tasks'
  | 'activities'
  | 'reports'
  | 'admin'
  | 'settings';

interface SidebarProps {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  counts?: {
    leads: number;
    deals: number;
    tasks: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpenMobile,
  setIsOpenMobile,
  counts,
}) => {
  const { effectiveRole } = useAuth();
  const isPrivileged = effectiveRole === 'Owner/Admin' || effectiveRole === 'Manager';
  const isAdmin = effectiveRole === 'Owner/Admin';

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users2, count: counts?.leads },
    { id: 'contacts', label: 'Contacts', icon: Contact },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'deals', label: 'Deals', icon: Briefcase, count: counts?.deals },
    { id: 'pipeline', label: 'Pipeline Board', icon: Kanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: counts?.tasks },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'CoreDesk Admin', icon: Shield, privilegedOnly: true },
    { id: 'settings', label: 'Workspace Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: NavView) => {
    setActiveView(viewId);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-backdrop"
          aria-hidden="true"
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="coredesk-sidebar"
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 h-full lg:h-[calc(100vh-4rem)] w-72 max-w-[85vw] sm:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl lg:shadow-none box-border ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto py-4 px-3">
          {/* Mobile Header in Drawer with Close (X) button */}
          <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-slate-800 lg:hidden">
            <span className="font-bold text-white text-sm">CoreDesk CRM</span>
            <button
              id="sidebar-close-btn"
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsOpenMobile(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Principle Badge (Section 2) */}
          <div className="px-3 py-2 mb-4 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              Core Operating Loop
            </div>
            <div className="text-[11px] text-slate-300 leading-tight font-medium">
              Data → Attention → Next Action → Outcome
            </div>
          </div>

          {/* Section: CRM WORKFLOW */}
          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            CRM Operations
          </div>
          <nav className="space-y-1 mb-6">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id as NavView)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Section: ADMINISTRATIVE AREA */}
          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Administration
          </div>
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              // Section 36: Do not expose privileged controls to Sales Reps
              if (item.privilegedOnly && !isPrivileged) return null;

              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id as NavView)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'admin' && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                      Admin
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Role Indicator / Product Edition Descriptor (Static branding, non-interactive) */}
        <div
          id="sidebar-brand-descriptor"
          className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between cursor-default select-none"
        >
          <div className="truncate pointer-events-none select-none">
            <span className="block text-slate-300 font-medium truncate">Action-First CRM</span>
            <span className="text-[10px] text-slate-400">Small Teams Edition</span>
          </div>
          <span
            className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shrink-0 cursor-default"
            title="Connected to Cloud Firestore"
          />
        </div>
      </aside>
    </>
  );
};
