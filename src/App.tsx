import React, { useState, useEffect, useCallback } from 'react';
import { RouterProvider, useRouter } from './router/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SEOHead } from './components/seo/SEOHead';
import { AuthScreen } from './components/auth/AuthScreen';
import { AdminSetupModal } from './components/setup/AdminSetupModal';
import { Header } from './components/layout/Header';
import { Sidebar, NavView } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadsView } from './components/leads/LeadsView';
import { PipelineBoardView } from './components/deals/PipelineBoardView';
import { DealsListView } from './components/deals/DealsListView';
import { DealDetailModal } from './components/deals/DealDetailModal';
import { CreateDealModal } from './components/deals/CreateDealModal';
import { ContactsView } from './components/contacts/ContactsView';
import { CompaniesView } from './components/companies/CompaniesView';
import { TasksView } from './components/tasks/TasksView';
import { ActivitiesView } from './components/activities/ActivitiesView';
import { ReportsView } from './components/reports/ReportsView';
import { AdminView } from './components/admin/AdminView';
import { WorkspaceSettingsView } from './components/settings/WorkspaceSettingsView';

// Public Marketing Pages
import { HomePage } from './pages/marketing/HomePage';
import { FeaturesPage } from './pages/marketing/FeaturesPage';
import { SolutionsPage } from './pages/marketing/SolutionsPage';
import { PricingPage } from './pages/marketing/PricingPage';
import { UseCasesPage } from './pages/marketing/UseCasesPage';
import { BlogPage } from './pages/marketing/BlogPage';
import { ComparisonsPage } from './pages/marketing/ComparisonsPage';

import {
  Deal,
  Lead,
  Contact,
  Company,
  Task,
  Activity,
  Member,
  Notification,
} from './types/crm';
import {
  getDeals,
  getLeads,
  getContacts,
  getCompanies,
  getTasks,
  getActivities,
  getMembers,
} from './services/crmService';

const VALID_NAV_VIEWS: NavView[] = [
  'dashboard',
  'leads',
  'contacts',
  'companies',
  'deals',
  'pipeline',
  'tasks',
  'activities',
  'reports',
  'admin',
  'settings',
];

