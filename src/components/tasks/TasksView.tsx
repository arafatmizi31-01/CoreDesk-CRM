import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  X,
  User,
} from 'lucide-react';
import { Task, Priority, TaskStatus } from '../../types/crm';
import { saveTask, toggleTaskCompletion, deleteTask } from '../../services/crmService';
import { formatDate, isTaskOverdue } from '../../utils/crmCalculations';
import { useAuth } from '../../context/AuthContext';

interface TasksViewProps {
  tasks: Task[];
  onRefresh: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, onRefresh }) => {
  const { organization, member, user, effectiveRole } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Overdue'>('Pending');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Task['type']>('Follow-up');
  const [dueAt, setDueAt] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [description, setDescription] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const overdue = isTaskOverdue(t);
      if (statusFilter === 'Pending' && t.status === 'Completed') return false;
      if (statusFilter === 'Completed' && t.status !== 'Completed') return false;
      if (statusFilter === 'Overdue' && !overdue) return false;

      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q) ||
          (t.relatedEntityName || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, searchTerm]);

  const openCreate = () => {
    setEditingTask(null);
    setTitle('');
    setType('Follow-up');
    setDueAt(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().substring(0, 16));
    setPriority('Medium');
    setStatus('Pending');
    setDescription('');
    setShowModal(true);
  };

  const openEdit = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setType(t.type);
    setDueAt(t.dueAt.substring(0, 16));
    setPriority(t.priority);
    setStatus(t.status);
    setDescription(t.description || '');
    setShowModal(true);
  };

  const handleToggle = async (task: Task) => {
    if (!organization) return;
    const newCompleted = task.status !== 'Completed';
    await toggleTaskCompletion(organization.id, task.id, newCompleted, {
      id: user?.uid || 'user',
      name: member?.name || 'User',
    });
    onRefresh();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !title.trim() || !dueAt) return;

    const taskData: Task = {
      id: editingTask?.id || '',
      organizationId: organization.id,
      title: title.trim(),
      type,
      dueAt: new Date(dueAt).toISOString(),
      priority,
      status,
      description: description.trim(),
      ownerId: editingTask?.ownerId || member?.uid || user?.uid || '',
      ownerName: editingTask?.ownerName || member?.name || 'Owner',
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveTask(organization.id, taskData, {
      id: user?.uid || 'user',
      name: member?.name || 'User',
    });

    setShowModal(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!organization) return;
    if (confirm('Delete this task?')) {
      await deleteTask(organization.id, id, {
        id: user?.uid || 'user',
        name: member?.name || 'User',
      });
      onRefresh();
    }
  };

  return (
    <div id="coredesk-tasks-view" className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full max-w-full box-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 w-full max-w-full box-border">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Task Execution Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational follow-ups, calls, preparation, and scheduled customer commitments.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 self-stretch sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Scheduled Task</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs w-full max-w-full box-border">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {(['Pending', 'Overdue', 'Completed', 'All'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors min-h-[36px] ${
                statusFilter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm min-w-[200px] w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tasks, descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white min-h-[40px]"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100 w-full max-w-full box-border">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No tasks found</div>
            <p className="text-xs text-slate-500 mt-1">All clear for this view filter.</p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';
            const overdue = isTaskOverdue(t);

            return (
              <div
                key={t.id}
                className={`p-3 sm:p-4 flex items-start justify-between gap-3 hover:bg-slate-50/70 transition-colors w-full max-w-full box-border ${
                  isCompleted ? 'opacity-60 bg-slate-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Complete Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggle(t)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-700 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center -ml-1"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700 text-[10px]">
                        {t.type}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {t.title}
                      </span>
                      {overdue && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Overdue
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          t.priority === 'High'
                            ? 'text-rose-700 bg-rose-50'
                            : t.priority === 'Medium'
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-slate-600 bg-slate-100'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    {t.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: <strong className={overdue ? 'text-rose-600' : 'text-slate-700'}>{formatDate(t.dueAt)}</strong>
                      </span>
                      {t.relatedEntityName && (
                        <span className="text-slate-600">Linked: <strong>{t.relatedEntityName}</strong></span>
                      )}
                      <span>Assignee: {t.ownerName || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(t)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Edit Task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {effectiveRole !== 'Sales Rep' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-4 sm:p-6 text-slate-800 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingTask ? 'Edit Task' : 'Create Scheduled Task'}
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
                <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Follow up on procurement review"
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Task Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Task['type'])}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white min-h-[38px]"
                  >
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="To-Do">To-Do</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white min-h-[38px]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date & Time *</label>
                <input
                  type="datetime-local"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg border border-slate-300 min-h-[38px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white min-h-[38px]"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details for this action..."
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
