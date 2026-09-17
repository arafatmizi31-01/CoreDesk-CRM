import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Briefcase,
  Building2,
  Calendar,
  Flame,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { Deal, Company, Contact } from '../../types/crm';
import {
  formatCurrency,
  formatDate,
  DEFAULT_PIPELINE_STAGES,
  isDealStale,
  getFollowUpStatus,
} from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface DealsListViewProps {
  deals: Deal[];
  companies: Company[];
  contacts: Contact[];
  onSelectDeal: (deal: Deal) => void;
  onQuickAddDeal: () => void;
  onRefresh: () => void;
}

export const DealsListView: React.FC<DealsListViewProps> = ({
  deals,
  companies,
  contacts,
  onSelectDeal,
  onQuickAddDeal,
  onRefresh,
}) => {
  const { organization } = useAuth();
  const currency = organization?.currency || 'USD';
  const staleThreshold = organization?.staleDealDays || 7;

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<'value' | 'expectedCloseDate' | 'createdAt' | 'title'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredDeals = useMemo(() => {
    return deals
      .filter((d) => {
        if (stageFilter !== 'All' && d.stageId !== stageFilter) return false;
        if (statusFilter !== 'All' && d.status !== statusFilter) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = d.title.toLowerCase().includes(q);
          const matchCompany = (d.companyName || '').toLowerCase().includes(q);
          const matchContact = (d.contactName || '').toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchContact) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'value') cmp = (a.value || 0) - (b.value || 0);
        else if (sortField === 'title') cmp = a.title.localeCompare(b.title);
        else if (sortField === 'expectedCloseDate') cmp = new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime();
        else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortAsc ? cmp : -cmp;
      });
  }, [deals, stageFilter, statusFilter, searchTerm, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredDeals.length / pageSize));
  const paginatedDeals = filteredDeals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div id="coredesk-deals-list-view" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full max-w-full box-border">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Deals Register</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tabular register of all current, won, and lost sales opportunities with stage probabilities and scheduling.
          </p>
        </div>
        <button
          id="deals-list-add-btn"
          type="button"
          onClick={onQuickAddDeal}
          className="px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Opportunity Deal</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs w-full max-w-full box-border">
        <div className="relative flex-1 min-w-[200px] max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            id="deals-search-input"
            type="text"
            placeholder="Search deals, companies, contacts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Stage:</span>
          <select
            id="deals-stage-filter"
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none min-h-[40px]"
          >
            <option value="All">All Stages</option>
            {DEFAULT_PIPELINE_STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            id="deals-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none min-h-[40px]"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortAsc(!sortAsc)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1 font-medium min-h-[40px]"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? 'Asc' : 'Desc'}</span>
          </button>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full max-w-full box-border">
        {paginatedDeals.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No deals found</div>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or create a new deal.</p>
          </div>
        ) : (
          <div className="table-responsive-container w-full max-w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[720px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Account / Contact</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Next Action</th>
                  <th className="py-3 px-4">Expected Close</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedDeals.map((deal) => {
                  const isStale = isDealStale(deal, staleThreshold);
                  const followUp = getFollowUpStatus(deal.nextActionAt, deal.nextAction);

                  return (
                    <tr
                      key={deal.id}
                      onClick={() => onSelectDeal(deal)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex flex-col">
                          <span className="line-clamp-1">{deal.title}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            {isStale && (
                              <span className="text-[10px] font-bold text-orange-600 flex items-center gap-0.5">
                                <Flame className="w-3 h-3" /> Stale
                              </span>
                            )}
                            {followUp === 'Overdue' && (
                              <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" /> Overdue
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-medium">{deal.companyName || '—'}</span>
                          <span className="text-[11px] text-slate-500">{deal.contactName || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {deal.stageName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                        {formatCurrency(deal.value, currency)}
                      </td>
                      <td className="py-3 px-4">
                        {deal.nextAction ? (
                          <div className="flex flex-col">
                            <span className="text-slate-800 line-clamp-1">{deal.nextAction}</span>
                            {deal.nextActionAt && (
                              <span className="text-[10px] text-slate-500">{formatDate(deal.nextActionAt)}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-medium">None scheduled</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(deal.expectedCloseDate)}</td>
                      <td className="py-3 px-4 text-slate-500">{deal.ownerName || 'Unassigned'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDeal(deal);
                          }}
                          className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] min-h-[32px]"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredDeals.length > pageSize && (
          <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 w-full max-w-full box-border">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredDeals.length)} of{' '}
              {filteredDeals.length} deals
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-white min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-white min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
