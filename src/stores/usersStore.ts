import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { AdminUser, UserDetail } from '../services/mockAdminApi/data';
import { useAdminStore } from './adminStore';

interface UsersState {
  users: AdminUser[];
  selectedUserId: string | null;
  userDetail: UserDetail | null;
  suspendModalOpen: boolean;
  loading: boolean;
  loadUsers: (filters?: { q?: string; statut?: string }) => Promise<void>;
  openUserDrawer: (id: string) => Promise<void>;
  closeUserDrawer: () => void;
  openSuspendModal: () => void;
  closeSuspendModal: () => void;
  suspendUser: (motif: string, duree: string) => Promise<void>;
  reactivateUser: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  selectedUserId: null,
  userDetail: null,
  suspendModalOpen: false,
  loading: false,

  loadUsers: async (filters) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const users = await adminService.getUsers(token, filters);
      set({ users, loading: false });
    } catch {
      set({ users: [], loading: false });
    }
  },

  openUserDrawer: async (id) => {
    set({ loading: true, selectedUserId: id, userDetail: null });
    try {
      const token = useAdminStore.getState().token;
      const userDetail = await adminService.getUserDetail(token, id);
      set({ userDetail, loading: false });
    } catch {
      set({ userDetail: null, loading: false });
    }
  },

  closeUserDrawer: () => set({ selectedUserId: null, userDetail: null, suspendModalOpen: false }),

  openSuspendModal: () => set({ suspendModalOpen: true }),

  closeSuspendModal: () => set({ suspendModalOpen: false }),

  suspendUser: async (motif, duree) => {
    const id = get().selectedUserId;
    if (!id) return;
    set({ loading: true });
    const token = useAdminStore.getState().token;
    await adminService.suspendUser(token, id, motif, duree);
    const userDetail = await adminService.getUserDetail(token, id);
    const users = await adminService.getUsers(token);
    set({ userDetail, users, loading: false, suspendModalOpen: false });
  },

  reactivateUser: async () => {
    const id = get().selectedUserId;
    if (!id) return;
    set({ loading: true });
    const token = useAdminStore.getState().token;
    await adminService.reactivateUser(token, id);
    const userDetail = await adminService.getUserDetail(token, id);
    const users = await adminService.getUsers(token);
    set({ userDetail, users, loading: false });
  },
}));
