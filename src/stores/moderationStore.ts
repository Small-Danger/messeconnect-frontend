import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { AdminCampagneModeration, AdminPublicationModeration } from '../services/mockAdminApi/data';
import { useAdminStore } from './adminStore';

interface ModerationState {
  publications: AdminPublicationModeration[];
  campagnes: AdminCampagneModeration[];
  loading: boolean;
  visibilityFilter: 'tous' | 'visible' | 'masque';
  loadPublications: () => Promise<void>;
  loadCampagnes: () => Promise<void>;
  setVisibilityFilter: (filter: 'tous' | 'visible' | 'masque') => void;
  togglePublicationVisible: (id: string, visible: boolean) => Promise<void>;
}

export const useModerationStore = create<ModerationState>((set, get) => ({
  publications: [],
  campagnes: [],
  loading: false,
  visibilityFilter: 'tous',

  loadPublications: async () => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const filter = get().visibilityFilter;
      const visible = filter === 'tous' ? undefined : filter === 'visible';
      const publications = await adminService.getPublications(token, visible);
      set({ publications, loading: false });
    } catch {
      set({ publications: [], loading: false });
    }
  },

  loadCampagnes: async () => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const campagnes = await adminService.getCampagnesModeration(token);
      set({ campagnes, loading: false });
    } catch {
      set({ campagnes: [], loading: false });
    }
  },

  setVisibilityFilter: (filter) => set({ visibilityFilter: filter }),

  togglePublicationVisible: async (id, visible) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      await adminService.updatePublicationVisible(token, id, visible);
      await get().loadPublications();
    } catch {
      set({ loading: false });
    }
  },
}));
