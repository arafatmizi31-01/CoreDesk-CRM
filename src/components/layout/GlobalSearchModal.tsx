import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Briefcase, Users2, Contact, Building2, CheckSquare, ArrowRight } from 'lucide-react';
import { Deal, Lead, Contact as ContactType, Company, Task } from '../../types/crm';
import { formatCurrency } from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  leads: Lead[];
  contacts: ContactType[];
  companies: Company[];
  tasks: Task[];
  onSelectDeal: (deal: Deal) => void;
  onSelectLead: (lead: Lead) => void;
  onNavigateView: (view: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  deals,
  leads,
  contacts,
  companies,
  tasks,
  onSelectDeal,
  onSelectLead,
  onNavigateView,
}) => {
  const { organization } = useAuth();
  const currency = organization?.currency || 'USD';
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingDeals = q ? deals.filter((d) => d.title.toLowerCase().includes(q) || (d.companyName || '').toLowerCase().includes(q)).slice(0, 4) : [];
  const matchingLeads = q ? leads.filter((l) => l.name.toLowerCase().includes(q) || (l.companyName || '').toLowerCase().includes(q)).slice(0, 4) : [];
  const matchingContacts = q ? contacts.filter((c) => c.name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)).slice(0, 4) : [];
  const matchingCompanies = q ? companies.filter((c) => c.name.toLowerCase().includes(q) || (c.domain || '').toLowerCase().includes(q)).slice(0, 4) : [];
  const matchingTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 4) : [];

  const hasResults =
    matchingDeals.length > 0 ||
    matchingLeads.length > 0 ||
    matchingContacts.length > 0 ||
    matchingCompanies.length > 0 ||
    matchingTasks.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden text-slate-800">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals, prospects, contacts, accounts, tasks..."
            className="w-full text-sm outline-none placeholder-slate-400"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 text-xs">
          {!query.trim() ? (
            <div className="p-6 text-center text-slate-400">
              Type to search across all CoreDesk CRM entities...
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-slate-400">
              No matching records found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-4">
              {/* Deals */}
              {matchingDeals.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Deals ({matchingDeals.length})</span>
                  </div>
                  {matchingDeals.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        onSelectDeal(d);
                        onClose();
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 block truncate">{d.title}</span>
                        <span className="text-[11px] text-slate-500">{d.companyName || d.stageName}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-800 shrink-0">
                        {formatCurrency(d.value, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Leads */}
              {matchingLeads.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <Users2 className="w-3.5 h-3.5" />
                    <span>Leads ({matchingLeads.length})</span>
                  </div>
                  {matchingLeads.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        onSelectLead(l);
                        onClose();
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 block truncate">{l.name}</span>
                        <span className="text-[11px] text-slate-500">{l.companyName || l.email}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800">
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Contacts */}
              {matchingContacts.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <Contact className="w-3.5 h-3.5" />
                    <span>Contacts ({matchingContacts.length})</span>
                  </div>
                  {matchingContacts.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onNavigateView('contacts');
                        onClose();
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 block truncate">{c.name}</span>
                        <span className="text-[11px] text-slate-500">{c.title || c.companyName || c.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Companies */}
              {matchingCompanies.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Companies ({matchingCompanies.length})</span>
                  </div>
                  {matchingCompanies.map((co) => (
                    <div
                      key={co.id}
                      onClick={() => {
                        onNavigateView('companies');
                        onClose();
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 block truncate">{co.name}</span>
                        <span className="text-[11px] text-slate-500">{co.industry || co.domain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {matchingTasks.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Tasks ({matchingTasks.length})</span>
                  </div>
                  {matchingTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onNavigateView('tasks');
                        onClose();
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="font-medium text-slate-900 truncate">{t.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>CoreDesk Fast Search</span>
        </div>
      </div>
    </div>
  );
};
