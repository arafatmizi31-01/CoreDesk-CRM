import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Organization,
  Member,
  Lead,
  Contact,
  Company,
  Deal,
  Task,
  Activity,
  AuditLog,
  Notification,
  UserRole,
} from '../types/crm';
import { generateSampleCRMData } from './sampleData';

// --- GUEST WORKSPACE STORE (Instant Evaluation Preview) ---
export const GUEST_ORG_ID = 'guest_demo_org';
export const GUEST_USER_UID = 'guest_demo_user';

export function isGuestOrg(orgId: string): boolean {
  return orgId === GUEST_ORG_ID;
}

interface GuestStore {
  organization: Organization;
  members: Member[];
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  leads: Lead[];
  tasks: Task[];
  activities: Activity[];
  auditLogs: AuditLog[];
}

let guestStore: GuestStore | null = null;

export function initGuestWorkspaceStore(): GuestStore {
  const now = new Date().toISOString();
  const guestOrg: Organization = {
    id: GUEST_ORG_ID,
    name: 'CoreDesk Demo Workspace',
    ownerUid: GUEST_USER_UID,
    currency: 'USD',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    staleDealDays: 7,
    createdAt: now,
    updatedAt: now,
  };

  const adminMember: Member = {
    uid: GUEST_USER_UID,
    organizationId: GUEST_ORG_ID,
    name: 'Guest Sales Lead',
    email: 'guest@coredesk.demo',
    role: 'Owner/Admin',
    status: 'Active',
    joinedAt: now,
  };

  const repMember: Member = {
    uid: 'rep_marcus',
    organizationId: GUEST_ORG_ID,
    name: 'Marcus Brody',
    email: 'm.brody@example.com',
    role: 'Sales Rep',
    status: 'Active',
    joinedAt: now,
  };

  const managerMember: Member = {
    uid: 'mgr_diana',
    organizationId: GUEST_ORG_ID,
    name: 'Diana Prince',
    email: 'd.prince@example.com',
    role: 'Manager',
    status: 'Active',
    joinedAt: now,
  };

  const members = [adminMember, repMember, managerMember];
  const sample = generateSampleCRMData(GUEST_ORG_ID, members);

  const initialLogs: AuditLog[] = [
    {
      id: `audit_init_1`,
      organizationId: GUEST_ORG_ID,
      actorId: GUEST_USER_UID,
      actorName: 'Guest Sales Lead',
      entityType: 'Organization',
      entityId: GUEST_ORG_ID,
      action: 'BOOTSTRAP_DEMO_WORKSPACE',
      after: 'Fictional sample B2B CRM dataset initialized for evaluation',
      createdAt: now,
    },
  ];

  guestStore = {
    organization: guestOrg,
    members,
    companies: [...sample.companies],
    contacts: [...sample.contacts],
    deals: [...sample.deals],
    leads: [...sample.leads],
    tasks: [...sample.tasks],
    activities: [...sample.activities],
    auditLogs: initialLogs,
  };

  return guestStore;
}

export function getGuestStore(): GuestStore {
  if (!guestStore) {
    return initGuestWorkspaceStore();
  }
  return guestStore;
}

export function getGuestOrganizationAndMember(): { org: Organization; member: Member } {
  const store = getGuestStore();
  const adminMember = store.members.find((m) => m.uid === GUEST_USER_UID) || store.members[0];
  return {
    org: store.organization,
    member: adminMember,
  };
}

// --- ORGANIZATIONS & MEMBERSHIP ---

export async function getOrganization(orgId: string): Promise<Organization | null> {
  if (isGuestOrg(orgId)) {
    return getGuestStore().organization;
  }
  try {
    const snap = await getDoc(doc(db, 'organizations', orgId));
    if (snap.exists()) {
      return snap.data() as Organization;
    }
    return null;
  } catch (err) {
    console.error('Error fetching organization:', err);
    return null;
  }
}

