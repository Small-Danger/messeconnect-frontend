import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminService } from '../services/adminService';
import type { DashboardData, SystemAnnonce, SystemCampagne } from '../services/mockAdminApi/data';

interface AdminAuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  dashboard: DashboardData | null;
  dashboardLoading: boolean;
  annonces: SystemAnnonce[];
  campagnes: SystemCampagne[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  loadDashboard: () => Promise<void>;
  addAnnonce: (data: Omit<SystemAnnonce, 'id' | 'actif'>) => Promise<void>;
  addCampagne: (data: Omit<SystemCampagne, 'id' | 'collecte'>) => Promise<void>;
}

export const useAdminStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      isAuthenticated: false,
      dashboard: null,
      dashboardLoading: false,
      annonces: [],
      campagnes: [],

      login: async (email, password) => {
        const { token, email: userEmail } = await adminService.login(email, password);
        set({ token, email: userEmail, isAuthenticated: true });
        await get().loadDashboard();
      },

      logout: () => {
        adminService.logout(get().token);
        set({
          token: null,
          email: null,
          isAuthenticated: false,
          dashboard: null,
          dashboardLoading: false,
          annonces: [],
          campagnes: [],
        });
      },

      refreshSession: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false, email: null });
          return;
        }
        const valid = await adminService.validateSession(token);
        if (!valid) {
          set({
            token: null,
            email: null,
            isAuthenticated: false,
            dashboard: null,
          });
          return;
        }
        set({ isAuthenticated: true });
      },

      loadDashboard: async () => {
        const hasCache = get().dashboard !== null;
        set({ dashboardLoading: !hasCache });
        try {
          const dashboard = await adminService.getDashboard(get().token);
          if (!dashboard) return;
          set({
            dashboard,
            annonces: dashboard.annonces,
            campagnes: dashboard.campagnes,
          });
        } finally {
          set({ dashboardLoading: false });
        }
      },

      addAnnonce: async (data) => {
        await adminService.addAnnonce(get().token, data);
        await get().loadDashboard();
      },

      addCampagne: async (data) => {
        await adminService.addCampagne(get().token, data);
        await get().loadDashboard();
      },
    }),
    { name: 'mc-admin' },
  ),
);
