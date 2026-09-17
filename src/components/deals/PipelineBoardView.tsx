import React, { useState } from 'react';
import {
  Plus,
  Flame,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  MoreHorizontal,
  Building2,
  User,
  ArrowRight,
} from 'lucide-react';
import { Deal, Company, Contact } from '../../types/crm';
import {
  DEFAULT_PIPELINE_STAGES,
  formatCurrency,
  formatDate,
  isDealStale,
  getDaysSinceLastActivity,
  getFollowUpStatus,
} from '../../utils/crmCalculations';
import { updateDealStage } from '../../services/crmService';
import { useAuth } from '../../context/AuthContext';

interface PipelineBoardViewProps {
  deals: Deal[];
  companies: Company[];
  contacts: Contact[];
  onSelectDeal: (deal: Deal) => void;
  onQuickAddDeal: () => void;
  onRefresh: () => void;
}

export const PipelineBoardView: React.FC<PipelineBoardViewProps> = ({
  deals,
  companies,
  contacts,
  onSelectDeal,
  onQuickAddDeal,
  onRefresh,
}) => {
  const { organization, member, user } = useAuth();
  const currency = organization?.currency || 'USD';
  const staleThreshold = organization?.staleDealDays || 7;

  // Track dragging or quick-move
  const [movingDealId, setMovingDealId] = useState<string | null>(null);

  const handleMoveStage = async (deal: Deal, targetStageId: string) => {
    if (!organization || deal.stageId === targetStageId) return;
    try {
      setMovingDealId(deal.id);
      await updateDealStage(
        organization.id,
        deal.id,
        targetStageId,
        { id: user?.uid || 'user', name: member?.name || 'User' }
      );
      onRefresh();
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setMovingDealId(null);
    }
  };

  return (
    <div id="coredesk-pipeline-board" className="p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 w-full max-w-full box-border">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              Visual Pipeline Flow
            </span>
            <span className="text-xs text-slate-500 font-medium">Standard 6-Stage B2B Model</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Sales Opportunity Kanban Board</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor deal momentum, inspect stale deals, and transition pipeline stages with audit traceability.
          </p>
        </div>

        <button
          id="pipeline-add-deal-btn"
          type="button"
          onClick={onQuickAddDeal}
          className="px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Opportunity Deal</span>
        </button>
      </div>

      {/* Kanban Stage Columns (Horizontally scrollable on mobile/tablet, 6-col grid on xl) */}
      <div className="w-full max-w-full overflow-x-auto pb-4">
        <div className="flex xl:grid xl:grid-cols-6 gap-4 items-start min-w-max xl:min-w-0">
          {DEFAULT_PIPELINE_STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stageId === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

            return (
              <div
                key={stage.id}
                className="w-[280px] sm:w-[320px] xl:w-auto shrink-0 xl:shrink bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col max-h-[calc(100vh-14rem)] shadow-xs"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-200 bg-white rounded-t-xl sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{stage.name}</span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                        {stageDeals.length}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {stage.probabilityDefault}%
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-1 font-mono">
                    {formatCurrency(stageTotal, currency)}
                  </div>
                </div>

                {/* Column Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto min-h-[160px]">
                  {stageDeals.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                      No deals in {stage.name}
                    </div>
                  ) : (
                    stageDeals.map((deal) => {
                      const isStale = isDealStale(deal, staleThreshold);
                      const daysInactive = getDaysSinceLastActivity(deal);
                      const followUp = getFollowUpStatus(deal.nextActionAt, deal.nextAction);
                      const isHighValue = deal.value >= 25000;

                      return (
                        <div
                          key={deal.id}
                          id={`deal-card-${deal.id}`}
                          onClick={() => onSelectDeal(deal)}
                          className={`p-3 bg-white rounded-lg border shadow-xs transition-all cursor-pointer hover:border-emerald-400 hover:shadow-md ${
                            movingDealId === deal.id ? 'opacity-50 pointer-events-none' : ''
                          } ${
                            isStale
                              ? 'border-orange-200 bg-orange-50/10'
                              : followUp === 'Overdue'
                              ? 'border-rose-200 bg-rose-50/10'
                              : 'border-slate-200'
                          }`}
                        >
                          {/* Status Badges */}
                          <div className="flex flex-wrap items-center gap-1 mb-1.5">
                            {isHighValue && (
                              <span className="text-[9px] px-1 py-0.5 rounded font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                High Value
                              </span>
                            )}
                            {isStale && (
                              <span className="text-[9px] px-1 py-0.5 rounded font-bold bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5 text-orange-600" />
                                {daysInactive}d Stale
                              </span>
                            )}
                            {followUp === 'Overdue' && (
                              <span className="text-[9px] px-1 py-0.5 rounded font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                                Overdue
                              </span>
                            )}
                            {followUp === 'No Next Step' && (
                              <span className="text-[9px] px-1 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                                <HelpCircle className="w-2.5 h-2.5 text-amber-600" />
                                No Next Step
                              </span>
                            )}
                          </div>

                          {/* Title & Value */}
                          <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {deal.title}
                          </div>
                          <div className="text-sm font-bold text-emerald-800 font-mono mt-1">
                            {formatCurrency(deal.value, currency)}
                          </div>

                          {/* Company & Owner */}
                          <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                            {deal.companyName && (
                              <div className="flex items-center gap-1 truncate">
                                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{deal.companyName}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{deal.ownerName || 'Unassigned'}</span>
                            </div>
                          </div>

                          {/* Next Action */}
                          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px]">
                            {deal.nextAction ? (
                              <div className="text-slate-700">
                                <span className="font-semibold text-slate-500">Next: </span>
                                <span className="truncate font-medium">{deal.nextAction}</span>
                                {deal.nextActionAt && (
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    Due {formatDate(deal.nextActionAt)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-amber-700 font-medium">Click to set next action</div>
                            )}
                          </div>

                          {/* Stage Quick Mover (Advance / Regress) */}
                          <div
                            className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              value={deal.stageId}
                              onChange={(e) => handleMoveStage(deal, e.target.value)}
                              className="w-full text-[10px] font-semibold py-1 px-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-700 min-h-[32px]"
                            >
                              {DEFAULT_PIPELINE_STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Move → {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
