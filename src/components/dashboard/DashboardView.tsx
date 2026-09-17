import React from 'react';
import {
  AlertTriangle,
  Clock,
  Briefcase,
  Users2,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Flame,
  ShieldAlert,
  ChevronRight,
  Activity as ActivityIcon,
  HelpCircle,
} from 'lucide-react';
import { Deal, Lead, Task, Activity, Company, Contact } from '../../types/crm';
import {
  calculateKPIs,
  getActionCenterItems,
  formatCurrency,
  formatDate,
  DEFAULT_PIPELINE_STAGES,
  getDaysSinceLastActivity,
} from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface DashboardViewProps {
  deals: Deal[];
  leads: Lead[];
  tasks: Task[];
  activities: Activity[];
  companies: Company[];
  contacts: Contact[];
  onSelectDeal: (deal: Deal) => void;
  onSelectLead: (lead: Lead) => void;
  onNavigateView: (view: any) => void;
  onQuickAddDeal: () => void;
  onQuickAddLead: () => void;
  onQuickAddTask: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  deals,
  leads,
  tasks,
  activities,
  companies,
  contacts,
  onSelectDeal,
  onSelectLead,
  onNavigateView,
  onQuickAddDeal,
  onQuickAddLead,
  onQuickAddTask,
}) => {
  const { organization } = useAuth();
  const currency = organization?.currency || 'USD';
  const staleThreshold = organization?.staleDealDays || 7;

  const kpis = calculateKPIs(deals, tasks, leads);
  const actionCenter = getActionCenterItems(deals, leads, tasks, contacts, staleThreshold);

  // Pipeline stage breakdown
  const stageStats = DEFAULT_PIPELINE_STAGES.map((stage) => {
    const stageDeals = deals.filter((d) => d.stageId === stage.id);
    const totalVal = stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    return {
      ...stage,
      count: stageDeals.length,
      value: totalVal,
    };
  });

  return (
    <div id="coredesk-dashboard-view" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full box-border">
      {/* Welcome & Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Operational Command Center
            </span>
            <span className="text-xs text-slate-500">Live Workspace Status</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">Daily Sales Action Dashboard</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Identify priority bottlenecks, execute scheduled follow-ups, and move pipeline deals toward closing.
          </p>
        </div>

        {/* Quick actions for daily workflow */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            id="dash-add-lead-btn"
            type="button"
            onClick={onQuickAddLead}
            className="flex-1 sm:flex-none px-3.5 py-2.5 sm:py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-h-[44px] flex items-center justify-center text-center touch-manipulation"
          >
            + New Lead
          </button>
          <button
            id="dash-add-task-btn"
            type="button"
            onClick={onQuickAddTask}
            className="flex-1 sm:flex-none px-3.5 py-2.5 sm:py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-h-[44px] flex items-center justify-center text-center touch-manipulation"
          >
            + New Task
          </button>
          <button
            id="dash-add-deal-btn"
            type="button"
            onClick={onQuickAddDeal}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs min-h-[44px] flex items-center justify-center text-center touch-manipulation"
          >
            + New Deal
          </button>
        </div>
      </div>

      {/* 1. Required KPI Metrics - 1 col on mobile, 2 cols on tablet, multi-col on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 w-full max-w-full box-border">
        {/* Total Pipeline Value */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs w-full max-w-full box-border">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Open Pipeline</div>
          <div className="text-xl font-bold text-slate-900 mt-1.5 truncate">
            {formatCurrency(kpis.totalPipelineValue, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            Weighted: <span className="font-semibold text-slate-700">{formatCurrency(kpis.weightedPipelineValue, currency)}</span>
          </div>
        </div>

        {/* Open Deals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs w-full max-w-full box-border">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Open Deals</div>
          <div className="text-xl font-bold text-slate-900 mt-1.5">{kpis.openDealsCount}</div>
          <button
            type="button"
            onClick={() => onNavigateView('pipeline')}
            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium mt-1 flex items-center gap-1 min-h-[28px]"
          >
            View Pipeline <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Won Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs w-full max-w-full box-border">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Won Revenue</div>
          <div className="text-xl font-bold text-emerald-800 mt-1.5 truncate">
            {formatCurrency(kpis.wonRevenue, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Closed won total</div>
        </div>

        {/* Win Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs w-full max-w-full box-border">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Win Rate</div>
          <div className="text-xl font-bold text-slate-900 mt-1.5">
            {kpis.winRate >= 0 ? `${kpis.winRate}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {kpis.winRate >= 0 ? 'Won / (Won + Lost)' : 'No closed deals yet'}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors w-full max-w-full box-border ${
            kpis.overdueTasksCount > 0 ? 'bg-rose-50/60 border-rose-200' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Overdue Tasks</span>
            {kpis.overdueTasksCount > 0 && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
          </div>
          <div className={`text-xl font-bold mt-1.5 ${kpis.overdueTasksCount > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
            {kpis.overdueTasksCount}
          </div>
          <button
            type="button"
            onClick={() => onNavigateView('tasks')}
            className="text-[11px] text-slate-600 hover:text-slate-900 font-medium mt-1 flex items-center gap-1 min-h-[28px]"
          >
            Review Tasks <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Follow-ups Due Today */}
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors w-full max-w-full box-border ${
            kpis.followUpsDueTodayCount > 0 ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Due Today</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className={`text-xl font-bold mt-1.5 ${kpis.followUpsDueTodayCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
            {kpis.followUpsDueTodayCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Scheduled actions</div>
        </div>
      </div>

      {/* 2. OPERATIONAL ACTION CENTER (Section 6 & 10) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full max-w-full box-border">
        <div className="px-4 sm:px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full max-w-full box-border">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <h2 className="text-base font-bold text-slate-900">Priority Attention & Action Center</h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              The CRM answers: <em>What needs attention right now to prevent revenue leakage?</em>
            </p>
          </div>
          <span className="text-xs text-slate-600 shrink-0">
            {actionCenter.overdueFollowUps.length +
              actionCenter.dealsWithoutNextStep.length +
              actionCenter.staleDeals.length +
              actionCenter.newLeadsAwaitingAction.length}{' '}
            pending items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 w-full max-w-full box-border">
          {/* Column A: Overdue Follow-ups */}
          <div className="p-4 sm:p-5 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-700 shrink-0" />
                Overdue Follow-ups ({actionCenter.overdueFollowUps.length})
              </span>
            </div>
            {actionCenter.overdueFollowUps.length === 0 ? (
              <div className="p-4 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                No overdue follow-ups! Great work.
              </div>
            ) : (
              <div className="space-y-2">
                {actionCenter.overdueFollowUps.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 hover:border-rose-300 transition-colors cursor-pointer min-h-[44px]"
                    onClick={() => {
                      if (item.type === 'deal') {
                        const d = deals.find((x) => x.id === item.id);
                        if (d) onSelectDeal(d);
                      } else {
                        const l = leads.find((x) => x.id === item.id);
                        if (l) onSelectLead(l);
                      }
                    }}
                  >
                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-rose-700 flex items-center justify-between mt-1">
                      <span>Due: {formatDate(item.dueAt)}</span>
                      {item.ownerName && <span className="text-slate-500">{item.ownerName}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column B: Deals Without Next Step */}
          <div className="p-4 sm:p-5 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                Deals Without Next Step ({actionCenter.dealsWithoutNextStep.length})
              </span>
            </div>
            {actionCenter.dealsWithoutNextStep.length === 0 ? (
              <div className="p-4 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                Every active deal has a clear next step.
              </div>
            ) : (
              <div className="space-y-2">
                {actionCenter.dealsWithoutNextStep.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => onSelectDeal(deal)}
                    className="p-3 rounded-lg bg-amber-50/40 border border-amber-100 hover:border-amber-300 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <div className="text-xs font-semibold text-slate-900 flex items-center justify-between gap-2">
                      <span className="truncate">{deal.title}</span>
                      <span className="text-xs font-mono font-bold text-slate-700 shrink-0">
                        {formatCurrency(deal.value, currency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-800 mt-1 flex items-center justify-between">
                      <span>No next action scheduled</span>
                      <span className="text-emerald-800 font-medium hover:underline">Set Action →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column C: Stale Deals (>= 7 Days Inactive) */}
          <div className="p-4 sm:p-5 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-700 shrink-0" />
                Stale Deals ({actionCenter.staleDeals.length})
              </span>
              <span className="text-[10px] text-slate-600 font-mono">≥ {staleThreshold}d inactive</span>
            </div>
            {actionCenter.staleDeals.length === 0 ? (
              <div className="p-4 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                No stalled opportunities in pipeline.
              </div>
            ) : (
              <div className="space-y-2">
                {actionCenter.staleDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => onSelectDeal(deal)}
                    className="p-3 rounded-lg bg-orange-50/40 border border-orange-100 hover:border-orange-300 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <div className="text-xs font-semibold text-slate-900 flex items-center justify-between gap-2">
                      <span className="truncate">{deal.title}</span>
                      <span className="text-xs font-mono font-bold text-slate-700 shrink-0">
                        {formatCurrency(deal.value, currency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-orange-800 mt-1 flex items-center justify-between">
                      <span>{getDaysSinceLastActivity(deal)} days without activity</span>
                      <span className="text-slate-600 font-medium">{deal.ownerName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Center Sub-tray: New Leads Awaiting Action & Data Quality */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs w-full max-w-full box-border">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-800">New Leads Requiring First Contact:</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              {actionCenter.newLeadsAwaitingAction.length}
            </span>
          </div>
          {actionCenter.newLeadsAwaitingAction.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateView('leads')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 min-h-[36px]"
            >
              Review New Leads <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {actionCenter.dataQualityIssues.length > 0 && (
            <div className="flex items-center gap-2 text-slate-600 w-full sm:w-auto">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{actionCenter.dataQualityIssues.length} records have incomplete contact or owner data</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Pipeline Funnel Summary (Section 10 & 20) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 w-full max-w-full box-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pipeline Funnel Summary</h2>
            <p className="text-xs text-slate-500">Distribution of active and closed deals across pipeline stages</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateView('pipeline')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto min-h-[36px]"
          >
            Open Interactive Board <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-full box-border">
          {stageStats.map((st) => (
            <div
              key={st.id}
              onClick={() => onNavigateView('pipeline')}
              className={`p-3 rounded-lg border cursor-pointer hover:shadow-xs transition-shadow ${st.color}`}
            >
              <div className="text-xs font-bold truncate">{st.name}</div>
              <div className="text-base font-bold mt-1 truncate">{formatCurrency(st.value, currency)}</div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {st.count} {st.count === 1 ? 'deal' : 'deals'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Grid: Recent Sales Activity Feed & High-Value Deals at Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full box-border">
        {/* Recent Activity Log */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 w-full max-w-full box-border overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">Recent Sales Touchpoints & Activities</span>
              </h2>
              <p className="text-[11px] text-slate-500">Chronological history of calls, meetings, notes, and emails</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateView('activities')}
              className="text-xs font-medium text-emerald-700 hover:underline shrink-0 ml-2 min-h-[36px] flex items-center"
            >
              View All
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No sales activities recorded yet. Click &quot;+ Quick Action&quot; to log a call or meeting.
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="w-6 h-6 rounded bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {act.type.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 flex items-center justify-between gap-2">
                      <span className="truncate">{act.subject}</span>
                      <span className="text-[10px] text-slate-600 font-normal shrink-0">{formatDate(act.occurredAt)}</span>
                    </div>
                    {act.description && <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{act.description}</p>}
                    <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Logged by {act.actorName || 'Team Member'}</span>
                      {act.relatedEntityName && <span className="text-slate-600 font-medium truncate">• {act.relatedEntityName}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High-Value Deals Requiring Attention */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 w-full max-w-full box-border overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="truncate">High-Value Deals at Risk</span>
              </h2>
              <p className="text-[11px] text-slate-500">Major revenue opportunities that are stale or have overdue actions</p>
            </div>
            <span className="text-xs text-slate-600 font-semibold shrink-0 ml-2">{actionCenter.highValueDealsAtRisk.length} flagged</span>
          </div>

          {actionCenter.highValueDealsAtRisk.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              All high-value opportunities are moving forward on schedule.
            </div>
          ) : (
            <div className="space-y-3">
              {actionCenter.highValueDealsAtRisk.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => onSelectDeal(deal)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">{deal.title}</span>
                    <span className="text-xs font-mono font-bold text-emerald-800 shrink-0">
                      {formatCurrency(deal.value, currency)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
                    <span>Account: {deal.companyName || '—'}</span>
                    <span className="text-rose-600 font-medium">Attention Required</span>
                  </div>
                  {deal.nextAction && (
                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      Next: {deal.nextAction} ({formatDate(deal.nextActionAt)})
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