export async function createOrganizationWithAdmin(params: {
  orgName: string;
  adminUid: string;
  adminName: string;
  adminEmail: string;
  currency: string;
  timezone: string;
  loadDemoData?: boolean;
}): Promise<{ organization: Organization; member: Member }> {
  const orgId = `org_${Date.now()}`;
  const now = new Date().toISOString();

  const orgData: Organization = {
    id: orgId,
    name: params.orgName.trim() || 'Acme Sales',
    ownerUid: params.adminUid,
    currency: params.currency || 'USD',
    timezone: params.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    staleDealDays: 7,
    createdAt: now,
    updatedAt: now,
  };

  const adminMember: Member = {
    uid: params.adminUid,
    organizationId: orgId,
    name: params.adminName.trim() || 'Admin Owner',
    email: params.adminEmail.trim(),
    role: 'Owner/Admin',
    joinedAt: now,
  };

  const batch = writeBatch(db);
  batch.set(doc(db, 'organizations', orgId), orgData);
  batch.set(doc(db, 'organizations', orgId, 'members', params.adminUid), adminMember);

  // If loading demo data, also add 2 fictional colleagues to demonstrate multi-role assignments
  const repMember: Member = {
    uid: 'rep_marcus',
    organizationId: orgId,
    name: 'Marcus Brody',
    email: 'm.brody@example.com',
    role: 'Sales Rep',
    joinedAt: now,
  };
  const managerMember: Member = {
    uid: 'mgr_diana',
    organizationId: orgId,
    name: 'Diana Prince',
    email: 'd.prince@example.com',
    role: 'Manager',
    joinedAt: now,
  };
  batch.set(doc(db, 'organizations', orgId, 'members', repMember.uid), repMember);
  batch.set(doc(db, 'organizations', orgId, 'members', managerMember.uid), managerMember);

  if (params.loadDemoData) {
    const demo = generateSampleCRMData(orgId, [adminMember, repMember, managerMember]);
    for (const c of demo.companies) {
      batch.set(doc(db, 'organizations', orgId, 'companies', c.id), c);
    }
    for (const ct of demo.contacts) {
      batch.set(doc(db, 'organizations', orgId, 'contacts', ct.id), ct);
    }
    for (const d of demo.deals) {
      batch.set(doc(db, 'organizations', orgId, 'deals', d.id), d);
    }
    for (const l of demo.leads) {
      batch.set(doc(db, 'organizations', orgId, 'leads', l.id), l);
    }
    for (const t of demo.tasks) {
      batch.set(doc(db, 'organizations', orgId, 'tasks', t.id), t);
    }
    for (const a of demo.activities) {
      batch.set(doc(db, 'organizations', orgId, 'activities', a.id), a);
    }
  }

  // Record audit log for organization creation
  const auditId = `audit_${Date.now()}`;
  const auditLog: AuditLog = {
    id: auditId,
    organizationId: orgId,
    actorId: params.adminUid,
    actorName: adminMember.name,
    entityType: 'Organization',
    entityId: orgId,
    action: 'CREATE_ORGANIZATION',
    after: `Workspace created: ${orgData.name}`,
    createdAt: now,
  };
  batch.set(doc(db, 'organizations', orgId, 'auditLogs', auditId), auditLog);

  await batch.commit();
  return { organization: orgData, member: adminMember };
}

export async function findUserOrganization(userUid: string): Promise<{ org: Organization; member: Member } | null> {
  if (userUid === GUEST_USER_UID) {
    return getGuestOrganizationAndMember();
  }
  try {
    // For small business MVP, search organization membership
    const orgsRef = collection(db, 'organizations');
    const orgsSnap = await getDocs(query(orgsRef, limit(20)));
    for (const orgDoc of orgsSnap.docs) {
      const memberDoc = await getDoc(doc(db, 'organizations', orgDoc.id, 'members', userUid));
      if (memberDoc.exists()) {
        return {
          org: orgDoc.data() as Organization,
          member: memberDoc.data() as Member,
        };
      }
      // Check if user is ownerUid
      const data = orgDoc.data() as Organization;
      if (data.ownerUid === userUid) {
        return {
          org: data,
          member: {
            uid: userUid,
            organizationId: data.id,
            name: 'Workspace Owner',
            email: '',
            role: 'Owner/Admin',
            joinedAt: data.createdAt,
          },
        };
      }
    }
    return null;
  } catch (err) {
    console.error('Error finding user organization:', err);
    return null;
  }
}

// --- AUDIT LOGGING ---

const guestListeners = new Set<() => void>();
export function notifyGuestListeners() {
  guestListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Guest listener error:', e);
    }
  });
}

export async function logAuditEvent(params: {
  orgId: string;
  actorId: string;
  actorName?: string;
  entityType: string;
  entityId: string;
  action: string;
  before?: string;
  after?: string;
}) {
  try {
    const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const log: AuditLog = {
      id: logId,
      organizationId: params.orgId,
      actorId: params.actorId,
      actorName: params.actorName || 'User',
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      before: params.before,
      after: params.after,
      createdAt: new Date().toISOString(),
    };

    if (isGuestOrg(params.orgId)) {
      const store = getGuestStore();
      store.auditLogs.unshift(log);
      notifyGuestListeners();
      return;
    }

    await setDoc(doc(db, 'organizations', params.orgId, 'auditLogs', logId), log);
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

// --- LEADS ---

export function subscribeToLeads(orgId: string, callback: (leads: Lead[]) => void) {
  if (isGuestOrg(orgId)) {
    const handler = () => {
      const list = [...getGuestStore().leads].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(list);
    };
    handler();
    guestListeners.add(handler);
    return () => {
      guestListeners.delete(handler);
    };
  }

  const leadsRef = collection(db, 'organizations', orgId, 'leads');
  return onSnapshot(leadsRef, (snap) => {
    const list: Lead[] = [];
    snap.forEach((d) => list.push(d.data() as Lead));
    callback(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });
}

export async function saveLead(orgId: string, lead: Lead, actor: { id: string; name: string }) {
  const isNew = !lead.id;
  const id = lead.id || `lead_${Date.now()}`;
  const now = new Date().toISOString();
  const data: Lead = {
    ...lead,
    id,
    organizationId: orgId,
    createdAt: lead.createdAt || now,
    updatedAt: now,
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const idx = store.leads.findIndex((l) => l.id === id);
    if (idx >= 0) {
      store.leads[idx] = data;
    } else {
      store.leads.unshift(data);
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Lead',
      entityId: id,
      action: isNew ? 'CREATE_LEAD' : 'UPDATE_LEAD',
      after: `Lead ${data.name} saved (${data.status})`,
    });
    return data;
  }

  await setDoc(doc(db, 'organizations', orgId, 'leads', id), data);

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Lead',
    entityId: id,
    action: isNew ? 'CREATE_LEAD' : 'UPDATE_LEAD',
    after: `Lead ${data.name} saved (${data.status})`,
  });

  return data;
}

