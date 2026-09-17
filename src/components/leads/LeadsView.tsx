import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  UserCheck,
  Phone,
  Mail,
  MoreVertical,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Lead, Company, Contact, LeadStatus, Priority } from '../../types/crm';
import { saveLead, deleteLead } from '../../services/crmService';
import { formatCurrency, formatDate } from '../../utils/crmCalculations';
import { LeadConvertModal } from './LeadConvertModal';
import { useAuth } from '../../context/AuthContext';

interface LeadsViewProps {
  leads: Lead[];
  companies: Company[];
  contacts: Contact[];
  onRefresh: () => void;
}

// Helper function to format ISO date string to local datetime-local input value without timezone shifts
const formatLocalDateTime = (isoString?: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Robust CSV line parser that handles quoted values containing commas
const parseCSVLine = (text: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, '').trim());
};

export const LeadsView: React.FC<LeadsViewProps> = ({ leads, companies, contacts, onRefresh }) => {
  const { organization, member, user, effectiveRole } = useAuth();
  const currency = organization?.currency || 'USD';

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'createdAt' | 'name' | 'estimatedValue'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSource, setFormSource] = useState('Website');
  const [formStatus, setFormStatus] = useState<LeadStatus>('New');
  const [formPriority, setFormPriority] = useState<Priority>('Medium');
  const [formValue, setFormValue] = useState<number>(10000);
  const [formFollowUp, setFormFollowUp] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !organization) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/);
      if (lines.length <= 1) return;

      const validStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'];
      const validPriorities: Priority[] = ['Low', 'Medium', 'High'];

      let importedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = parseCSVLine(line);
        const [name, company, email, status, priority, value] = cols;
        
        if (name) {
          const rawStatus = status?.trim();
          const leadStatus: LeadStatus = validStatuses.includes(rawStatus as LeadStatus) ? (rawStatus as LeadStatus) : 'New';

          const rawPriority = priority?.trim();
          const leadPriority: Priority = validPriorities.includes(rawPriority as Priority) ? (rawPriority as Priority) : 'Medium';

          const leadData: Lead = {
            id: `lead-${Date.now()}-${i}`,
            organizationId: organization.id,
            name: name,
            companyName: company || 'N/A',
            email: email || '',
            phone: '',
            source: 'CSV Import',
            status: leadStatus,
            priority: leadPriority,
            estimatedValue: value ? parseFloat(value) || 0 : 0,
            notes: '',
            ownerId: member?.uid || user?.uid || '',
            ownerName: member?.name || 'Unassigned',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await saveLead(organization.id, leadData, {
            id: user?.uid || 'user',
            name: member?.name || 'User',
          });
          importedCount++;
        }
      }

      if (importedCount > 0) {
        alert(`${importedCount} টি নতুন লিড সফলভাবে ইমপোর্ট করা হয়েছে!`);
        onRefresh();
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => {
        if (statusFilter !== 'All' && l.status !== statusFilter) return false;
        if (priorityFilter !== 'All' && l.priority !== priorityFilter) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = l.name.toLowerCase().includes(q);
          const matchEmail = (l.email || '').toLowerCase().includes(q);
          const matchCompany = (l.companyName || '').toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchCompany) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortField === 'estimatedValue') cmp = (a.estimatedValue || 0) - (b.estimatedValue || 0);
        else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortAsc ? cmp : -cmp;
      });
  }, [leads, statusFilter, priorityFilter, searchTerm, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreateModal = () => {
    setEditingLead(null);
    setFormName('');
    setFormCompany('');
    setFormEmail('');
    setFormPhone('');
    setFormSource('Website');
    setFormStatus('New');
    setFormPriority('Medium');
    setFormValue(12000);
    setFormFollowUp('');
    setFormNotes('');
    setShowEditModal(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormName(lead.name);
    setFormCompany(lead.companyName || '');
    setFormEmail(lead.email || '');
    setFormPhone(lead.phone || '');
    setFormSource(lead.source || 'Website');
    setFormStatus(lead.status);
    setFormPriority(lead.priority);
    setFormValue(lead.estimatedValue || 0);
    setFormFollowUp(formatLocalDateTime(lead.nextFollowUpAt));
    setFormNotes(lead.notes || '');
    setShowEditModal(true);
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    const leadData: Lead = {
      id: editingLead?.id || '',
      organizationId: organization.id,
      name: formName.trim(),
      companyName: formCompany.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      source: formSource,
      status: formStatus,
      priority: formPriority,
      ownerId: editingLead?.ownerId || member?.uid || user?.uid || '',
      ownerName: editingLead?.ownerName || member?.name || 'Owner',
      estimatedValue: Number(formValue) || 0,
      nextFollowUpAt: formFollowUp ? new Date(formFollowUp).toISOString() : undefined,
      notes: formNotes,
      createdAt: editingLead?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveLead(organization.id, leadData, {
      id: user?.uid || 'user',
      name: member?.name || 'User',
    });

    setShowEditModal(false);
    onRefresh();
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!organization) return;
    if (confirm('Are you sure you want to remove this lead?')) {
      await deleteLead(organization.id, leadId, {
        id: user?.uid || 'user',
        name: member?.name || 'User',
      });
      onRefresh();
    }
  };

  return (
    <div id="coredesk-leads-view" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full box-border">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full box-border">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Leads Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track inbound interest, qualify prospects, and deterministically convert into active accounts and deals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs min-h-[40px]">
            Import CSV
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleCSVImport} 
              className="hidden" 
            />
          </label>

          <button
            id="add-lead-btn"
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>New Prospect Lead</span>
          </button>
        </div>
      </div>

      {/* Controls: Search, Filters & Sorting */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs w-full box-border">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            id="leads-search-input"
            type="text"
            placeholder="Filter leads by name, email, company..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            id="leads-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none min-h-[40px]"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Unqualified">Unqualified</option>
            <option value="Converted">Converted</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Priority:</span>
          <select
            id="leads-priority-filter"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none min-h-[40px]"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortAsc(!sortAsc)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1 font-medium min-h-[40px]"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? 'Asc' : 'Desc'}</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full box-border">
        {paginatedLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No leads found</div>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm || statusFilter !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'Click "+ New Prospect Lead" to create your first prospect.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive-container w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[720px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Lead Name</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Est. Value</th>
                  <th className="py-3 px-4">Next Follow-Up</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedLeads.map((lead) => {
                  const isConverted = lead.status === 'Converted';
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex flex-col">
                          <span>{lead.name}</span>
                          <span className="text-[11px] text-slate-500 font-normal">{lead.email || lead.phone || 'No direct contact'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{lead.companyName || '—'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            lead.status === 'Converted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.status === 'Qualified'
                              ? 'bg-blue-100 text-blue-800'
                              : lead.status === 'New'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            lead.priority === 'High'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : lead.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-50 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {lead.estimatedValue ? formatCurrency(lead.estimatedValue, currency) : '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {lead.nextFollowUpAt ? formatDate(lead.nextFollowUpAt) : 'None scheduled'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{lead.ownerName || 'Unassigned'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isConverted && (
                            <button
                              id={`convert-lead-${lead.id}`}
                              type="button"
                              onClick={() => setConvertingLead(lead)}
                              className="px-2.5 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] transition-colors flex items-center gap-1 min-h-[32px]"
                              title="Deterministic Lead Conversion"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Convert</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditModal(lead)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Edit Lead"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {effectiveRole !== 'Sales Rep' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredLeads.length > pageSize && (
          <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 w-full box-border">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredLeads.length)} of{' '}
              {filteredLeads.length} leads
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

      {/* Add / Edit Lead Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 text-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingLead ? 'Edit Lead Prospect' : 'Create Prospect Lead'}
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Lead Contact Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="e.g. Jane Doe"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as LeadStatus)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Unqualified">Unqualified</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as Priority)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Deal Value</label>
                  <input
                    type="number"
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Follow-Up Date & Time</label>
                <input
                  type="datetime-local"
                  value={formFollowUp}
                  onChange={(e) => setFormFollowUp(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discovery Notes / Context</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key pain points, decision makers, budget requirements..."
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deterministic Lead Conversion Modal */}
      {convertingLead && (
        <LeadConvertModal
          lead={convertingLead!}
          companies={companies}
          contacts={contacts}
          onClose={() => setConvertingLead(null)}
          onSuccess={() => {
            onRefresh();
            setConvertingLead(null);
          }}
        />
      )}
    </div>
  );
};