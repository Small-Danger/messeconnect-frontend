import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { AuditLog } from '../services/mockAdminApi/data';
import { useAdminStore } from './adminStore';

interface AuditState {
  logs: AuditLog[];
  loading: boolean;
  loadLogs: () => Promise<void>;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  loading: false,

  loadLogs: async () => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const logs = await adminService.getAuditLogs(token);
      set({ logs, loading: false });
    } catch {
      set({ logs: [], loading: false });
    }
  },
}));
