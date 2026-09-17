import React, { useState } from 'react';
import { Shield, Building2, UserCheck, DollarSign, Globe, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSetupModalProps {
  initialEmail?: string;
  initialName?: string;
}

export const AdminSetupModal: React.FC<AdminSetupModalProps> = ({
  initialEmail = '',
  initialName = '',
}) => {
  const { user, completeSetupGate } = useAuth();

  const [adminName, setAdminName] = useState(initialName || user?.displayName || 'Arafat Mizi');
  const [adminEmail, setAdminEmail] = useState(initialEmail || user?.email || 'arafatmizi31@gmail.com');
  const [orgName, setOrgName] = useState('CoreDesk Sales');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [loadDemoData, setLoadDemoData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim()) {
      setError('Please provide the primary Admin/Owner name.');
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setError('Please provide a valid Gmail / email address for the primary Admin/Owner.');
      return;
    }
    if (!orgName.trim()) {
      setError('Please provide an organization or workspace name.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await completeSetupGate({
        adminName,
        adminEmail,
        orgName,
        currency,
        timezone,
        loadDemoData,
      });
    } catch (err) {
      console.error('Failed to complete setup gate:', err);
      setError('Failed to configure administrator workspace. Please verify connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="admin-setup-gate-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 my-8 text-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">CoreDesk Setup Gate</span>
            <h2 className="text-xl font-bold text-slate-900">Administrator & Workspace Initialization</h2>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Before entering production operations, CoreDesk CRM establishes authenticated ownership, multi-tenant isolation, and default workspace parameters.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question 1: Admin Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              1. Primary Admin / Owner Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="setup-admin-name"
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              required
            />
          </div>

          {/* Question 2: Admin Gmail */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              2. Primary Admin / Owner Gmail Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="setup-admin-email"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              UID: {user?.uid || 'authenticated via Firebase Auth'}
            </span>
          </div>

          {/* Question 3: Organization Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              3. Organization / Workspace Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="setup-org-name"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Acme Sales Group"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Question 4: Default Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                4. Default Currency
              </label>
              <select
                id="setup-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              >
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="CAD">CAD ($) — Canadian Dollar</option>
                <option value="AUD">AUD ($) — Australian Dollar</option>
              </select>
            </div>

            {/* Question 5: Timezone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                5. Workspace Timezone
              </label>
              <input
                id="setup-timezone"
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Sample Data Seeder Option (Section 37) */}
          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                id="setup-load-demo-data"
                type="checkbox"
                checked={loadDemoData}
                onChange={(e) => setLoadDemoData(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Load Fictional CRM Dataset (Recommended for Demo & Evaluation)
                </span>
                <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
                  Populates realistic sample deals, overdue follow-ups, stale opportunities, and team reps to test the Action Center immediately.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              id="submit-setup-gate-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Configuring CoreDesk Workspace...' : 'Initialize Workspace & Enter CoreDesk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
