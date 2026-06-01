import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { AdminParish, ParishDetail } from '../services/mockAdminApi/data';
import { useAdminStore } from './adminStore';

interface ParishesState {
  parishes: AdminParish[];
  pendingParishes: AdminParish[];
  selectedParishId: string | null;
  parishDetail: ParishDetail | null;
  validateModalOpen: boolean;
  suspendModalOpen: boolean;
  loading: boolean;
  loadParishes: (filters?: { q?: string; statut?: string }) => Promise<void>;
  loadPendingParishes: () => Promise<void>;
  openParishDrawer: (id: string) => Promise<void>;
  closeParishDrawer: () => void;
  openValidateModal: () => void;
  closeValidateModal: () => void;
  openSuspendModal: () => void;
  closeSuspendModal: () => void;
  validateParish: (action: 'valider' | 'refuser', commentaire: string) => Promise<void>;
  suspendParish: (commentaire: string) => Promise<void>;
  reactivateParish: (commentaire?: string) => Promise<void>;
}

export const useParishesStore = create<ParishesState>((set, get) => ({
  parishes: [],
  pendingParishes: [],
  selectedParishId: null,
  parishDetail: null,
  validateModalOpen: false,
  suspendModalOpen: false,
  loading: false,

  loadParishes: async (filters) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const parishes = await adminService.getParishes(token, filters);
      set({ parishes, loading: false });
    } catch {
      set({ parishes: [], loading: false });
    }
  },

  loadPendingParishes: async () => {
    try {
      const token = useAdminStore.getState().token;
      const pendingParishes = await adminService.getParishes(token, { statut: 'en_attente' });
      set({ pendingParishes });
    } catch {
      set({ pendingParishes: [] });
    }
  },

  openParishDrawer: async (id) => {
    set({ loading: true, selectedParishId: id, parishDetail: null });
    try {
      const token = useAdminStore.getState().token;
      const parishDetail = await adminService.getParishDetail(token, id);
      set({ parishDetail, loading: false });
    } catch {
      set({ parishDetail: null, loading: false });
    }
  },

  closeParishDrawer: () => set({ selectedParishId: null, parishDetail: null, validateModalOpen: false, suspendModalOpen: false }),

  openValidateModal: () => set({ validateModalOpen: true }),

  closeValidateModal: () => set({ validateModalOpen: false }),

  openSuspendModal: () => set({ suspendModalOpen: true }),

  closeSuspendModal: () => set({ suspendModalOpen: false }),

  validateParish: async (action, commentaire) => {
    const id = get().selectedParishId;
    if (!id) return;
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      await adminService.validateParish(token, id, action, commentaire);
      const parishDetail = await adminService.getParishDetail(token, id);
      const parishes = await adminService.getParishes(token);
      const pendingParishes = await adminService.getParishes(token, { statut: 'en_attente' });
      set({ parishDetail, parishes, pendingParishes, loading: false, validateModalOpen: false });
    } catch {
      set({ loading: false });
    }
  },

  suspendParish: async (commentaire) => {
    const id = get().selectedParishId;
    if (!id) return;
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      await adminService.suspendParish(token, id, commentaire);
      const parishDetail = await adminService.getParishDetail(token, id);
      const parishes = await adminService.getParishes(token);
      set({ parishDetail, parishes, loading: false, suspendModalOpen: false });
    } catch {
      set({ loading: false });
    }
  },

  reactivateParish: async (commentaire) => {
    const id = get().selectedParishId;
    if (!id) return;
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      await adminService.reactivateParish(token, id, commentaire);
      const parishDetail = await adminService.getParishDetail(token, id);
      const parishes = await adminService.getParishes(token);
      set({ parishDetail, parishes, loading: false, suspendModalOpen: false });
    } catch {
      set({ loading: false });
    }
  },
}));
