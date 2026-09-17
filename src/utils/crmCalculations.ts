import { Deal, Task, Lead, Contact, DashboardKPIs, ActionCenterItems } from '../types/crm';

export const DEFAULT_PIPELINE_STAGES = [
  { id: 'new', name: 'New', order: 1, probabilityDefault: 10, color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: 'qualified', name: 'Qualified', order: 2, probabilityDefault: 30, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'proposal', name: 'Proposal', order: 3, probabilityDefault: 60, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'negotiation', name: 'Negotiation', order: 4, probabilityDefault: 80, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'closed-won', name: 'Closed Won', order: 5, probabilityDefault: 100, isWon: true, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'closed-lost', name: 'Closed Lost', order: 6, probabilityDefault: 0, isLost: true, color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export function formatCurrency(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `$${(amount || 0).toLocaleString()}`;
  }
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Section 21: A deal is considered stale when it has no recorded activity
 * for 7 consecutive calendar days AND its status is Open.
 */
export function isDealStale(deal: Deal, staleDays = 7): boolean {
  if (deal.status !== 'Open') return false;
  const compareDateStr = deal.lastActivityAt || deal.createdAt;
  if (!compareDateStr) return true;
  const compareDate = new Date(compareDateStr);
  if (isNaN(compareDate.getTime())) return true;
  const diffDays = (Date.now() - compareDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= staleDays;
}

export function getDaysSinceLastActivity(deal: Deal): number {
  const compareDateStr = deal.lastActivityAt || deal.createdAt;
  if (!compareDateStr) return 0;
  const compareDate = new Date(compareDateStr);
  if (isNaN(compareDate.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - compareDate.getTime()) / (1000 * 60 * 60 * 24)));
}

/**
 * Section 22: Follow-up classification:
 * Overdue, Due Today, Upcoming, No Next Step
 */
export type FollowUpStatus = 'Overdue' | 'Due Today' | 'Upcoming' | 'No Next Step';

export function getFollowUpStatus(nextActionAt?: string, nextAction?: string): FollowUpStatus {
  if (!nextActionAt && !nextAction) return 'No Next Step';
  if (!nextActionAt) return 'No Next Step';

  const actionDate = new Date(nextActionAt);
  if (isNaN(actionDate.getTime())) return 'No Next Step';

  const today = new Date();
  const isToday =
    actionDate.getDate() === today.getDate() &&
    actionDate.getMonth() === today.getMonth() &&
    actionDate.getFullYear() === today.getFullYear();

  if (isToday) return 'Due Today';
  if (actionDate.getTime() < today.getTime()) return 'Overdue';
  return 'Upcoming';
}

export function isTaskOverdue(task: Task): boolean {
  if (task.status === 'Completed' || task.status === 'Cancelled') return false;
  if (!task.dueAt) return false;
  const dueTime = new Date(task.dueAt).getTime();
  return !isNaN(dueTime) && dueTime < Date.now();
}

/**
 * Section 28: KPI Definitions
 */
export function calculateKPIs(deals: Deal[], tasks: Task[], leads: Lead[]): DashboardKPIs {
  let totalPipelineValue = 0;
  let weightedPipelineValue = 0;
  let openDealsCount = 0;
  let wonRevenue = 0;
  let wonCount = 0;
  let lostCount = 0;

  for (const deal of deals) {
    if (deal.status === 'Open') {
      const val = Number(deal.value) || 0;
      totalPipelineValue += val;
      const prob = (Number(deal.probability) || 0) / 100;
      weightedPipelineValue += val * prob;
      openDealsCount++;
    } else if (deal.status === 'Won') {
      wonRevenue += Number(deal.value) || 0;
      wonCount++;
    } else if (deal.status === 'Lost') {
      lostCount++;
    }
  }

  // Win Rate = Won / (Won + Lost)
  const totalDecided = wonCount + lostCount;
  const winRate = totalDecided > 0 ? Math.round((wonCount / totalDecided) * 100) : -1;

  // Overdue tasks
  const now = Date.now();
  const overdueTasksCount = tasks.filter((t) => {
    if (t.status === 'Completed' || t.status === 'Cancelled') return false;
    if (!t.dueAt) return false;
    const dueTime = new Date(t.dueAt).getTime();
    return !isNaN(dueTime) && dueTime < now;
  }).length;

  // Follow-ups due today from deals and leads
  const todayDate = new Date();
  const isDueToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return (
      d.getDate() === todayDate.getDate() &&
      d.getMonth() === todayDate.getMonth() &&
      d.getFullYear() === todayDate.getFullYear()
    );
  };

  const dealFollowUpsToday = deals.filter((d) => d.status === 'Open' && isDueToday(d.nextActionAt)).length;
  const leadFollowUpsToday = leads.filter((l) => l.status !== 'Converted' && isDueToday(l.nextFollowUpAt)).length;

  return {
    totalPipelineValue,
    openDealsCount,
    wonRevenue,
    winRate,
    overdueTasksCount,
    followUpsDueTodayCount: dealFollowUpsToday + leadFollowUpsToday,
    weightedPipelineValue,
  };
}

/**
 * Section 10: Action Center Generation
 */
export function getActionCenterItems(
  deals: Deal[],
  leads: Lead[],
  tasks: Task[],
  contacts: Contact[],
  staleThreshold = 7
): ActionCenterItems {
  const now = Date.now();
  const overdueFollowUps: ActionCenterItems['overdueFollowUps'] = [];

  // Overdue lead follow-ups
  leads.forEach((l) => {
    if (l.status !== 'Converted' && l.nextFollowUpAt) {
      const d = new Date(l.nextFollowUpAt).getTime();
      if (!isNaN(d) && d < now) {
        overdueFollowUps.push({
          id: l.id,
          type: 'lead',
          title: `Lead: ${l.name}`,
          dueAt: l.nextFollowUpAt,
          ownerName: l.ownerName,
        });
      }
    }
  });

  // Overdue deal follow-ups
  deals.forEach((d) => {
    if (d.status === 'Open' && d.nextActionAt) {
      const due = new Date(d.nextActionAt).getTime();
      if (!isNaN(due) && due < now) {
        overdueFollowUps.push({
          id: d.id,
          type: 'deal',
          title: `Deal: ${d.title} — ${d.nextAction || 'Next action'}`,
          dueAt: d.nextActionAt,
          ownerName: d.ownerName,
        });
      }
    }
  });

  // Deals without next step
  const dealsWithoutNextStep = deals.filter(
    (d) => d.status === 'Open' && (!d.nextAction || !d.nextAction.trim() || !d.nextActionAt)
  );

  // Stale deals (no activity for >= 7 days)
  const staleDeals = deals.filter((d) => isDealStale(d, staleThreshold));

  // High-value deals requiring attention (value > $15k and open and either stale or without next step)
  const avgDealValue = deals.length
    ? deals.reduce((acc, d) => acc + (Number(d.value) || 0), 0) / deals.length
    : 10000;
  const highValueThreshold = Math.max(15000, avgDealValue * 1.5);
  const highValueDealsAtRisk = deals.filter(
    (d) =>
      d.status === 'Open' &&
      Number(d.value) >= highValueThreshold &&
      (isDealStale(d, staleThreshold) || !d.nextAction || getFollowUpStatus(d.nextActionAt, d.nextAction) === 'Overdue')
  );

  // New leads awaiting action
  const newLeadsAwaitingAction = leads.filter((l) => l.status === 'New');

  // Section 32: Data Quality Issues
  const dataQualityIssues: ActionCenterItems['dataQualityIssues'] = [];
  deals.forEach((d) => {
    if (d.status === 'Open' && !d.ownerId) {
      dataQualityIssues.push({ id: d.id, entityType: 'Deal', name: d.title, issue: 'Missing assigned sales owner' });
    }
    if (d.status === 'Open' && !d.contactId && !d.companyId) {
      dataQualityIssues.push({ id: d.id, entityType: 'Deal', name: d.title, issue: 'No linked Contact or Company' });
    }
  });

  leads.forEach((l) => {
    if (l.status !== 'Converted' && !l.email && !l.phone) {
      dataQualityIssues.push({ id: l.id, entityType: 'Lead', name: l.name, issue: 'Missing both email and phone' });
    }
    if (l.status !== 'Converted' && !l.ownerId) {
      dataQualityIssues.push({ id: l.id, entityType: 'Lead', name: l.name, issue: 'Unassigned lead' });
    }
  });

  return {
    overdueFollowUps: overdueFollowUps.slice(0, 8),
    dealsWithoutNextStep: dealsWithoutNextStep.slice(0, 8),
    staleDeals: staleDeals.slice(0, 8),
    highValueDealsAtRisk: highValueDealsAtRisk.slice(0, 5),
    newLeadsAwaitingAction: newLeadsAwaitingAction.slice(0, 8),
    dataQualityIssues: dataQualityIssues.slice(0, 8),
  };
}
