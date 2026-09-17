import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Users,
} from 'lucide-react';
import { Deal, Lead, Task, Activity, Member } from '../../types/crm';
import {
  calculateKPIs,
  formatCurrency,
  DEFAULT_PIPELINE_STAGES,
  isDealStale,
  getDaysSinceLastActivity,
} from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface ReportsViewProps {
  deals: Deal[];
  leads: Lead[];
  tasks: Task[];
  activities: Activity[];
  members: Member[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  deals,
  leads,
  tasks,
  activities,
  members,
}) => {
  const { organization } = useAuth();
  const currency = organization?.currency || 'USD';
  const staleThreshold = organization?.staleDealDays || 7;

  const kpis = calculateKPIs(deals, tasks, leads);

  // 1. Pipeline by Stage
  const stageBreakdown = DEFAULT_PIPELINE_STAGES.map((s) => {
    const sDeals = deals.filter((d) => d.stageId === s.id);
    const sVal = sDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    return {
      name: s.name,
      count: sDeals.length,
      value: sVal,
      probability: s.probabilityDefault,
    };
  });

  // 2. Win / Loss Analysis
  const wonDeals = deals.filter((d) => d.status === 'Won' || d.stageId === 'closed-won');
  const lostDeals = deals.filter((d) => d.status === 'Lost' || d.stageId === 'closed-lost');
  const wonRevenue = wonDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const lostRevenue = lostDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  // 3. Lead Source Breakdown
  const leadSourceMap: Record<string, number> = {};
  leads.forEach((l) => {
    const src = l.source || 'Website';
    leadSourceMap[src] = (leadSourceMap[src] || 0) + 1;
  });

  // 4. Stale Deals Breakdown
  const staleDeals = deals.filter((d) => isDealStale(d, staleThreshold));

  // CSV Export Utility (Section 25)
  const exportToCSV = (type: 'leads' | 'deals' | 'tasks') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `coredesk-${type}-${new Date().toISOString().substring(0, 10)}.csv`;

    if (type === 'deals') {
      headers = ['Title', 'Value', 'Stage', 'Status', 'Company', 'Contact', 'Owner', 'ExpectedClose', 'NextAction'];
      rows = deals.map((d) => [
        `"${d.title.replace(/"/g, '""')}"`,
        `${d.value}`,
        `"${d.stageName}"`,
        `"${d.status}"`,
        `"${(d.companyName || '').replace(/"/g, '""')}"`,
        `"${(d.contactName || '').replace(/"/g, '""')}"`,
        `"${(d.ownerName || '').replace(/"/g, '""')}"`,
        `"${d.expectedCloseDate}"`,
        `"${(d.nextAction || '').replace(/"/g, '""')}"`,
      ]);
    } else if (type === 'leads') {
      headers = ['Name', 'Company', 'Email', 'Phone', 'Status', 'Priority', 'EstimatedValue', 'Source', 'Owner'];
      rows = leads.map((l) => [
        `"${l.name.replace(/"/g, '""')}"`,
        `"${(l.companyName || '').replace(/"/g, '""')}"`,
        `"${l.email || ''}"`,
        `"${l.phone || ''}"`,
        `"${l.status}"`,
        `"${l.priority}"`,
        `${l.estimatedValue || 0}`,
        `"${l.source || ''}"`,
        `"${(l.ownerName || '').replace(/"/g, '""')}"`,
      ]);
    } else {
      headers = ['Title', 'Type', 'Priority', 'Status', 'DueAt', 'Owner', 'LinkedEntity'];
      rows = tasks.map((t) => [
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.type}"`,
        `"${t.priority}"`,
        `"${t.status}"`,
        `"${t.dueAt}"`,
        `"${(t.ownerName || '').replace(/"/g, '""')}"`,
        `"${(t.relatedEntityName || '').replace(/"/g, '""')}"`,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="coredesk-reports-view" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full box-border">
      {/* Header with CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">CRM Analytics & Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conversion metrics, stage velocity, rep activity tracking, and compliance data exports.
          </p>
        </div>

        {/* CSV Exporters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="export-deals-csv-btn"
            onClick={() => exportToCSV('deals')}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-colors border border-slate-200 min-h-[40px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Deals CSV</span>
          </button>
          <button
            type="button"
            id="export-leads-csv-btn"
            onClick={() => exportToCSV('leads')}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-colors border border-slate-200 min-h-[40px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Leads CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-full box-border">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Won Revenue</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{formatCurrency(wonRevenue, currency)}</div>
          <div className="text-[11px] text-slate-500 mt-1">{wonDeals.length} closed won deals</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Win Rate</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {kpis.winRate >= 0 ? `${kpis.winRate}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {kpis.winRate >= 0 ? `${wonDeals.length} Won / ${wonDeals.length + lostDeals.length} Closed` : 'No closed deals yet'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Pipeline</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(kpis.totalPipelineValue, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{kpis.openDealsCount} open opportunities</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Weighted Forecast</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(kpis.weightedPipelineValue, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Probability-adjusted</div>
        </div>
      </div>

      {/* Grid: Pipeline by Stage & Win/Loss Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Pipeline Volume by Stage</h2>
          <p className="text-xs text-slate-500 mb-4">Deal value and count progression through sales funnel</p>

          <div className="space-y-3">
            {stageBreakdown.map((stage) => {
              const maxVal = Math.max(...stageBreakdown.map((s) => s.value), 1);
              const pct = Math.round((stage.value / maxVal) * 100);

              return (
                <div key={stage.name} className="text-xs">
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-slate-800">{stage.name}</span>
                    <span className="font-mono text-slate-900">{formatCurrency(stage.value, currency)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-emerald-700 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>{stage.count} deals</span>
                    <span>Probability default: {stage.probability}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Win / Loss Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Win / Loss Velocity Analysis</h2>
          <p className="text-xs text-slate-500 mb-4">Closed outcomes and lost revenue tracking</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Closed Won</span>
              </div>
              <div className="text-xl font-bold text-emerald-900 mt-2 font-mono">
                {formatCurrency(wonRevenue, currency)}
              </div>
              <div className="text-xs text-emerald-700 mt-1">{wonDeals.length} won contracts</div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                <XCircle className="w-4 h-4 text-rose-700" />
                <span>Closed Lost</span>
              </div>
              <div className="text-xl font-bold text-rose-900 mt-2 font-mono">
                {formatCurrency(lostRevenue, currency)}
              </div>
              <div className="text-xs text-rose-700 mt-1">{lostDeals.length} lost opportunities</div>
            </div>
          </div>

          {/* Stale Deals Warning */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-600" />
                Stale Deal Leakage Risk ({staleDeals.length})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Threshold: ≥ {staleThreshold} days</span>
            </div>
            <p className="text-xs text-slate-600">
              {staleDeals.length > 0
                ? `${staleDeals.length} open opportunities have had no recorded sales activity for more than ${staleThreshold} days. These should be re-engaged or qualified out.`
                : 'No stale deals currently detected. Pipeline health is excellent.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Lead Source Breakdown & Rep Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Inbound Lead Sources</h2>
          <p className="text-xs text-slate-500 mb-4">Origin of prospect inquiries</p>

          <div className="space-y-3">
            {Object.entries(leadSourceMap).map(([src, count]) => {
              const pct = Math.round((count / Math.max(leads.length, 1)) * 100);
              return (
                <div key={src} className="text-xs">
                  <div className="flex items-center justify-between font-medium mb-1 text-slate-800">
                    <span>{src}</span>
                    <span className="font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity & Team Volume */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Sales Touchpoint Activity Volume</h2>
          <p className="text-xs text-slate-500 mb-4">Total interactions logged across the team</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Calls</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {activities.filter((a) => a.type === 'Call').length}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Emails</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {activities.filter((a) => a.type === 'Email').length}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Meetings</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {activities.filter((a) => a.type === 'Meeting').length}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Notes</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {activities.filter((a) => a.type === 'Note').length}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Total Sales Touchpoints: <strong>{activities.length}</strong></span>
            <span>Completed Tasks: <strong>{tasks.filter((t) => t.status === 'Completed').length}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