export async function deleteLead(orgId: string, leadId: string, actor: { id: string; name: string }) {
  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    store.leads = store.leads.filter((l) => l.id !== leadId);
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Lead',
      entityId: leadId,
      action: 'DELETE_LEAD',
    });
    return;
  }

  await deleteDoc(doc(db, 'organizations', orgId, 'leads', leadId));
  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Lead',
    entityId: leadId,
    action: 'DELETE_LEAD',
  });
}

// --- DETERMINISTIC LEAD CONVERSION (Section 19) ---

export interface LeadConversionParams {
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  companyMode: 'create_new' | 'link_existing' | 'none';
  existingCompanyId?: string;
  newCompanyName?: string;
  contactMode: 'create_new' | 'link_existing';
  existingContactId?: string;
  createDeal: boolean;
  dealTitle?: string;
  dealValue?: number;
  dealStageId?: string;
  ownerId: string;
  ownerName: string;
}

export async function convertLead(
  orgId: string,
  params: LeadConversionParams,
  actor: { id: string; name: string }
): Promise<{ contactId: string; companyId?: string; dealId?: string }> {
  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const now = new Date().toISOString();
    let resolvedCompanyId = params.existingCompanyId;
    let resolvedCompanyName = '';

    if (params.companyMode === 'create_new' && params.newCompanyName?.trim()) {
      resolvedCompanyId = `comp_${Date.now()}`;
      resolvedCompanyName = params.newCompanyName.trim();
      const newCompany: Company = {
        id: resolvedCompanyId,
        organizationId: orgId,
        name: resolvedCompanyName,
        ownerId: params.ownerId,
        ownerName: params.ownerName,
        phone: params.leadPhone,
        email: params.leadEmail,
        createdAt: now,
        updatedAt: now,
      };
      store.companies.unshift(newCompany);
    }

    let resolvedContactId = params.existingContactId;
    if (params.contactMode === 'create_new' || !resolvedContactId) {
      resolvedContactId = `cont_${Date.now()}`;
      const newContact: Contact = {
        id: resolvedContactId,
        organizationId: orgId,
        name: params.leadName,
        email: params.leadEmail,
        phone: params.leadPhone,
        companyId: resolvedCompanyId || '',
        companyName: resolvedCompanyName || '',
        ownerId: params.ownerId,
        ownerName: params.ownerName,
        source: 'Lead Conversion',
        tags: ['Converted Lead'],
        createdAt: now,
        updatedAt: now,
      };
      store.contacts.unshift(newContact);
    }

    let createdDealId: string | undefined;
    if (params.createDeal && params.dealTitle?.trim()) {
      createdDealId = `deal_${Date.now()}`;
      const newDeal: Deal = {
        id: createdDealId,
        organizationId: orgId,
        title: params.dealTitle.trim(),
        companyId: resolvedCompanyId || '',
        companyName: resolvedCompanyName || '',
        contactId: resolvedContactId,
        contactName: params.leadName,
        ownerId: params.ownerId,
        ownerName: params.ownerName,
        pipelineId: 'default',
        stageId: params.dealStageId || 'new',
        value: Number(params.dealValue) || 0,
        probability: 20,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Open',
        priority: 'Medium',
        lastActivityAt: now,
        nextAction: 'Initial discovery meeting following lead conversion',
        nextActionAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: now,
        updatedAt: now,
      };
      store.deals.unshift(newDeal);
    }

    const targetLead = store.leads.find((l) => l.id === params.leadId);
    if (targetLead) {
      targetLead.status = 'Converted';
      targetLead.updatedAt = now;
    }

    notifyGuestListeners();

    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Lead',
      entityId: params.leadId,
      action: 'CONVERT_LEAD',
      after: `Lead converted to Contact (${resolvedContactId})${
        resolvedCompanyId ? `, Company (${resolvedCompanyId})` : ''
      }${createdDealId ? `, Deal (${createdDealId})` : ''}`,
    });

    return {
      contactId: resolvedContactId,
      companyId: resolvedCompanyId,
      dealId: createdDealId,
    };
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  let resolvedCompanyId = params.existingCompanyId;
  let resolvedCompanyName = '';

  // 1. Handle Company
  if (params.companyMode === 'create_new' && params.newCompanyName?.trim()) {
    resolvedCompanyId = `comp_${Date.now()}`;
    resolvedCompanyName = params.newCompanyName.trim();
    const newCompany: Company = {
      id: resolvedCompanyId,
      organizationId: orgId,
      name: resolvedCompanyName,
      ownerId: params.ownerId,
      ownerName: params.ownerName,
      phone: params.leadPhone,
      email: params.leadEmail,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(doc(db, 'organizations', orgId, 'companies', resolvedCompanyId), newCompany);
  }

  // 2. Handle Contact
  let resolvedContactId = params.existingContactId;
  if (params.contactMode === 'create_new' || !resolvedContactId) {
    resolvedContactId = `cont_${Date.now()}`;
    const newContact: Contact = {
      id: resolvedContactId,
      organizationId: orgId,
      name: params.leadName,
      email: params.leadEmail,
      phone: params.leadPhone,
      companyId: resolvedCompanyId || '',
      companyName: resolvedCompanyName || '',
      ownerId: params.ownerId,
      ownerName: params.ownerName,
      source: 'Lead Conversion',
      tags: ['Converted Lead'],
      createdAt: now,
      updatedAt: now,
    };
    batch.set(doc(db, 'organizations', orgId, 'contacts', resolvedContactId), newContact);
  }

  // 3. Optional Deal
  let createdDealId: string | undefined;
  if (params.createDeal && params.dealTitle?.trim()) {
    createdDealId = `deal_${Date.now()}`;
    const newDeal: Deal = {
      id: createdDealId,
      organizationId: orgId,
      title: params.dealTitle.trim(),
      companyId: resolvedCompanyId || '',
      companyName: resolvedCompanyName || '',
      contactId: resolvedContactId,
      contactName: params.leadName,
      ownerId: params.ownerId,
      ownerName: params.ownerName,
      pipelineId: 'default',
      stageId: params.dealStageId || 'new',
      value: Number(params.dealValue) || 0,
      probability: 20,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Open',
      priority: 'Medium',
      lastActivityAt: now,
      nextAction: 'Initial discovery meeting following lead conversion',
      nextActionAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
    };
    batch.set(doc(db, 'organizations', orgId, 'deals', createdDealId), newDeal);
  }

  // 4. Update Lead status to 'Converted'
  const leadRef = doc(db, 'organizations', orgId, 'leads', params.leadId);
  batch.update(leadRef, {
    status: 'Converted',
    updatedAt: now,
  });

  // 5. Audit Log
  const auditId = `audit_${Date.now()}`;
  batch.set(doc(db, 'organizations', orgId, 'auditLogs', auditId), {
    id: auditId,
    organizationId: orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Lead',
    entityId: params.leadId,
    action: 'CONVERT_LEAD',
    after: `Lead converted to Contact (${resolvedContactId})${
      resolvedCompanyId ? `, Company (${resolvedCompanyId})` : ''
    }${createdDealId ? `, Deal (${createdDealId})` : ''}`,
    createdAt: now,
  });

  await batch.commit();

  return {
    contactId: resolvedContactId,
    companyId: resolvedCompanyId,
    dealId: createdDealId,
  };
}

