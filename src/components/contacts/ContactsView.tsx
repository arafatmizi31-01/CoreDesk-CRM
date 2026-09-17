import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Contact as ContactIcon,
  X,
} from 'lucide-react';
import { Contact, Company } from '../../types/crm';
import { saveContact, deleteContact } from '../../services/crmService';
import { useAuth } from '../../context/AuthContext';

interface ContactsViewProps {
  contacts: Contact[];
  companies: Company[];
  onRefresh: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ contacts, companies, onRefresh }) => {
  const { organization, member, user, effectiveRole } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.companyName || '').toLowerCase().includes(q) ||
        (c.title || '').toLowerCase().includes(q)
      );
    });
  }, [contacts, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const paginated = filteredContacts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreate = () => {
    setEditingContact(null);
    setName('');
    setEmail('');
    setPhone('');
    setTitle('');
    setCompanyId(companies[0]?.id || '');
    setShowModal(true);
  };

  const openEdit = (c: Contact) => {
    setEditingContact(c);
    setName(c.name);
    setEmail(c.email || '');
    setPhone(c.phone || '');
    setTitle(c.title || '');
    setCompanyId(c.companyId || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    const selectedCo = companies.find((co) => co.id === companyId);

    const contactData: Contact = {
      id: editingContact?.id || '',
      organizationId: organization.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      title: title.trim(),
      companyId: companyId || undefined,
      companyName: selectedCo ? selectedCo.name : undefined,
      ownerId: editingContact?.ownerId || member?.uid || user?.uid || '',
      ownerName: editingContact?.ownerName || member?.name || 'Owner',
      createdAt: editingContact?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveContact(organization.id, contactData, {
      id: user?.uid || 'user',
      name: member?.name || 'User',
    });

    setShowModal(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!organization) return;
    if (confirm('Delete this contact?')) {
      await deleteContact(organization.id, id, {
        id: user?.uid || 'user',
        name: member?.name || 'User',
      });
      onRefresh();
    }
  };

  return (
    <div id="coredesk-contacts-view" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full max-w-full box-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Contacts Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Key customer decision makers, stakeholders, and champions linked to accounts and deals.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Contact</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs w-full max-w-full box-border">
        <div className="relative flex-1 min-w-[200px] max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, company, job title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 min-h-[40px]"
          />
        </div>
        <span className="text-slate-500">{filteredContacts.length} contacts found</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full max-w-full box-border">
        {paginated.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ContactIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No contacts found</div>
            <p className="text-xs text-slate-500 mt-1">Create contacts manually or convert qualified leads.</p>
          </div>
        ) : (
          <div className="table-responsive-container w-full max-w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[650px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Contact Name</th>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginated.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 text-slate-600">{c.title || '—'}</td>
                    <td className="py-3 px-4">
                      {c.companyName ? (
                        <span className="font-medium text-slate-800">{c.companyName}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {c.email ? (
                        <a href={`mailto:${c.email}`} className="text-emerald-700 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{c.email}</span>
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
                    <td className="py-3 px-4 text-slate-500">{c.ownerName || 'Unassigned'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                          title="Edit Contact"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {effectiveRole !== 'Sales Rep' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredContacts.length > pageSize && (
          <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 w-full max-w-full box-border">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredContacts.length)} of{' '}
              {filteredContacts.length}
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
                {editingContact ? 'Edit Contact' : 'Create Contact'}
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
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Marcus Vance"
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VP of Procurement"
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Associated Company</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white min-h-[38px]"
                >
                  <option value="">None / Independent</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                  />
                </div>
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
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
