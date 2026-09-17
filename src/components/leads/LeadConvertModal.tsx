import React, { useState } from 'react';
import { X, ArrowRight, UserCheck, Building2, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Lead, Company, Contact } from '../../types/crm';
import { convertLead, LeadConversionParams } from '../../services/crmService';
import { formatCurrency, DEFAULT_PIPELINE_STAGES } from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface LeadConvertModalProps {
  lead: Lead;
  companies: Company[];
  contacts: Contact[];
  onClose: () => void;
  onSuccess: () => void;
}

export const LeadConvertModal: React.FC<LeadConvertModalProps> = ({
  lead,
  companies,
  contacts,
  onClose,
  onSuccess,
}) => {
  const { organization, member, user } = useAuth();

  // Check for potential duplicate/existing matches
  const matchingCompany = companies.find(
    (c) => lead.companyName && c.name.toLowerCase() === lead.companyName.trim().toLowerCase()
  );
  const matchingContact = contacts.find(
    (ct) => ct.email && lead.email && ct.email.toLowerCase() === lead.email.trim().toLowerCase()
  );

  // States
  const [companyMode, setCompanyMode] = useState<'create_new' | 'link_existing' | 'none'>(
    matchingCompany ? 'link_existing' : lead.companyName ? 'create_new' : 'none'
  );
  const [existingCompanyId, setExistingCompanyId] = useState<string>(matchingCompany?.id || companies[0]?.id || '');
  const [newCompanyName, setNewCompanyName] = useState<string>(lead.companyName || '');

  const [contactMode, setContactMode] = useState<'create_new' | 'link_existing'>(
    matchingContact ? 'link_existing' : 'create_new'
  );
  const [existingContactId, setExistingContactId] = useState<string>(matchingContact?.id || contacts[0]?.id || '');
  const [contactName, setContactName] = useState<string>(lead.name);

  const [createDeal, setCreateDeal] = useState<boolean>(true);
  const [dealTitle, setDealTitle] = useState<string>(
    `${lead.companyName || lead.name} — Initial Opportunity`
  );
  const [dealValue, setDealValue] = useState<number>(lead.estimatedValue || 15000);
  const [dealStageId, setDealStageId] = useState<string>('qualified');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const params: LeadConversionParams = {
        leadId: lead.id,
        leadName: contactName,
        leadEmail: lead.email,
        leadPhone: lead.phone,
        companyMode,
        existingCompanyId: companyMode === 'link_existing' ? existingCompanyId : undefined,
        newCompanyName: companyMode === 'create_new' ? newCompanyName : undefined,
        contactMode,
        existingContactId: contactMode === 'link_existing' ? existingContactId : undefined,
        createDeal,
        dealTitle: createDeal ? dealTitle : undefined,
        dealValue: createDeal ? Number(dealValue) || 0 : undefined,
        dealStageId: createDeal ? dealStageId : undefined,
        ownerId: lead.ownerId || member?.uid || user?.uid || '',
        ownerName: lead.ownerName || member?.name || 'Owner',
      };

      await convertLead(
        organization.id,
        params,
        { id: user?.uid || 'user', name: member?.name || 'User' }
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Lead conversion failed:', err);
      setError('Failed to convert lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-4 sm:p-6 my-auto max-h-[92vh] overflow-y-auto text-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Deterministic Lead Conversion</h2>
              <p className="text-xs text-slate-500">
                Converting prospect: <strong className="text-slate-800">{lead.name}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900">
          <strong>Deterministic Guarantee (Section 19):</strong> Leads are never silently converted into unwanted records.
          Review exactly what will be created and linked below before committing.
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleConvert} className="space-y-5">
          {/* 1. Contact Section */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                Step 1: Create or Link Contact
              </span>
              {matchingContact && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Existing email match found
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="contactMode"
                  value="create_new"
                  checked={contactMode === 'create_new'}
                  onChange={() => setContactMode('create_new')}
                  className="text-emerald-700 focus:ring-emerald-700"
                />
                Create New Contact: <strong>{lead.name}</strong>
              </label>

              {contacts.length > 0 && (
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMode"
                    value="link_existing"
                    checked={contactMode === 'link_existing'}
                    onChange={() => setContactMode('link_existing')}
                    className="text-emerald-700 focus:ring-emerald-700"
                  />
                  Link to Existing Contact
                </label>
              )}
            </div>

            {contactMode === 'link_existing' && (
              <div className="mt-3">
                <select
                  value={existingContactId}
                  onChange={(e) => setExistingContactId(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email || 'No email'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Company Section */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Step 2: Create or Link Company Account
              </span>
              {matchingCompany && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                  Existing company match found
                </span>
              )}
            </div>

            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="companyMode"
                  value="create_new"
                  checked={companyMode === 'create_new'}
                  onChange={() => setCompanyMode('create_new')}
                  className="text-emerald-700 focus:ring-emerald-700"
                />
                <span>Create New Company Account</span>
              </label>
              {companyMode === 'create_new' && (
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white ml-6 max-w-sm"
                  required={companyMode === 'create_new'}
                />
              )}

              {companies.length > 0 && (
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="companyMode"
                    value="link_existing"
                    checked={companyMode === 'link_existing'}
                    onChange={() => setCompanyMode('link_existing')}
                    className="text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>Link to Existing Company</span>
                </label>
              )}
              {companyMode === 'link_existing' && (
                <div className="ml-6 max-w-sm">
                  <select
                    value={existingCompanyId}
                    onChange={(e) => setExistingCompanyId(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  >
                    {companies.map((co) => (
                      <option key={co.id} value={co.id}>
                        {co.name} ({co.industry || 'No industry'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="companyMode"
                  value="none"
                  checked={companyMode === 'none'}
                  onChange={() => setCompanyMode('none')}
                  className="text-emerald-700 focus:ring-emerald-700"
                />
                <span>Do not link to any company</span>
              </label>
            </div>
          </div>

          {/* 3. Optional Deal Section */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createDeal}
                  onChange={(e) => setCreateDeal(e.target.checked)}
                  className="text-emerald-700 focus:ring-emerald-700 h-4 w-4 rounded"
                />
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Step 3: Optionally Create Sales Opportunity Deal
                </span>
              </label>
              <span className="text-[11px] text-slate-500">
                {createDeal ? 'Deal will be added to pipeline' : 'No deal created'}
              </span>
            </div>

            {createDeal && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-2 border-t border-slate-200">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Deal Title</label>
                  <input
                    type="text"
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                    required={createDeal}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Estimated Value</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Initial Pipeline Stage</label>
                  <select
                    value={dealStageId}
                    onChange={(e) => setDealStageId(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  >
                    {DEFAULT_PIPELINE_STAGES.filter((s) => !s.isLost).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.probabilityDefault}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              id="confirm-convert-lead-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? 'Converting...' : 'Commit Lead Conversion'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
