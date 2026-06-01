import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { AdminTransaction, TransactionDetail, TransactionSynthese } from '../services/mockAdminApi/data';
import { useAdminStore } from './adminStore';

export interface TransactionFilters {
  q?: string;
  statut?: string;
  methode?: string;
  dateDebut?: string;
  dateFin?: string;
  montantMin?: number;
  montantMax?: number;
}

const emptySynthese: TransactionSynthese = {
  total: 0,
  montantTotal: 0,
  montantReussi: 0,
  reussis: 0,
  enAttente: 0,
  echoues: 0,
};

interface TransactionsState {
  transactions: AdminTransaction[];
  synthese: TransactionSynthese;
  selectedTransactionId: string | null;
  transactionDetail: TransactionDetail | null;
  filters: TransactionFilters;
  loading: boolean;
  loadTransactions: (filters?: TransactionFilters) => Promise<void>;
  setFilters: (filters: TransactionFilters) => void;
  openTransactionDrawer: (id: string) => Promise<void>;
  closeTransactionDrawer: () => void;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  synthese: emptySynthese,
  selectedTransactionId: null,
  transactionDetail: null,
  filters: {},
  loading: false,

  loadTransactions: async (filters) => {
    set({ loading: true });
    try {
      const token = useAdminStore.getState().token;
      const { transactions, synthese } = await adminService.getTransactions(token, filters);
      set({ transactions, synthese, loading: false });
    } catch {
      set({ transactions: [], synthese: emptySynthese, loading: false });
    }
  },

  setFilters: (filters) => set({ filters }),

  openTransactionDrawer: async (id) => {
    set({ loading: true, selectedTransactionId: id, transactionDetail: null });
    try {
      const token = useAdminStore.getState().token;
      const transactionDetail = await adminService.getTransactionDetail(token, id);
      set({ transactionDetail, loading: false });
    } catch {
      set({ transactionDetail: null, loading: false });
    }
  },

  closeTransactionDrawer: () => set({ selectedTransactionId: null, transactionDetail: null }),
}));