// --- CONTACTS ---

export function subscribeToContacts(orgId: string, callback: (contacts: Contact[]) => void) {
  if (isGuestOrg(orgId)) {
    const handler = () => {
      const list = [...getGuestStore().contacts].sort((a, b) => a.name.localeCompare(b.name));
      callback(list);
    };
    handler();
    guestListeners.add(handler);
    return () => {
      guestListeners.delete(handler);
    };
  }

  const contactsRef = collection(db, 'organizations', orgId, 'contacts');
  return onSnapshot(contactsRef, (snap) => {
    const list: Contact[] = [];
    snap.forEach((d) => list.push(d.data() as Contact));
    callback(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });
}

export async function saveContact(orgId: string, contact: Contact, actor: { id: string; name: string }) {
  const isNew = !contact.id;
  const id = contact.id || `cont_${Date.now()}`;
  const now = new Date().toISOString();
  const data: Contact = {
    ...contact,
    id,
    organizationId: orgId,
    createdAt: contact.createdAt || now,
    updatedAt: now,
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const idx = store.contacts.findIndex((c) => c.id === id);
    if (idx >= 0) {
      store.contacts[idx] = data;
    } else {
      store.contacts.unshift(data);
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Contact',
      entityId: id,
      action: isNew ? 'CREATE_CONTACT' : 'UPDATE_CONTACT',
      after: `Contact ${data.name} saved`,
    });
    return data;
  }

  await setDoc(doc(db, 'organizations', orgId, 'contacts', id), data);

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Contact',
    entityId: id,
    action: isNew ? 'CREATE_CONTACT' : 'UPDATE_CONTACT',
    after: `Contact ${data.name} saved`,
  });

  return data;
}

export async function deleteContact(orgId: string, contactId: string, actor: { id: string; name: string }) {
  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    store.contacts = store.contacts.filter((c) => c.id !== contactId);
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Contact',
      entityId: contactId,
      action: 'DELETE_CONTACT',
    });
    return;
  }

  await deleteDoc(doc(db, 'organizations', orgId, 'contacts', contactId));
  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Contact',
    entityId: contactId,
    action: 'DELETE_CONTACT',
  });
}

// --- COMPANIES ---

export function subscribeToCompanies(orgId: string, callback: (companies: Company[]) => void) {
  if (isGuestOrg(orgId)) {
    const handler = () => {
      const list = [...getGuestStore().companies].sort((a, b) => a.name.localeCompare(b.name));
      callback(list);
    };
    handler();
    guestListeners.add(handler);
    return () => {
      guestListeners.delete(handler);
    };
  }

  const compRef = collection(db, 'organizations', orgId, 'companies');
  return onSnapshot(compRef, (snap) => {
    const list: Company[] = [];
    snap.forEach((d) => list.push(d.data() as Company));
    callback(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });
}

export async function saveCompany(orgId: string, company: Company, actor: { id: string; name: string }) {
  const isNew = !company.id;
  const id = company.id || `comp_${Date.now()}`;
  const now = new Date().toISOString();
  const data: Company = {
    ...company,
    id,
    organizationId: orgId,
    createdAt: company.createdAt || now,
    updatedAt: now,
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const idx = store.companies.findIndex((c) => c.id === id);
    if (idx >= 0) {
      store.companies[idx] = data;
    } else {
      store.companies.unshift(data);
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Company',
      entityId: id,
      action: isNew ? 'CREATE_COMPANY' : 'UPDATE_COMPANY',
      after: `Company ${data.name} saved`,
    });
    return data;
  }

  await setDoc(doc(db, 'organizations', orgId, 'companies', id), data);

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Company',
    entityId: id,
    action: isNew ? 'CREATE_COMPANY' : 'UPDATE_COMPANY',
    after: `Company ${data.name} saved`,
  });

  return data;
}

