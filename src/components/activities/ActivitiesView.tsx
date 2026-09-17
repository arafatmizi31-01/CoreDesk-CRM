import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Activity as ActivityIcon,
  Phone,
  Mail,
  Users,
  FileText,
  Clock,
  Filter,
  X,
} from 'lucide-react';
import { Activity, Deal, Company, Contact, Lead } from '../../types/crm';
import { createActivity } from '../../services/crmService';
import { formatDateTime } from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface ActivitiesViewProps {
  activities: Activity[];
  deals: Deal[];
  companies: Company[];
  contacts: Contact[];
  leads: Lead[];
  onRefresh: () => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  deals,
  companies,
  contacts,
  leads,
  onRefresh,
}) => {
  const { organization, member, user } = useAuth();

  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [type, setType] = useState<Activity['type']>('Call');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [relatedType, setRelatedType] = useState<Activity['relatedEntityType']>('deal');
  const [relatedId, setRelatedId] = useState('');

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      if (typeFilter !== 'All' && a.type !== typeFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          a.subject.toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q) ||
          (a.relatedEntityName || '').toLowerCase().includes(q) ||
          (a.actorName || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activities, typeFilter, searchTerm]);

  const openCreate = () => {
    setSubject('');
    setDescription('');
    setType('Call');
    setRelatedType('deal');
    setRelatedId(deals[0]?.id || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !subject.trim()) return;

    let entityName: string | undefined;
    if (relatedType === 'deal') entityName = deals.find((d) => d.id === relatedId)?.title;
    else if (relatedType === 'lead') entityName = leads.find((l) => l.id === relatedId)?.name;
    else if (relatedType === 'contact') entityName = contacts.find((c) => c.id === relatedId)?.name;
    else if (relatedType === 'company') entityName = companies.find((co) => co.id === relatedId)?.name;

    const newActivity: Activity = {
      id: '',
      organizationId: organization.id,
      type,
      subject: subject.trim(),
      description: description.trim(),
      actorId: user?.uid || '',
      actorName: member?.name || 'User',
      relatedEntityType: relatedType,
      relatedEntityId: relatedId || undefined,
      relatedEntityName: entityName,
      occurredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await createActivity(organization.id, newActivity, {
      id: user?.uid || 'user',
      name: member?.name || 'User',
    });

    setShowModal(false);
    onRefresh();
  };

  const getTypeIcon = (t: Activity['type']) => {
    switch (t) {
      case 'Call':
        return <Phone className="w-3.5 h-3.5 text-blue-600" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Meeting':
        return <Users className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div id="coredesk-activities-view" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full max-w-full box-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Activity Timeline & Touchpoints</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade history of calls, emails, client meetings, and discovery notes across the workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Log Touchpoint</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs w-full max-w-full box-border">
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {(['All', 'Call', 'Email', 'Meeting', 'Note'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTypeFilter(tab)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors min-h-[36px] ${
                typeFilter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm min-w-[200px] w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search activities, accounts, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white min-h-[40px]"
          />
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 sm:p-6 w-full max-w-full box-border">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ActivityIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No activities recorded</div>
            <p className="text-xs text-slate-500 mt-1">Log calls, notes, and emails to preserve customer memory.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-2 sm:ml-4 pl-4 sm:pl-6 space-y-6">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-[27px] sm:-left-[35px] top-0 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-xs">
                  {getTypeIcon(act.type)}
                </div>

                <div className="bg-slate-50/80 hover:bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 transition-colors w-full max-w-full box-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{act.subject}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-white text-slate-600 border border-slate-200">
                        {act.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatDateTime(act.occurredAt)}
                    </span>
                  </div>

                  {act.description && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{act.description}</p>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Logged by <strong className="text-slate-700">{act.actorName || 'Team Member'}</strong></span>
                    </div>
                    {act.relatedEntityName && (
                      <span className="text-emerald-800 font-medium">
                        Linked: {act.relatedEntityName} ({act.relatedEntityType})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-4 sm:p-6 text-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-base font-bold text-slate-900">Log Sales Touchpoint</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Activity['type'])}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white min-h-[38px]"
                  >
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Note">Note</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="e.g. Discussed pricing model"
                    className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Target</label>
                  <select
                    value={relatedType}
                    onChange={(e) => {
                      const t = e.target.value as Activity['relatedEntityType'];
                      setRelatedType(t);
                      if (t === 'deal') setRelatedId(deals[0]?.id || '');
                      else if (t === 'lead') setRelatedId(leads[0]?.id || '');
                      else if (t === 'company') setRelatedId(companies[0]?.id || '');
                      else if (t === 'contact') setRelatedId(contacts[0]?.id || '');
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white min-h-[38px]"
                  >
                    <option value="deal">Deal</option>
                    <option value="lead">Lead</option>
                    <option value="company">Company</option>
                    <option value="contact">Contact</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Record</label>
                  <select
                    value={relatedId}
                    onChange={(e) => setRelatedId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white min-h-[38px]"
                  >
                    {relatedType === 'deal' &&
                      deals.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title}
                        </option>
                      ))}
                    {relatedType === 'lead' &&
                      leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    {relatedType === 'company' &&
                      companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    {relatedType === 'contact' &&
                      contacts.map((ct) => (
                        <option key={ct.id} value={ct.id}>
                          {ct.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of conversation, key commitments..."
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs min-h-[40px]"
                >
                  Save Touchpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
