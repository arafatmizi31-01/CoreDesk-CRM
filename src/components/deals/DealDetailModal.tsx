import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building2,
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Flame,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Deal, Company, Contact, Activity, Priority } from '../../types/crm';
import { saveDeal, updateDealStage, createActivity } from '../../services/crmService';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  DEFAULT_PIPELINE_STAGES,
  isDealStale,
  getDaysSinceLastActivity,
  getFollowUpStatus,
} from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface DealDetailModalProps {
  deal: Deal;
  companies: Company[];
  contacts: Contact[];
  activities: Activity[];
  onClose: () => void;
  onRefresh: () => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  companies,
  contacts,
  activities,
  onClose,
  onRefresh,
}) => {
  const { organization, member, user } = useAuth();
  const currency = organization?.currency || 'USD';
  const staleThreshold = organization?.staleDealDays || 7;

  // Local state for editing next action
  const [nextAction, setNextAction] = useState(deal.nextAction || '');
  const [nextActionAt, setNextActionAt] = useState(
    deal.nextActionAt ? deal.nextActionAt.substring(0, 16) : ''
  );
  const [currentStageId, setCurrentStageId] = useState(deal.stageId);
  const [priority, setPriority] = useState<Priority>(deal.priority);
  const [dealValue, setDealValue] = useState(deal.value);
  const [isSaving, setIsSaving] = useState(false);

  // Quick activity log form
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [actType, setActType] = useState<Activity['type']>('Call');
  const [actSubject, setActSubject] = useState('');
  const [actDesc, setActDesc] = useState('');

  const isStale = isDealStale(deal, staleThreshold);
  const followUpStatus = getFollowUpStatus(deal.nextActionAt, deal.nextAction);

  // Filter activities related to this deal
  const dealActivities = activities.filter(
    (a) => a.relatedEntityType === 'deal' && a.relatedEntityId === deal.id
  );

  const handleUpdateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;
    try {
      setIsSaving(true);
      const updatedDeal: Deal = {
        ...deal,
        stageId: currentStageId,
        status: currentStageId === 'closed-won' ? 'Won' : currentStageId === 'closed-lost' ? 'Lost' : 'Open',
        priority,
        value: Number(dealValue) || 0,
        nextAction: nextAction.trim(),
        nextActionAt: nextActionAt ? new Date(nextActionAt).toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      };

      await saveDeal(organization.id, updatedDeal, {
        id: user?.uid || 'user',
        name: member?.name || 'User',
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error('Failed to update deal:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !actSubject.trim()) return;

    await createActivity(
      organization.id,
      {
        id: '',
        organizationId: organization.id,
        type: actType,
        subject: actSubject.trim(),
        description: actDesc.trim(),
        actorId: user?.uid || '',
        actorName: member?.name || 'User',
        relatedEntityType: 'deal',
        relatedEntityId: deal.id,
        relatedEntityName: deal.title,
        occurredAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      { id: user?.uid || 'user', name: member?.name || 'User' }
    );

    setActSubject('');
    setActDesc('');
    setShowLogActivity(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 my-8 text-slate-800">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-purple-100 text-purple-800">
                Deal Record
              </span>
              {isStale && (
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-orange-100 text-orange-800 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-600" />
                  Stale ({getDaysSinceLastActivity(deal)}d inactive)
                </span>
              )}
              {followUpStatus === 'Overdue' && (
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-rose-100 text-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  Overdue Follow-Up
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{deal.title}</h2>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
              <span>Account: <strong>{deal.companyName || 'None'}</strong></span>
              <span>Contact: <strong>{deal.contactName || 'None'}</strong></span>
              <span>Owner: <strong>{deal.ownerName || 'Unassigned'}</strong></span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Progress Tracker */}
        <div className="py-4 border-b border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pipeline Stage Progression
          </div>
          <div className="grid grid-cols-6 gap-1.5 text-center">
            {DEFAULT_PIPELINE_STAGES.map((st) => {
              const isCurrent = currentStageId === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setCurrentStageId(st.id)}
                  className={`py-2 px-1 rounded text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-emerald-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate block">{st.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Step & Core Workflow (The Core CRM Loop) */}
        <form onSubmit={handleUpdateDeal} className="py-4 space-y-4 text-xs">
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                <Clock className="w-4 h-4 text-emerald-700" />
                The Core Loop: Next Action & Follow-Up Schedule
              </span>
              <span className="text-[11px] font-semibold text-emerald-800">
                Status: {followUpStatus}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Next Action (e.g. &quot;Send revised quote&quot;)
                </label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="Explicit next step to advance deal..."
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-Up Due Date</label>
                <input
                  type="datetime-local"
                  value={nextActionAt}
                  onChange={(e) => setNextActionAt(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deal Value</label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expected Close Date</label>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                {formatDate(deal.expectedCloseDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowLogActivity(!showLogActivity)}
              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Touchpoint Activity</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs disabled:opacity-50"
            >
              {isSaving ? 'Saving Changes...' : 'Save & Update Pipeline'}
            </button>
          </div>
        </form>

        {/* Activity Quick Logger Drawer */}
        {showLogActivity && (
          <form onSubmit={handleQuickLogActivity} className="p-4 mb-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Log Activity on this Deal</span>
              <span className="text-[11px] text-slate-500">Will automatically refresh lastActivityAt</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Activity Type</label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value as Activity['type'])}
                  className="w-full p-2 rounded border border-slate-300 bg-white"
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Note">Note</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-slate-600 mb-1 font-semibold">Subject / Title *</label>
                <input
                  type="text"
                  value={actSubject}
                  onChange={(e) => setActSubject(e.target.value)}
                  placeholder="e.g. Discovery call on security compliance"
                  required
                  className="w-full p-2 rounded border border-slate-300 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Discussion Details</label>
              <textarea
                rows={2}
                value={actDesc}
                onChange={(e) => setActDesc(e.target.value)}
                placeholder="Key takeaways, customer questions, agreements reached..."
                className="w-full p-2 rounded border border-slate-300 bg-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogActivity(false)}
                className="px-3 py-1 text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs"
              >
                Save Activity
              </button>
            </div>
          </form>
        )}

        {/* Activity History for this Deal */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Deal History & Sales Touchpoints ({dealActivities.length})
          </div>
          {dealActivities.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              No previous activities logged for this deal yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {dealActivities.map((act) => (
                <div key={act.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px]">
                        {act.type}
                      </span>
                      {act.subject}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">{formatDateTime(act.occurredAt)}</span>
                  </div>
                  {act.description && <p className="text-slate-600 text-[11px] mt-1">{act.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