function getInitialNavView(): NavView {
  if (typeof window !== 'undefined') {
    const rawHash = window.location.hash.replace(/^#\/?/, '') as NavView;
    if (VALID_NAV_VIEWS.includes(rawHash)) {
      return rawHash;
    }
    const pathSegment = window.location.pathname.replace(/^\/(app\/)?/, '') as NavView;
    if (VALID_NAV_VIEWS.includes(pathSegment)) {
      return pathSegment;
    }
  }
  return 'dashboard';
}

function CoreDeskWorkspace() {
  const { user, loading: authLoading, organization, needsSetupGate, effectiveRole } = useAuth();
  const { navigate } = useRouter();

  const [activeView, setActiveView] = useState<NavView>(getInitialNavView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Synchronize browser history and support browser back/forward navigation
  const navigateToView = useCallback((nextView: NavView) => {
    setActiveView((current) => {
      if (current !== nextView) {
        window.history.pushState({ view: nextView }, '', `/app#${nextView}`);
      }
      return nextView;
    });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '') as NavView;
      const targetView = VALID_NAV_VIEWS.includes(rawHash) ? rawHash : 'dashboard';
      setActiveView(targetView);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    if (!window.location.hash && window.location.pathname.startsWith('/app')) {
      window.history.replaceState({ view: activeView }, '', `/app#${activeView}`);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [activeView]);

  // Entities State
  const [deals, setDeals] = useState<Deal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      organizationId: organization?.id || '',
      userId: user?.uid || '',
      title: 'Action Center Ready',
      message: 'CoreDesk is monitoring overdue follow-ups and stale pipeline deals.',
      type: 'action_required',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  // Modals & Selected Records
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCreateDealModal, setShowCreateDealModal] = useState(false);

  // Data loader
  const loadWorkspaceData = useCallback(async () => {
    if (!organization) return;
    try {
      setDataLoading(true);
      const [d, l, c, co, t, a, m] = await Promise.all([
        getDeals(organization.id),
        getLeads(organization.id),
        getContacts(organization.id),
        getCompanies(organization.id),
        getTasks(organization.id),
        getActivities(organization.id),
        getMembers(organization.id),
      ]);
      setDeals(d);
      setLeads(l);
      setContacts(c);
      setCompanies(co);
      setTasks(t);
      setActivities(a);
      setMembers(m);
    } catch (err) {
      console.error('Failed to load CRM workspace data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [organization]);

  useEffect(() => {
    if (organization) {
      loadWorkspaceData();
    }
  }, [organization, loadWorkspaceData]);

  // Global keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickAction = (actionType: 'lead' | 'deal' | 'task' | 'activity') => {
    if (actionType === 'deal') setShowCreateDealModal(true);
    else if (actionType === 'lead') navigateToView('leads');
    else if (actionType === 'task') navigateToView('tasks');
    else if (actionType === 'activity') navigateToView('activities');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-3">
        <SEOHead
          title="Loading Workspace | CoreDesk CRM"
          description="Initializing workspace..."
          noIndex={true}
        />
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg shadow-sm animate-pulse">
          CD
        </div>
        <div className="text-sm font-semibold tracking-wide text-slate-300">
          Initializing CoreDesk CRM Engine...
        </div>
      </div>
    );
  }

  // Not signed in: redirect to login
  if (!user) {
    return <AuthScreen isSignup={false} />;
  }

  // Authenticated, but needs Setup Gate
  if (needsSetupGate || !organization) {
    return (
      <>
        <SEOHead
          title="Organization Setup | CoreDesk CRM"
          description="Admin Setup Gate"
          noIndex={true}
        />
        <AdminSetupModal
          initialEmail={user.email || 'admin@example.com'}
          initialName={user.displayName || 'Workspace Admin'}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Protected, non-indexable SEO meta */}
      <SEOHead
        title={`CoreDesk CRM | ${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`}
        description="CoreDesk CRM Operations Workspace"
        canonicalPath={`/app#${activeView}`}
        noIndex={true}
      />

      {/* Global Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onQuickAction={handleQuickAction}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        activeView={activeView}
        onNavigateView={navigateToView}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex overflow-hidden w-full max-w-full box-border">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={navigateToView}
          isOpenMobile={mobileMenuOpen}
          setIsOpenMobile={setMobileMenuOpen}
          counts={{
            leads: leads.filter((l) => l.status !== 'Converted').length,
            deals: deals.filter((d) => d.status === 'Open').length,
            tasks: tasks.filter((t) => t.status === 'Pending').length,
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pb-16 box-border">
          {activeView === 'dashboard' && (
            <DashboardView
              deals={deals}
              leads={leads}
              tasks={tasks}
              activities={activities}
              companies={companies}
              contacts={contacts}
              onSelectDeal={(deal) => setSelectedDeal(deal)}
              onSelectLead={(lead) => {
                setSelectedLead(lead);
                navigateToView('leads');
              }}
              onNavigateView={(view) => navigateToView(view)}
              onQuickAddDeal={() => setShowCreateDealModal(true)}
              onQuickAddLead={() => navigateToView('leads')}
              onQuickAddTask={() => navigateToView('tasks')}
            />
          )}

          {activeView === 'leads' && (
            <LeadsView
              leads={leads}
              companies={companies}
              contacts={contacts}
              onRefresh={loadWorkspaceData}
            />
          )}

          {activeView === 'pipeline' && (
            <PipelineBoardView
              deals={deals}
              companies={companies}
              contacts={contacts}
              onSelectDeal={(deal) => setSelectedDeal(deal)}
              onQuickAddDeal={() => setShowCreateDealModal(true)}
              onRefresh={loadWorkspaceData}
            />
          )}

          {activeView === 'deals' && (
            <DealsListView
              deals={deals}
              companies={companies}
              contacts={contacts}
              onSelectDeal={(deal) => setSelectedDeal(deal)}
              onQuickAddDeal={() => setShowCreateDealModal(true)}
              onRefresh={loadWorkspaceData}
            />
          )}

          {activeView === 'contacts' && (
            <ContactsView
              contacts={contacts}
              companies={companies}
              onRefresh={loadWorkspaceData}
            />
          )}

          {activeView === 'companies' && (
            <CompaniesView
              companies={companies}
              deals={deals}
              onRefresh={loadWorkspaceData}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView
              tasks={tasks}
              onRefresh={loadWorkspaceData}
            />
          )}

          {activeView === 'activities' && (
            <ActivitiesView
              activities={activities}
              deals={deals}
              companies={companies}
              contacts={contacts}
              leads={leads}
              onRefresh={loadWorkspaceData}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              deals={deals}
              leads={leads}
              tasks={tasks}
              activities={activities}
              members={members}
            />
          )}

          {activeView === 'admin' && (
            <AdminView
              members={members}
              onRefresh={loadWorkspaceData}
            />
          )}

          {activeView === 'settings' && (
            <WorkspaceSettingsView
              onRefresh={loadWorkspaceData}
              onNavigateBack={() => navigateToView('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        deals={deals}
        leads={leads}
        contacts={contacts}
        companies={companies}
        tasks={tasks}
        onSelectDeal={(deal) => setSelectedDeal(deal)}
        onSelectLead={(lead) => {
          setSelectedLead(lead);
          navigateToView('leads');
        }}
        onNavigateView={(view) => navigateToView(view)}
      />

      {/* Deal Detail & Progress Modal */}
      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          companies={companies}
          contacts={contacts}
          activities={activities}
          onClose={() => setSelectedDeal(null)}
          onRefresh={loadWorkspaceData}
        />
      )}

      {/* Quick Add Deal Modal */}
      {showCreateDealModal && (
        <CreateDealModal
          companies={companies}
          contacts={contacts}
          onClose={() => setShowCreateDealModal(false)}
          onRefresh={loadWorkspaceData}
        />
      )}
    </div>
  );
}

function MainRouter() {
  const { path, matchRoute } = useRouter();
  const { user } = useAuth();

  // 1. Check for Use Cases routes (/use-cases or /use-cases/:slug)
  const useCaseMatch = matchRoute('/use-cases/:slug');
  if (useCaseMatch) {
    return <UseCasesPage slug={useCaseMatch.params.slug} />;
  }
  if (path === '/use-cases') {
    return <UseCasesPage />;
  }

  // 2. Check for Blog / Guide routes (/blog or /blog/:slug)
  const blogMatch = matchRoute('/blog/:slug');
  if (blogMatch) {
    return <BlogPage slug={blogMatch.params.slug} />;
  }
  if (path === '/blog') {
    return <BlogPage />;
  }

  // 3. Check for Comparisons routes (/compare or /compare/:slug)
  const compareMatch = matchRoute('/compare/:slug');
  if (compareMatch) {
    return <ComparisonsPage slug={compareMatch.params.slug} />;
  }
  if (path === '/compare') {
    return <ComparisonsPage />;
  }

  // 4. Other core public routes
  if (path === '/features') {
    return <FeaturesPage />;
  }
  if (path === '/solutions') {
    return <SolutionsPage />;
  }
  if (path === '/pricing') {
    return <PricingPage />;
  }

  // 5. Auth routes
  if (path === '/login') {
    return <AuthScreen isSignup={false} />;
  }
  if (path === '/signup') {
    return <AuthScreen isSignup={true} />;
  }

  // 6. Private workspace routes (/app or legacy /dashboard, /leads, etc.)
  const isWorkspacePath =
    path === '/app' ||
    path.startsWith('/app/') ||
    VALID_NAV_VIEWS.includes(path.replace(/^\//, '') as NavView);

  // Backwards compatibility check: If visiting root with an existing valid view hash (e.g. /#pipeline),
  // and user is logged in, treat as workspace
  const hasWorkspaceHash =
    typeof window !== 'undefined' &&
    VALID_NAV_VIEWS.includes(window.location.hash.replace(/^#\/?/, '') as NavView);

  if (isWorkspacePath || (hasWorkspaceHash && user)) {
    return <CoreDeskWorkspace />;
  }

  // Default: Public Homepage
  return <HomePage />;
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </RouterProvider>
  );
}
