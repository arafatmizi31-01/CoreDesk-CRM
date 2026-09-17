import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Sliders,
  History,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { Member, Organization, UserRole, AuditLog } from '../../types/crm';
import {
  saveMember,
  getAuditLogs,
  seedSampleCRMData,
} from '../../services/crmService';
import { formatDateTime, DEFAULT_PIPELINE_STAGES } from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';
import { WorkspaceSettingsView } from '../settings/WorkspaceSettingsView';

interface AdminViewProps {
  members: Member[];
  onRefresh: () => void;
  initialTab?: 'team' | 'pipeline' | 'audit' | 'settings';
}

export const AdminView: React.FC<AdminViewProps> = ({
  members,
  onRefresh,
  initialTab = 'team',
}) => {
  const { organization, member, user, effectiveRole } = useAuth();

  const isOwnerAdmin = effectiveRole === 'Owner/Admin';
  const isManager = effectiveRole === 'Manager';

  const [activeTab, setActiveTab] = useState<'team' | 'pipeline' | 'audit' | 'settings'>(initialTab);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');

  // Team Invite Form
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Sales Rep');
  const [seedingStatus, setSeedingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'audit' && organization) {
      loadAudit();
    }
  }, [activeTab, organization]);

  const loadAudit = async () => {
    if (!organization) return;
    try {
      setLoadingLogs(true);
      const logs = await getAuditLogs(organization.id, 50);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: Member = {
      id: '',
      organizationId: organization.id,
      uid: `user-${Date.now()}`,
      email: inviteEmail.trim(),
      name: inviteName.trim(),
      role: inviteRole,
      status: 'Active',
      joinedAt: new Date().toISOString(),
    };

    await saveMember(organization.id, newMember, {
      id: user?.uid || 'user',
      name: member?.name || 'User',
    });

    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    onRefresh();
  };

  const handleToggleMemberStatus = async (m: Member) => {
    if (!organization || !isOwnerAdmin) return;
    const newStatus = m.status === 'Active' ? 'Inactive' : 'Active';
    await saveMember(
      organization.id,
      { ...m, status: newStatus },
      { id: user?.uid || 'user', name: member?.name || 'User' }
    );
    onRefresh();
  };

  const handleSeedDemoData = async () => {
    if (!organization || !isOwnerAdmin) return;
    if (confirm('Load standard fictional CRM dataset (leads, deals, tasks, activities, team)?')) {
      setSeedingStatus('Populating sample dataset...');
      try {
        await seedSampleCRMData(organization.id, user?.uid || 'admin', member?.name || 'Admin');
        setSeedingStatus('Demo data populated successfully!');
        onRefresh();
        setTimeout(() => setSeedingStatus(null), 3000);
      } catch (err) {
        console.error('Seeding error:', err);
        setSeedingStatus('Failed to load dataset.');
      }
    }
  };

  // Enforce Section 36 & Gate 7: Do not expose privileged controls to Sales Reps
  if (effectiveRole === 'Sales Rep') {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1">
          CoreDesk Admin operations require Owner/Admin or Manager authorization.
          To test administrative workflows, switch your active persona in the user menu.
        </p>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter((l) => {
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    return (
      l.actionType.toLowerCase().includes(q) ||
      l.entityType.toLowerCase().includes(q) ||
      (l.entityName || '').toLowerCase().includes(q) ||
      (l.actorName || '').toLowerCase().includes(q)
    );
  });

  return (
    <div id="coredesk-admin-panel" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full max-w-full box-border">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Administrative Center
            </span>
            <span className="text-xs text-slate-500">Effective Role: {effectiveRole}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">CoreDesk Admin</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Team access controls, pipeline stage configurations, immutable audit trail, and workspace parameters.
          </p>
        </div>

        {isOwnerAdmin && (
          <button
            type="button"
            onClick={handleSeedDemoData}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto border border-slate-200 min-h-[40px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{seedingStatus || 'Load Fictional CRM Dataset'}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 text-xs font-semibold text-slate-600 overflow-x-auto w-full max-w-full">
        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[40px] ${
            activeTab === 'team'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team & Users ({members.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[40px] ${
            activeTab === 'pipeline'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Pipeline Stages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[40px] ${
            activeTab === 'audit'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log Trail</span>
        </button>

        {isOwnerAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[40px] ${
              activeTab === 'settings'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Workspace Settings</span>
          </button>
        )}
      </div>

      {/* TAB 1: TEAM & USERS */}
      {activeTab === 'team' && (
        <div className="space-y-4 w-full max-w-full box-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Manage team members, assign operational roles (Owner/Admin, Manager, Sales Rep), and enforce status.
            </p>
            {isOwnerAdmin && (
              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Team Member</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full max-w-full box-border">
            <div className="table-responsive-container w-full max-w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                    {isOwnerAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {members.map((m) => (
                    <tr key={m.id || m.uid} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{m.name}</td>
                      <td className="py-3 px-4 text-slate-500">{m.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            m.role === 'Owner/Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : m.role === 'Manager'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{formatDateTime(m.joinedAt)}</td>
                      {isOwnerAdmin && (
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleMemberStatus(m)}
                            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 min-h-[32px] px-2 py-1"
                          >
                            {m.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PIPELINE STAGES */}
      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4 text-xs w-full max-w-full box-border">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Standard Sales Pipeline Stages</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              CoreDesk enforces a disciplined 6-stage sales progression model with default win probabilities.
            </p>
          </div>

          <div className="space-y-2">
            {DEFAULT_PIPELINE_STAGES.map((st, idx) => (
              <div
                key={st.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{st.name}</span>
                    <span className="text-slate-500 ml-2 text-[11px]">ID: {st.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono font-bold text-slate-700">
                    Default Probability: {st.probabilityDefault}%
                  </span>
                  {st.isWon && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      WON OUTCOME
                    </span>
                  )}
                  {st.isLost && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                      LOST OUTCOME
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG TRAIL (Section 26) */}
      {activeTab === 'audit' && (
        <div className="space-y-4 w-full max-w-full box-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Immutable audit log recording data mutations, status transitions, and lead conversions.
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white min-h-[36px] w-full"
                />
              </div>
              <button
                type="button"
                onClick={loadAudit}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Refresh Logs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full max-w-full box-border">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No audit events recorded matching filter.
              </div>
            ) : (
              <div className="table-responsive-container w-full max-w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Entity Name / Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 text-slate-500">{formatDateTime(log.timestamp)}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">{log.actorName}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-1.5 py-0.5 rounded uppercase font-bold text-[10px] ${
                              log.actionType === 'create'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.actionType === 'delete'
                                ? 'bg-rose-100 text-rose-800'
                                : log.actionType === 'convert'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {log.actionType}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 uppercase font-semibold">{log.entityType}</td>
                        <td className="py-2.5 px-4 text-slate-900 font-sans">
                          <span>{log.entityName || log.entityId}</span>
                          {log.before && log.after && (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Transition: {JSON.stringify(log.before)} → {JSON.stringify(log.after)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: WORKSPACE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="pt-2 w-full max-w-full box-border">
          <WorkspaceSettingsView onRefresh={onRefresh} />
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-4 sm:p-6 text-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 mb-3">Add Team Member</h2>
            <form onSubmit={handleInviteMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  placeholder="e.g. Jordan Lee"
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="jordan@company.com"
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white min-h-[38px]"
                >
                  <option value="Sales Rep">Sales Rep (Standard access to records)</option>
                  <option value="Manager">Manager (Team visibility & reports)</option>
                  <option value="Owner/Admin">Owner/Admin (Full privileged control)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs min-h-[40px]"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
