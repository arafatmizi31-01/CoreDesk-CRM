import React, { useState } from 'react';
import { X, Briefcase } from 'lucide-react';
import { Deal, Company, Contact, Priority } from '../../types/crm';
import { saveDeal } from '../../services/crmService';
import { DEFAULT_PIPELINE_STAGES } from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface CreateDealModalProps {
  companies: Company[];
  contacts: Contact[];
  onClose: () => void;
  onRefresh: () => void;
}

export const CreateDealModal: React.FC<CreateDealModalProps> = ({
  companies,
  contacts,
  onClose,
  onRefresh,
}) => {
  const { organization, member, user } = useAuth();

  const [title, setTitle] = useState('');
  const [value, setValue] = useState<number>(20000);
  const [stageId, setStageId] = useState('new');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [companyId, setCompanyId] = useState(companies[0]?.id || '');
  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [nextAction, setNextAction] = useState('Initial discovery call');
  const [nextActionAt, setNextActionAt] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !title.trim()) return;

    try {
      setIsSubmitting(true);
      const selStage = DEFAULT_PIPELINE_STAGES.find((s) => s.id === stageId) || DEFAULT_PIPELINE_STAGES[0];
      const selCompany = companies.find((c) => c.id === companyId);
      const selContact = contacts.find((ct) => ct.id === contactId);

      const newDeal: Deal = {
        id: '',
        organizationId: organization.id,
        title: title.trim(),
        value: Number(value) || 0,
        stageId: selStage.id,
        stageName: selStage.name,
        status: selStage.isWon ? 'Won' : selStage.isLost ? 'Lost' : 'Open',
        probability: selStage.probabilityDefault,
        priority,
        companyId: companyId || undefined,
        companyName: selCompany ? selCompany.name : undefined,
        contactId: contactId || undefined,
        contactName: selContact ? selContact.name : undefined,
        ownerId: member?.uid || user?.uid || '',
        ownerName: member?.name || 'Owner',
        expectedCloseDate,
        nextAction: nextAction.trim() || undefined,
        nextActionAt: nextActionAt ? new Date(nextActionAt).toISOString() : undefined,
        lastActivityAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveDeal(organization.id, newDeal, {
        id: user?.uid || 'user',
        name: member?.name || 'User',
      });

      onRefresh();
      onClose();
    } catch (err) {
      console.error('Failed to create deal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 my-8 text-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Create New Opportunity Deal</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Deal Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Acme Corp Enterprise Platform Expansion"
              className="w-full p-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Value</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                required
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pipeline Stage</label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white"
              >
                {DEFAULT_PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.probabilityDefault}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Account</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">None / Unlinked</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Contact</label>
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">None / Unlinked</option>
                {contacts.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                required
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          {/* Core Principle Action */}
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <label className="block font-bold text-emerald-900 mb-1">Required Next Action & Follow-Up</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="What is the next step?"
                className="w-full p-2 rounded border border-slate-300 bg-white"
              />
              <input
                type="datetime-local"
                value={nextActionAt}
                onChange={(e) => setNextActionAt(e.target.value)}
                className="w-full p-2 rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Deal...' : 'Create Deal Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
