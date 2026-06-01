import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { AdminAbonnement, AdminParish } from '../services/mockAdminApi/data';
import { useAdminStore } from './adminStore';

interface AbonnementsState {
  abonnements: AdminAbonnement[];
  parishes: AdminParish[];
  loading: boolean;
  formOpen: boolean;
  editingId: string | null;
  loadAbonnements: (filters?: { statut?: string }) => Promise<void>;
  loadParishes: () => Promise<void>;
  openCreateForm: () => void;
  openEditForm: (id: string) => void;
  closeForm: () => void;
  saveAbonnement: (data: {
    paroisse_id: string;
    plan: string;
    montant: number;
    date_debut: string;
    date_fin?: string;
    statut?: string;
  }) => Promise<void>;
  updateAbonnement: (
    id: string,
    data: Partial<{ plan: string; montant: number; date_debut: string; date_fin: string | null; statut: string }>,
  ) => Promise<void>;
}

export const useAbonnementsStore = create<AbonnementsState>((set, get) => ({
  abonnements: [],
  parishes: [],
  loading: false,
  formOpen: false,
  editingId: null,

  loadAbonnements: async (filters) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const abonnements = await adminService.getAbonnements(token, filters);
      set({ abonnements, loading: false });
    } catch {
      set({ abonnements: [], loading: false });
    }
  },

  loadParishes: async () => {
    const token = useAdminStore.getState().token;
    const parishes = await adminService.getParishes(token, { statut: 'validee' });
    set({ parishes });
  },

  openCreateForm: () => set({ formOpen: true, editingId: null }),

  openEditForm: (id) => set({ formOpen: true, editingId: id }),

  closeForm: () => set({ formOpen: false, editingId: null }),

  saveAbonnement: async (data) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const editingId = get().editingId;
      if (editingId) {
        await adminService.updateAbonnement(token, editingId, data);
      } else {
        await adminService.createAbonnement(token, data);
      }
      const abonnements = await adminService.getAbonnements(token);
      set({ abonnements, loading: false, formOpen: false, editingId: null });
    } catch {
      set({ loading: false });
    }
  },

  updateAbonnement: async (id, data) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      await adminService.updateAbonnement(token, id, data);
      const abonnements = await adminService.getAbonnements(token);
      set({ abonnements, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
