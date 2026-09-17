import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  User,
  Shield,
  Briefcase,
  Layers,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Notification } from '../../types/crm';
import { NavView } from './Sidebar';

interface HeaderProps {
  onOpenSearch: () => void;
  onQuickAction: (actionType: 'lead' | 'deal' | 'task' | 'activity') => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  activeView: string;
  onNavigateView?: (view: NavView) => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onQuickAction,
  notifications,
  onMarkNotificationRead,
  onNavigateView,
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const { user, member, organization, effectiveRole, setEffectiveRole, logOut } = useAuth();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  return (
    <header
      id="coredesk-global-header"
      className="h-16 w-full max-w-full box-border bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs"
    >
      {/* Brand & Workspace Name + Mobile Hamburger Toggle */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
        {/* Mobile/Tablet Hamburger Toggle (☰) */}
        <button
          id="mobile-menu-toggle-btn"
          type="button"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={onToggleMobileMenu}
          className="p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold shadow-xs shrink-0">
            <span className="text-sm tracking-tight">CD</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">CoreDesk</span>
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-slate-100 font-medium text-slate-600 border border-slate-200">
                CRM
              </span>
            </div>
            {organization && (
              <span className="text-[11px] text-slate-500 font-normal block leading-tight truncate max-w-[110px] sm:max-w-xs">
                {organization.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          id="global-search-trigger"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 font-normal">Search leads, contacts, deals, tasks...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-400 shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Actions, Notifications & User */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {/* Mobile Search Button */}
        <button
          id="mobile-search-trigger"
          type="button"
          aria-label="Search"
          onClick={onOpenSearch}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Quick Action Button */}
        <div className="relative">
          <button
            id="quick-action-dropdown-btn"
            type="button"
            onClick={() => {
              setShowQuickMenu(!showQuickMenu);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Action</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-100 box-border">
              <button
                id="quick-add-lead-btn"
                onClick={() => {
                  onQuickAction('lead');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 min-h-[40px]"
              >
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">L</div>
                <span>New Lead</span>
              </button>
              <button
                id="quick-add-deal-btn"
                onClick={() => {
                  onQuickAction('deal');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 min-h-[40px]"
              >
                <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">D</div>
                <span>New Deal Opportunity</span>
              </button>
              <button
                id="quick-add-task-btn"
                onClick={() => {
                  onQuickAction('task');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 min-h-[40px]"
              >
                <div className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center font-bold">T</div>
                <span>New Task</span>
              </button>
              <button
                id="quick-add-activity-btn"
                onClick={() => {
                  onQuickAction('activity');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 min-h-[40px]"
              >
                <div className="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center font-bold">A</div>
                <span>Log Activity / Note</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="notifications-dropdown-btn"
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowQuickMenu(false);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100 box-border">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-900 text-sm">Actionable Notifications</span>
                <span className="text-[11px] text-slate-500">{unreadNotifs.length} unread</span>
              </div>
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  <span>No alerts right now. All caught up!</span>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-1.5 divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`pt-1.5 pb-1 px-1.5 rounded cursor-pointer transition-colors ${
                        notif.read ? 'opacity-60 hover:opacity-100' : 'bg-emerald-50/50 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>{notif.title}</span>
                        {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            id="user-menu-btn"
            type="button"
            aria-label="User profile menu"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowQuickMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {(member?.name || user?.displayName || 'User').charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {member?.name || user?.displayName || 'Admin'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {effectiveRole}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100 box-border">
              <div className="pb-2.5 mb-2 border-b border-slate-100">
                <div className="font-semibold text-slate-900">{member?.name || 'Arafat Mizi'}</div>
                <div className="text-[11px] text-slate-500 truncate">{member?.email || user?.email || 'admin@example.com'}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Shield className="w-3 h-3 text-emerald-700" />
                  Role: {effectiveRole}
                </div>
              </div>

              {/* Multi-role simulator (Section 13 & Gate 7 verification) */}
              <div className="py-2 border-b border-slate-100">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Test Role Permission View
                </label>
                <div className="space-y-1">
                  {(['Owner/Admin', 'Manager', 'Sales Rep'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      id={`switch-role-${r.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => {
                        setEffectiveRole(r);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                        effectiveRole === r
                          ? 'bg-slate-900 text-white font-medium'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{r}</span>
                      {effectiveRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {onNavigateView && (
                <div className="py-1 border-b border-slate-100">
                  <button
                    id="header-user-menu-settings"
                    onClick={() => {
                      onNavigateView('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-medium"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Workspace Settings</span>
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  id="sign-out-btn"
                  onClick={() => {
                    logOut();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