export async function deleteCompany(orgId: string, companyId: string, actor: { id: string; name: string }) {
  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    store.companies = store.companies.filter((c) => c.id !== companyId);
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Company',
      entityId: companyId,
      action: 'DELETE_COMPANY',
    });
    return;
  }

  await deleteDoc(doc(db, 'organizations', orgId, 'companies', companyId));
  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Company',
    entityId: companyId,
    action: 'DELETE_COMPANY',
  });
}

// --- DEALS & PIPELINE ---

export function subscribeToDeals(orgId: string, callback: (deals: Deal[]) => void) {
  if (isGuestOrg(orgId)) {
    const handler = () => {
      const list = [...getGuestStore().deals].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      callback(list);
    };
    handler();
    guestListeners.add(handler);
    return () => {
      guestListeners.delete(handler);
    };
  }

  const dealsRef = collection(db, 'organizations', orgId, 'deals');
  return onSnapshot(dealsRef, (snap) => {
    const list: Deal[] = [];
    snap.forEach((d) => list.push(d.data() as Deal));
    callback(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });
}

export async function saveDeal(orgId: string, deal: Deal, actor: { id: string; name: string }) {
  const isNew = !deal.id;
  const id = deal.id || `deal_${Date.now()}`;
  const now = new Date().toISOString();
  const data: Deal = {
    ...deal,
    id,
    organizationId: orgId,
    createdAt: deal.createdAt || now,
    updatedAt: now,
    lastActivityAt: deal.lastActivityAt || now,
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const idx = store.deals.findIndex((d) => d.id === id);
    if (idx >= 0) {
      store.deals[idx] = data;
    } else {
      store.deals.unshift(data);
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Deal',
      entityId: id,
      action: isNew ? 'CREATE_DEAL' : 'UPDATE_DEAL',
      after: `Deal "${data.title}" saved (${data.stageId}, ${data.status}, value: ${data.value})`,
    });
    return data;
  }

  await setDoc(doc(db, 'organizations', orgId, 'deals', id), data);

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Deal',
    entityId: id,
    action: isNew ? 'CREATE_DEAL' : 'UPDATE_DEAL',
    after: `Deal "${data.title}" saved (${data.stageId}, ${data.status}, value: ${data.value})`,
  });

  return data;
}

export async function updateDealStage(
  orgId: string,
  dealId: string,
  newStageId: string,
  actor: { id: string; name: string },
  additionalUpdates: Partial<Deal> = {}
) {
  const now = new Date().toISOString();
  let status: Deal['status'] = 'Open';
  if (newStageId === 'closed-won') status = 'Won';
  else if (newStageId === 'closed-lost') status = 'Lost';

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const target = store.deals.find((d) => d.id === dealId);
    if (target) {
      target.stageId = newStageId;
      target.status = status;
      target.updatedAt = now;
      target.lastActivityAt = now;
      Object.assign(target, additionalUpdates);
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Deal',
      entityId: dealId,
      action: 'MOVE_DEAL_STAGE',
      after: `Moved deal to stage ${newStageId} (status: ${status})`,
    });
    return;
  }

  const updates = {
    stageId: newStageId,
    status,
    updatedAt: now,
    lastActivityAt: now,
    ...additionalUpdates,
  };

  await updateDoc(doc(db, 'organizations', orgId, 'deals', dealId), updates);

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Deal',
    entityId: dealId,
    action: 'MOVE_DEAL_STAGE',
    after: `Moved deal to stage ${newStageId} (status: ${status})`,
  });
}

export async function deleteDeal(orgId: string, dealId: string, actor: { id: string; name: string }) {
  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    store.deals = store.deals.filter((d) => d.id !== dealId);
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Deal',
      entityId: dealId,
      action: 'DELETE_DEAL',
    });
    return;
  }

  await deleteDoc(doc(db, 'organizations', orgId, 'deals', dealId));
  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Deal',
    entityId: dealId,
    action: 'DELETE_DEAL',
  });
}

// --- TASKS ---

export function subscribeToTasks(orgId: string, callback: (tasks: Task[]) => void) {
  if (isGuestOrg(orgId)) {
    const handler = () => {
      const list = [...getGuestStore().tasks].sort(
        (a, b) => new Date(a.dueAt || 0).getTime() - new Date(b.dueAt || 0).getTime()
      );
      callback(list);
    };
    handler();
    guestListeners.add(handler);
    return () => {
      guestListeners.delete(handler);
    };
  }

  const tasksRef = collection(db, 'organizations', orgId, 'tasks');
  return onSnapshot(tasksRef, (snap) => {
    const list: Task[] = [];
    snap.forEach((d) => list.push(d.data() as Task));
    callback(list.sort((a, b) => new Date(a.dueAt || 0).getTime() - new Date(b.dueAt || 0).getTime()));
  });
}

