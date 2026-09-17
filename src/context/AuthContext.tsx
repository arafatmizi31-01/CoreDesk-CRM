import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { Organization, Member, UserRole } from '../types/crm';
import {
  findUserOrganization,
  createOrganizationWithAdmin,
  GUEST_USER_UID,
  initGuestWorkspaceStore,
  getGuestStore,
} from '../services/crmService';

const GUEST_AUTH_USER = {
  uid: GUEST_USER_UID,
  email: 'alex.morgan@nexusgrowth.demo',
  displayName: 'Alex Morgan (Guest Admin)',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  photoURL: null,
  providerId: 'demo',
} as unknown as User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  organization: Organization | null;
  member: Member | null;
  effectiveRole: UserRole;
  setEffectiveRole: (role: UserRole) => void;
  needsSetupGate: boolean;
  signInWithGoogle: () => Promise<void>;
  signInQuickDemo: (name?: string, email?: string) => Promise<void>;
  logOut: () => Promise<void>;
  completeSetupGate: (params: {
    adminName: string;
    adminEmail: string;
    orgName: string;
    currency: string;
    timezone: string;
    loadDemoData: boolean;
  }) => Promise<void>;
  refreshOrganization: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [effectiveRole, setEffectiveRole] = useState<UserRole>('Owner/Admin');
  const [needsSetupGate, setNeedsSetupGate] = useState(false);

  // Sync Firebase Auth or Guest Session
  useEffect(() => {
    const isGuestActive = sessionStorage.getItem('coredesk_guest_active') === 'true';
    if (isGuestActive) {
      initGuestWorkspaceStore();
      const store = getGuestStore();
      setUser(GUEST_AUTH_USER);
      setOrganization(store.organization);
      const mem = store.members.find((m) => m.uid === GUEST_USER_UID) || store.members[0];
      setMember(mem);
      setEffectiveRole(mem.role);
      setNeedsSetupGate(false);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserOrg(currentUser.uid);
      } else {
        setOrganization(null);
        setMember(null);
        setNeedsSetupGate(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserOrg = async (uid: string) => {
    try {
      const result = await findUserOrganization(uid);
      if (result) {
        setOrganization(result.org);
        setMember(result.member);
        setEffectiveRole(result.member.role);
        setNeedsSetupGate(false);
      } else {
        // No organization found for this user => trigger Admin Setup Gate
        setOrganization(null);
        setMember(null);
        setNeedsSetupGate(true);
      }
    } catch (err) {
      console.error('Failed to load user organization:', err);
      setNeedsSetupGate(true);
    }
  };

  const refreshOrganization = async () => {
    if (user) {
      await loadUserOrg(user.uid);
    }
  };

  const handleSignInGoogle = async () => {
    try {
      setLoading(true);
      sessionStorage.removeItem('coredesk_guest_active');
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        await loadUserOrg(cred.user.uid);
      }
    } catch (err) {
      console.warn('Google Sign-In popup interrupted or blocked in preview iframe. Falling back to quick guest preview...', err);
      await handleSignInQuickDemo();
    } finally {
      setLoading(false);
    }
  };

  const handleSignInQuickDemo = async () => {
    try {
      setLoading(true);
      sessionStorage.setItem('coredesk_guest_active', 'true');
      initGuestWorkspaceStore();
      const store = getGuestStore();
      setUser(GUEST_AUTH_USER);
      setOrganization(store.organization);
      const mem = store.members.find((m) => m.uid === GUEST_USER_UID) || store.members[0];
      setMember(mem);
      setEffectiveRole(mem.role);
      setNeedsSetupGate(false);
    } catch (err) {
      console.error('Quick demo sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    sessionStorage.removeItem('coredesk_guest_active');
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    setOrganization(null);
    setMember(null);
    setNeedsSetupGate(false);
  };

  const completeSetupGate = async (params: {
    adminName: string;
    adminEmail: string;
    orgName: string;
    currency: string;
    timezone: string;
    loadDemoData: boolean;
  }) => {
    if (!user) throw new Error('User not authenticated');
    setLoading(true);
    try {
      const { organization: newOrg, member: newMember } = await createOrganizationWithAdmin({
        adminUid: user.uid,
        adminName: params.adminName,
        adminEmail: params.adminEmail || user.email || 'admin@example.com',
        orgName: params.orgName,
        currency: params.currency,
        timezone: params.timezone,
        loadDemoData: params.loadDemoData,
      });

      setOrganization(newOrg);
      setMember(newMember);
      setEffectiveRole(newMember.role);
      setNeedsSetupGate(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        organization,
        member,
        effectiveRole,
        setEffectiveRole,
        needsSetupGate,
        signInWithGoogle: handleSignInGoogle,
        signInQuickDemo: handleSignInQuickDemo,
        logOut: handleLogOut,
        completeSetupGate,
        refreshOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
