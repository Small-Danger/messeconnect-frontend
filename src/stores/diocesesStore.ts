import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { AdminDiocese } from '../services/mockAdminApi/data';
import { useAdminStore } from './adminStore';

interface DiocesesState {
  dioceses: AdminDiocese[];
  loading: boolean;
  formOpen: boolean;
  editingId: string | null;
  loadDioceses: (filters?: { q?: string }) => Promise<void>;
  openCreateForm: () => void;
  openEditForm: (id: string) => void;
  closeForm: () => void;
  saveDiocese: (data: { nom: string; ville?: string; pays?: string; description?: string; actif?: boolean }) => Promise<void>;
  deleteDiocese: (id: string) => Promise<void>;
}

export const useDiocesesStore = create<DiocesesState>((set, get) => ({
  dioceses: [],
  loading: false,
  formOpen: false,
  editingId: null,

  loadDioceses: async (filters) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const dioceses = await adminService.getDioceses(token, filters);
      set({ dioceses, loading: false });
    } catch {
      set({ dioceses: [], loading: false });
    }
  },

  openCreateForm: () => set({ formOpen: true, editingId: null }),

  openEditForm: (id) => set({ formOpen: true, editingId: id }),

  closeForm: () => set({ formOpen: false, editingId: null }),

  saveDiocese: async (data) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const editingId = get().editingId;
      if (editingId) {
        await adminService.updateDiocese(token, editingId, data);
      } else {
        await adminService.createDiocese(token, data);
      }
      const dioceses = await adminService.getDioceses(token);
      set({ dioceses, loading: false, formOpen: false, editingId: null });
    } catch {
      set({ loading: false });
    }
  },

  deleteDiocese: async (id) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      await adminService.deleteDiocese(token, id);
      const dioceses = await adminService.getDioceses(token);
      set({ dioceses, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