export async function saveTask(orgId: string, task: Task, actor: { id: string; name: string }) {
  const isNew = !task.id;
  const id = task.id || `task_${Date.now()}`;
  const now = new Date().toISOString();
  const data: Task = {
    ...task,
    id,
    organizationId: orgId,
    createdAt: task.createdAt || now,
    completedAt: task.status === 'Completed' ? task.completedAt || now : undefined,
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const idx = store.tasks.findIndex((t) => t.id === id);
    if (idx >= 0) {
      store.tasks[idx] = data;
    } else {
      store.tasks.unshift(data);
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Task',
      entityId: id,
      action: isNew ? 'CREATE_TASK' : 'UPDATE_TASK',
      after: `Task "${data.title}" status: ${data.status}`,
    });
    return data;
  }

  await setDoc(doc(db, 'organizations', orgId, 'tasks', id), data);

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Task',
    entityId: id,
    action: isNew ? 'CREATE_TASK' : 'UPDATE_TASK',
    after: `Task "${data.title}" status: ${data.status}`,
  });

  return data;
}

export async function toggleTaskCompletion(
  orgId: string,
  taskId: string,
  completed: boolean,
  actor: { id: string; name: string }
) {
  const now = new Date().toISOString();

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const target = store.tasks.find((t) => t.id === taskId);
    if (target) {
      target.status = completed ? 'Completed' : 'Pending';
      target.completedAt = completed ? now : undefined;
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Task',
      entityId: taskId,
      action: completed ? 'COMPLETE_TASK' : 'REOPEN_TASK',
      after: completed ? `Task marked completed at ${now}` : 'Task reopened to Pending',
    });
    return;
  }

  await updateDoc(doc(db, 'organizations', orgId, 'tasks', taskId), {
    status: completed ? 'Completed' : 'Pending',
    completedAt: completed ? now : null,
  });

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Task',
    entityId: taskId,
    action: completed ? 'COMPLETE_TASK' : 'REOPEN_TASK',
    after: completed ? `Task marked completed at ${now}` : 'Task reopened to Pending',
  });
}

export async function completeTask(orgId: string, taskId: string, actor: { id: string; name: string }) {
  const now = new Date().toISOString();

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const target = store.tasks.find((t) => t.id === taskId);
    if (target) {
      target.status = 'Completed';
      target.completedAt = now;
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Task',
      entityId: taskId,
      action: 'COMPLETE_TASK',
      after: `Task completed at ${now}`,
    });
    return;
  }

  await updateDoc(doc(db, 'organizations', orgId, 'tasks', taskId), {
    status: 'Completed',
    completedAt: now,
  });

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Task',
    entityId: taskId,
    action: 'COMPLETE_TASK',
    after: `Task completed at ${now}`,
  });
}

export async function deleteTask(orgId: string, taskId: string, actor: { id: string; name: string }) {
  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    store.tasks = store.tasks.filter((t) => t.id !== taskId);
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Task',
      entityId: taskId,
      action: 'DELETE_TASK',
    });
    return;
  }

  await deleteDoc(doc(db, 'organizations', orgId, 'tasks', taskId));
  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Task',
    entityId: taskId,
    action: 'DELETE_TASK',
  });
}

// --- ACTIVITIES ---

export function subscribeToActivities(orgId: string, callback: (activities: Activity[]) => void) {
  if (isGuestOrg(orgId)) {
    const handler = () => {
      const list = [...getGuestStore().activities].sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
      );
      callback(list);
    };
    handler();
    guestListeners.add(handler);
    return () => {
      guestListeners.delete(handler);
    };
  }

  const actRef = collection(db, 'organizations', orgId, 'activities');
  return onSnapshot(actRef, (snap) => {
    const list: Activity[] = [];
    snap.forEach((d) => list.push(d.data() as Activity));
    callback(list.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()));
  });
}

export async function createActivity(
  orgId: string,
  activity: Activity,
  actor: { id: string; name: string }
) {
  const id = activity.id || `act_${Date.now()}`;
  const now = new Date().toISOString();
  const data: Activity = {
    ...activity,
    id,
    organizationId: orgId,
    actorId: actor.id,
    actorName: actor.name,
    createdAt: activity.createdAt || now,
    occurredAt: activity.occurredAt || now,
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    store.activities.unshift(data);

    if (data.relatedEntityType === 'deal' && data.relatedEntityId) {
      const targetDeal = store.deals.find((d) => d.id === data.relatedEntityId);
      if (targetDeal) {
        targetDeal.lastActivityAt = data.occurredAt;
        targetDeal.updatedAt = now;
      }
    } else if (data.relatedEntityType === 'lead' && data.relatedEntityId) {
      const targetLead = store.leads.find((l) => l.id === data.relatedEntityId);
      if (targetLead) {
        targetLead.lastContactedAt = data.occurredAt;
        targetLead.updatedAt = now;
      }
    } else if (data.relatedEntityType === 'contact' && data.relatedEntityId) {
      const targetContact = store.contacts.find((c) => c.id === data.relatedEntityId);
      if (targetContact) {
        targetContact.lastContactedAt = data.occurredAt;
        targetContact.updatedAt = now;
      }
    }

    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Activity',
      entityId: id,
      action: 'LOG_ACTIVITY',
      after: `${data.type}: ${data.subject}`,
    });
    return data;
  }

  await setDoc(doc(db, 'organizations', orgId, 'activities', id), data);

  // Section 24: Creating an activity updates relevant lastActivityAt on parent deal/lead/contact
  if (data.relatedEntityType === 'deal' && data.relatedEntityId) {
    await updateDoc(doc(db, 'organizations', orgId, 'deals', data.relatedEntityId), {
      lastActivityAt: data.occurredAt,
      updatedAt: now,
    }).catch(() => {});
  } else if (data.relatedEntityType === 'lead' && data.relatedEntityId) {
    await updateDoc(doc(db, 'organizations', orgId, 'leads', data.relatedEntityId), {
      lastContactedAt: data.occurredAt,
      updatedAt: now,
    }).catch(() => {});
  } else if (data.relatedEntityType === 'contact' && data.relatedEntityId) {
    await updateDoc(doc(db, 'organizations', orgId, 'contacts', data.relatedEntityId), {
      lastContactedAt: data.occurredAt,
      updatedAt: now,
    }).catch(() => {});
  }

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Activity',
    entityId: id,
    action: 'LOG_ACTIVITY',
    after: `${data.type}: ${data.subject}`,
  });

  return data;
}

