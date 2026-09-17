import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Building2,
  Globe,
  Phone,
  Briefcase,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Company, Deal } from '../../types/crm';
import { saveCompany, deleteCompany } from '../../services/crmService';
import { formatCurrency } from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface CompaniesViewProps {
  companies: Company[];
  deals: Deal[];
  onRefresh: () => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({ companies, deals, onRefresh }) => {
  const { organization, member, user, effectiveRole } = useAuth();
  const currency = organization?.currency || 'USD';

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.industry || '').toLowerCase().includes(q) ||
        (c.domain || '').toLowerCase().includes(q)
      );
    });
  }, [companies, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / pageSize));
  const paginated = filteredCompanies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreate = () => {
    setEditingCompany(null);
    setName('');
    setDomain('');
    setIndustry('');
    setPhone('');
    setAddress('');
    setShowModal(true);
  };

  const openEdit = (c: Company) => {
    setEditingCompany(c);
    setName(c.name);
    setDomain(c.domain || '');
    setIndustry(c.industry || '');
    setPhone(c.phone || '');
    setAddress(c.address || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    const companyData: Company = {
      id: editingCompany?.id || '',
      organizationId: organization.id,
      name: name.trim(),
      domain: domain.trim(),
      industry: industry.trim(),
      phone: phone.trim(),
      address: address.trim(),
      ownerId: editingCompany?.ownerId || member?.uid || user?.uid || '',
      ownerName: editingCompany?.ownerName || member?.name || 'Owner',
      createdAt: editingCompany?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveCompany(organization.id, companyData, {
      id: user?.uid || 'user',
      name: member?.name || 'User',
    });

    setShowModal(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!organization) return;
    if (confirm('Delete this company account?')) {
      await deleteCompany(organization.id, id, {
        id: user?.uid || 'user',
        name: member?.name || 'User',
      });
      onRefresh();
    }
  };

  return (
    <div id="coredesk-companies-view" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full max-w-full box-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Company Accounts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            B2B accounts, business relationships, associated contacts, and pipeline deal volume.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Company Account</span>
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs w-full max-w-full box-border">
        <div className="relative flex-1 min-w-[200px] max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search companies by name, industry, domain..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
          />
        </div>
        <span className="text-slate-500">{filteredCompanies.length} accounts found</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full max-w-full box-border">
        {paginated.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No company accounts found</div>
            <p className="text-xs text-slate-500 mt-1">Create accounts or link them during lead conversion.</p>
          </div>
        ) : (
          <div className="table-responsive-container w-full max-w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Pipeline Deals</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginated.map((c) => {
                  const companyDeals = deals.filter((d) => d.companyId === c.id);
                  const totalValue = companyDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{c.name}</td>
                      <td className="py-3 px-4 text-slate-600">{c.industry || '—'}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {c.domain ? (
                          <a
                            href={`https://${c.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-3 h-3 text-slate-400" />
                            <span>{c.domain}</span>
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {c.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{c.phone}</span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold font-mono text-slate-900">
                            {formatCurrency(totalValue, currency)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                            {companyDeals.length}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{c.ownerName || 'Unassigned'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(c)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Edit Company"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {effectiveRole !== 'Sales Rep' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(c.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                              title="Delete Company"
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

        {filteredCompanies.length > pageSize && (
          <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 w-full max-w-full box-border">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredCompanies.length)} of{' '}
              {filteredCompanies.length}
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
              <span className="px-2 font-medium">Page {currentPage} of {totalPages}</span>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-4 sm:p-6 text-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingCompany ? 'Edit Company Account' : 'Create Company Account'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Apex Industrial Systems"
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Logistics, Healthcare"
                    className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Website Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="apex.com"
                    className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Office Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP"
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
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
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
