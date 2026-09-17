export type UserRole = 'Owner/Admin' | 'Manager' | 'Sales Rep';

export interface Organization {
  id: string;
  name: string;
  ownerUid: string;
  currency: string;
  timezone: string;
  staleDealDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id?: string;
  uid: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  status?: 'Active' | 'Inactive';
  joinedAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Lead {
  id: string;
  organizationId: string;
  name: string;
  companyId?: string;
  companyName?: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  priority: Priority;
  ownerId: string;
  ownerName?: string;
  estimatedValue: number;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  companyId?: string;
  companyName?: string;
  title?: string;
  ownerId: string;
  ownerName?: string;
  source?: string;
  tags?: string[];
  notes?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  organizationId: string;
  name: string;
  domain?: string;
  industry?: string;
  website?: string;
  size?: string;
  ownerId: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DealStatus = 'Open' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  organizationId: string;
  title: string;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  ownerId: string;
  ownerName?: string;
  pipelineId?: string;
  stageId: string;
  stageName?: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  status: DealStatus;
  priority: Priority;
  lastActivityAt?: string;
  nextAction?: string;
  nextActionAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probabilityDefault: number;
  isWon?: boolean;
  isLost?: boolean;
  color?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Task {
  id: string;
  organizationId: string;
  title: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Follow-up' | 'To-Do' | string;
  description?: string;
  ownerId: string;
  ownerName?: string;
  dueAt: string;
  priority: Priority;
  status: TaskStatus;
  relatedEntityType?: 'lead' | 'contact' | 'deal' | 'company';
  relatedEntityId?: string;
  relatedEntityName?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'Follow-up' | 'Other';

export interface Activity {
  id: string;
  organizationId: string;
  type: ActivityType;
  subject: string;
  description?: string;
  actorId: string;
  actorName?: string;
  relatedEntityType?: 'lead' | 'contact' | 'deal' | 'company';
  relatedEntityId?: string;
  relatedEntityName?: string;
  occurredAt: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actorId: string;
  actorName?: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  action: string;
  actionType?: string;
  before?: string;
  after?: string;
  createdAt: string;
  timestamp?: string;
}

export interface DashboardKPIs {
  totalPipelineValue: number;
  openDealsCount: number;
  wonRevenue: number;
  winRate: number; // 0-100 or -1 if denominator 0
  overdueTasksCount: number;
  followUpsDueTodayCount: number;
  weightedPipelineValue: number;
}

export interface ActionCenterItems {
  overdueFollowUps: Array<{ id: string; type: 'lead' | 'deal' | 'contact'; title: string; dueAt: string; ownerName?: string }>;
  dealsWithoutNextStep: Deal[];
  staleDeals: Deal[];
  highValueDealsAtRisk: Deal[];
  newLeadsAwaitingAction: Lead[];
  dataQualityIssues: Array<{ id: string; entityType: string; name: string; issue: string }>;
}