// --- MEMBERS & ROLES (Admin area) ---

export function subscribeToMembers(orgId: string, callback: (members: Member[]) => void) {
  if (isGuestOrg(orgId)) {
    const handler = () => {
      const list = [...getGuestStore().members];
      callback(list);
    };
    handler();
    guestListeners.add(handler);
    return () => {
      guestListeners.delete(handler);
    };
  }

  const membersRef = collection(db, 'organizations', orgId, 'members');
  return onSnapshot(membersRef, (snap) => {
    const list: Member[] = [];
    snap.forEach((d) => list.push(d.data() as Member));
    callback(list);
  });
}

export async function updateMemberRole(
  orgId: string,
  memberUid: string,
  newRole: UserRole,
  actor: { id: string; name: string }
) {
  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const target = store.members.find((m) => m.uid === memberUid);
    if (target) {
      target.role = newRole;
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'UserRole',
      entityId: memberUid,
      action: 'CHANGE_USER_ROLE',
      after: `Role updated to ${newRole}`,
    });
    return;
  }

  await updateDoc(doc(db, 'organizations', orgId, 'members', memberUid), {
    role: newRole,
  });

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'UserRole',
    entityId: memberUid,
    action: 'CHANGE_USER_ROLE',
    after: `Role updated to ${newRole}`,
  });
}

export async function inviteMember(
  orgId: string,
  member: { name: string; email: string; role: UserRole },
  actor: { id: string; name: string }
) {
  const uid = `usr_${Date.now()}`;
  const newMember: Member = {
    uid,
    organizationId: orgId,
    name: member.name.trim(),
    email: member.email.trim(),
    role: member.role,
    joinedAt: new Date().toISOString(),
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    store.members.push(newMember);
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'User',
      entityId: uid,
      action: 'INVITE_MEMBER',
      after: `Invited ${member.name} (${member.email}) as ${member.role}`,
    });
    return newMember;
  }

  await setDoc(doc(db, 'organizations', orgId, 'members', uid), newMember);

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'User',
    entityId: uid,
    action: 'INVITE_MEMBER',
    after: `Invited ${member.name} (${member.email}) as ${member.role}`,
  });

  return newMember;
}

// --- AUDIT LOGS ---

export function subscribeToAuditLogs(orgId: string, callback: (logs: AuditLog[]) => void, maxCount = 50) {
  if (isGuestOrg(orgId)) {
    const handler = () => {
      const list = [...getGuestStore().auditLogs].slice(0, maxCount);
      callback(list);
    };
    handler();
    guestListeners.add(handler);
    return () => {
      guestListeners.delete(handler);
    };
  }

  const logsRef = collection(db, 'organizations', orgId, 'auditLogs');
  return onSnapshot(query(logsRef, limit(maxCount)), (snap) => {
    const list: AuditLog[] = [];
    snap.forEach((d) => list.push(d.data() as AuditLog));
    callback(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });
}

// --- UPDATE ORGANIZATION SETTINGS ---

export async function updateOrganizationSettings(
  orgId: string,
  settings: Partial<Organization>,
  actor: { id: string; name: string }
) {
  const updates = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    store.organization = {
      ...store.organization,
      ...updates,
    };
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Organization',
      entityId: orgId,
      action: 'UPDATE_SETTINGS',
      after: `Updated settings: ${Object.keys(settings).join(', ')}`,
    });
    return;
  }

  await updateDoc(doc(db, 'organizations', orgId), updates);

  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Organization',
    entityId: orgId,
    action: 'UPDATE_SETTINGS',
    after: `Updated settings: ${Object.keys(settings).join(', ')}`,
  });
}

export const updateWorkspaceSettings = updateOrganizationSettings;

