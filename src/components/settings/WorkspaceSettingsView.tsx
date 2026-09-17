import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Globe,
  Clock,
  Sliders,
  Shield,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  Info,
  DollarSign,
  Calendar,
  Hash,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateWorkspaceSettings } from '../../services/crmService';
import { formatDateTime } from '../../utils/crmCalculations';

interface WorkspaceSettingsViewProps {
  onRefresh?: () => void;
  onNavigateBack?: () => void;
}

export const WorkspaceSettingsView: React.FC<WorkspaceSettingsViewProps> = ({
  onRefresh,
  onNavigateBack,
}) => {
  const { organization, member, user, effectiveRole, refreshOrganization } = useAuth();
  const isOwnerAdmin = effectiveRole === 'Owner/Admin';

  // Supported MVP Settings State
  const [orgName, setOrgName] = useState(organization?.name || 'CoreDesk Workspace');
  const [currency, setCurrency] = useState(organization?.currency || 'USD');
  const [timezone, setTimezone] = useState(organization?.timezone || 'UTC');
  const [staleDays, setStaleDays] = useState(organization?.staleDealDays ?? 7);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize when organization updates in context
  useEffect(() => {
    if (organization) {
      setOrgName(organization.name || '');
      setCurrency(organization.currency || 'USD');
      setTimezone(organization.timezone || 'UTC');
      setStaleDays(organization.staleDealDays ?? 7);
    }
  }, [organization]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    if (!isOwnerAdmin) {
      setErrorMessage('Only Owner/Admin accounts have permission to update workspace settings.');
      return;
    }

    if (!orgName.trim()) {
      setErrorMessage('Workspace name cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);

      await updateWorkspaceSettings(
        organization.id,
        {
          name: orgName.trim(),
          currency,
          timezone,
          staleDealDays: Math.max(1, Math.min(90, Number(staleDays) || 7)),
        },
        {
          id: user?.uid || 'user',
          name: member?.name || user?.displayName || 'Admin',
        }
      );

      await refreshOrganization();
      if (onRefresh) {
        onRefresh();
      }

      setSuccessMessage('Workspace settings updated successfully.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error('Failed to save workspace settings:', err);
      setErrorMessage(err?.message || 'Failed to save workspace settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="workspace-settings-page" className="p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 w-full max-w-full box-border">
      {/* Top Breadcrumb / Back Action */}
      {onNavigateBack && (
        <div>
          <button
            id="settings-back-btn"
            type="button"
            onClick={onNavigateBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors min-h-[36px] px-2 py-1 -ml-2 rounded"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Role: <strong className="text-slate-700">{effectiveRole}</strong>
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Workspace Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your company profile, monetary currency, operational timezone, and core deal inactivity rules.
          </p>
        </div>

        {/* Read-only notice for non-admin personas */}
        {!isOwnerAdmin && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs self-start sm:self-auto">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>View-Only Mode (Owner/Admin required to edit)</span>
          </div>
        )}
      </div>

      {/* Status Notifications */}
      {successMessage && (
        <div
          id="settings-success-banner"
          className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-150"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          id="settings-error-banner"
          className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-150"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Workspace & Company Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-slate-600" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Workspace & Company Information
              </h2>
              <p className="text-[11px] text-slate-500">
                Core identity details for this CoreDesk CRM tenant.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 text-xs">
            <div>
              <label htmlFor="workspace-name-input" className="block font-semibold text-slate-700 mb-1.5">
                Workspace / Organization Name *
              </label>
              <input
                id="workspace-name-input"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={!isOwnerAdmin || saving}
                required
                placeholder="e.g. Acme Sales Group"
                className="w-full sm:max-w-md p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Displayed in the global header, invitation emails, and exported reports.
              </span>
            </div>

            {/* Read-only metadata grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  <Hash className="w-3 h-3 text-slate-400" />
                  <span>Workspace ID</span>
                </div>
                <div className="font-mono text-[11px] text-slate-800 truncate" title={organization?.id}>
                  {organization?.id || '—'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>CRM Edition</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-800">
                  Small Teams Edition
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Created Date</span>
                </div>
                <div className="text-[11px] text-slate-800">
                  {organization?.createdAt ? formatDateTime(organization.createdAt) : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Regional & Financial Localization */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-slate-600" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Localization & Currency
              </h2>
              <p className="text-[11px] text-slate-500">
                Formatting parameters for deal monetary figures and scheduling timestamps.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="workspace-currency-select" className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Default Currency</span>
              </label>
              <select
                id="workspace-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={!isOwnerAdmin || saving}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="CAD">CAD ($) — Canadian Dollar</option>
                <option value="AUD">AUD ($) — Australian Dollar</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                All deal values, pipelines, and revenue aggregations default to this currency.
              </span>
            </div>

            <div>
              <label htmlFor="workspace-timezone-select" className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Operational Timezone</span>
              </label>
              <select
                id="workspace-timezone-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={!isOwnerAdmin || saving}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="America/New_York">America/New_York (Eastern Time)</option>
                <option value="America/Chicago">America/Chicago (Central Time)</option>
                <option value="America/Denver">America/Denver (Mountain Time)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (Pacific Time)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standardizes follow-up due dates and daily activity groupings.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Basic Workspace Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-slate-600" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Basic Workspace Preferences
              </h2>
              <p className="text-[11px] text-slate-500">
                Action-first automation rules and attention thresholds.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 text-xs">
            <div>
              <label htmlFor="workspace-stale-days-input" className="block font-semibold text-slate-700 mb-1.5">
                Stale Deal Threshold (Days of Inactivity)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="workspace-stale-days-input"
                  type="number"
                  min={1}
                  max={90}
                  value={staleDays}
                  onChange={(e) => setStaleDays(Number(e.target.value))}
                  disabled={!isOwnerAdmin || saving}
                  className="w-28 p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 disabled:bg-slate-50 disabled:text-slate-500"
                />
                <span className="text-xs text-slate-600 font-medium">days</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block leading-relaxed">
                Active deals in the pipeline with no logged activities (calls, emails, notes) or stage movement for ≥ <strong>{staleDays}</strong> days will automatically trigger visual stale alerts in the Action Center and Pipeline Board.
              </span>
            </div>
          </div>
        </div>

        {/* Form Submission Controls */}
        {isOwnerAdmin && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="save-workspace-settings-btn"
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Parameters...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Workspace Settings</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