export async function getDeals(orgId: string): Promise<Deal[]> {
  if (isGuestOrg(orgId)) {
    return [...getGuestStore().deals].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
  const snap = await getDocs(collection(db, 'organizations', orgId, 'deals'));
  const list: Deal[] = [];
  snap.forEach((d) => list.push(d.data() as Deal));
  return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function getLeads(orgId: string): Promise<Lead[]> {
  if (isGuestOrg(orgId)) {
    return [...getGuestStore().leads].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
  const snap = await getDocs(collection(db, 'organizations', orgId, 'leads'));
  const list: Lead[] = [];
  snap.forEach((d) => list.push(d.data() as Lead));
  return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function getContacts(orgId: string): Promise<Contact[]> {
  if (isGuestOrg(orgId)) {
    return [...getGuestStore().contacts].sort((a, b) => a.name.localeCompare(b.name));
  }
  const snap = await getDocs(collection(db, 'organizations', orgId, 'contacts'));
  const list: Contact[] = [];
  snap.forEach((d) => list.push(d.data() as Contact));
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCompanies(orgId: string): Promise<Company[]> {
  if (isGuestOrg(orgId)) {
    return [...getGuestStore().companies].sort((a, b) => a.name.localeCompare(b.name));
  }
  const snap = await getDocs(collection(db, 'organizations', orgId, 'companies'));
  const list: Company[] = [];
  snap.forEach((d) => list.push(d.data() as Company));
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTasks(orgId: string): Promise<Task[]> {
  if (isGuestOrg(orgId)) {
    return [...getGuestStore().tasks].sort(
      (a, b) => new Date(a.dueAt || 0).getTime() - new Date(b.dueAt || 0).getTime()
    );
  }
  const snap = await getDocs(collection(db, 'organizations', orgId, 'tasks'));
  const list: Task[] = [];
  snap.forEach((d) => list.push(d.data() as Task));
  return list.sort((a, b) => new Date(a.dueAt || 0).getTime() - new Date(b.dueAt || 0).getTime());
}

export async function getActivities(orgId: string): Promise<Activity[]> {
  if (isGuestOrg(orgId)) {
    return [...getGuestStore().activities].sort(
      (a, b) => new Date(b.occurredAt || 0).getTime() - new Date(a.occurredAt || 0).getTime()
    );
  }
  const snap = await getDocs(collection(db, 'organizations', orgId, 'activities'));
  const list: Activity[] = [];
  snap.forEach((d) => list.push(d.data() as Activity));
  return list.sort((a, b) => new Date(b.occurredAt || 0).getTime() - new Date(a.occurredAt || 0).getTime());
}

export async function getMembers(orgId: string): Promise<Member[]> {
  if (isGuestOrg(orgId)) {
    return [...getGuestStore().members];
  }
  const snap = await getDocs(collection(db, 'organizations', orgId, 'members'));
  const list: Member[] = [];
  snap.forEach((d) => list.push(d.data() as Member));
  return list;
}

export async function getAuditLogs(orgId: string, maxCount = 50): Promise<AuditLog[]> {
  if (isGuestOrg(orgId)) {
    return [...getGuestStore().auditLogs].slice(0, maxCount);
  }
  const snap = await getDocs(query(collection(db, 'organizations', orgId, 'auditLogs'), limit(maxCount)));
  const list: AuditLog[] = [];
  snap.forEach((d) => list.push(d.data() as AuditLog));
  return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function saveMember(orgId: string, member: Member, actor: { id: string; name: string }) {
  const uid = member.uid || `user_${Date.now()}`;
  const data: Member = {
    ...member,
    uid,
    organizationId: orgId,
    joinedAt: member.joinedAt || new Date().toISOString(),
  };

  if (isGuestOrg(orgId)) {
    const store = getGuestStore();
    const idx = store.members.findIndex((m) => m.uid === uid);
    if (idx >= 0) {
      store.members[idx] = data;
    } else {
      store.members.push(data);
    }
    notifyGuestListeners();
    await logAuditEvent({
      orgId,
      actorId: actor.id,
      actorName: actor.name,
      entityType: 'Member',
      entityId: uid,
      action: 'SAVE_MEMBER',
      after: `Member ${data.name} (${data.role}, ${data.status || 'Active'})`,
    });
    return data;
  }

  await setDoc(doc(db, 'organizations', orgId, 'members', uid), data);
  await logAuditEvent({
    orgId,
    actorId: actor.id,
    actorName: actor.name,
    entityType: 'Member',
    entityId: uid,
    action: 'SAVE_MEMBER',
    after: `Member ${data.name} (${data.role}, ${data.status || 'Active'})`,
  });
  return data;
}

export async function seedSampleCRMData(orgId: string, userId: string, userName: string) {
  if (isGuestOrg(orgId)) {
    initGuestWorkspaceStore();
    notifyGuestListeners();
    return;
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  const adminMember: Member = {
    uid: userId,
    organizationId: orgId,
    name: userName || 'Admin',
    email: 'admin@company.com',
    role: 'Owner/Admin',
    status: 'Active',
    joinedAt: now,
  };

  const repMember: Member = {
    uid: `rep_${Date.now()}`,
    organizationId: orgId,
    name: 'Sarah Connor',
    email: 'sarah@company.com',
    role: 'Sales Rep',
    status: 'Active',
    joinedAt: now,
  };

  const managerMember: Member = {
    uid: `mgr_${Date.now()}`,
    organizationId: orgId,
    name: 'David Brent',
    email: 'david@company.com',
    role: 'Manager',
    status: 'Active',
    joinedAt: now,
  };

  batch.set(doc(db, 'organizations', orgId, 'members', repMember.uid), repMember);
  batch.set(doc(db, 'organizations', orgId, 'members', managerMember.uid), managerMember);

  const demo = generateSampleCRMData(orgId, [adminMember, repMember, managerMember]);
  for (const c of demo.companies) {
    batch.set(doc(db, 'organizations', orgId, 'companies', c.id), c);
  }
  for (const ct of demo.contacts) {
    batch.set(doc(db, 'organizations', orgId, 'contacts', ct.id), ct);
  }
  for (const d of demo.deals) {
    batch.set(doc(db, 'organizations', orgId, 'deals', d.id), d);
  }
  for (const l of demo.leads) {
    batch.set(doc(db, 'organizations', orgId, 'leads', l.id), l);
  }
  for (const t of demo.tasks) {
    batch.set(doc(db, 'organizations', orgId, 'tasks', t.id), t);
  }
  for (const a of demo.activities) {
    batch.set(doc(db, 'organizations', orgId, 'activities', a.id), a);
  }

  await batch.commit();
}
