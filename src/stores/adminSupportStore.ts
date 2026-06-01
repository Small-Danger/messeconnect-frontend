import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { AdminTicket, TicketDetail } from '../services/mockAdminApi/data';
import { useAdminStore } from './adminStore';

interface AdminSupportState {
  tickets: AdminTicket[];
  selectedTicketId: string | null;
  ticketDetail: TicketDetail | null;
  filterStatut: string;
  replyModalOpen: boolean;
  loading: boolean;
  loadTickets: (filters?: { statut?: string; priorite?: string }) => Promise<void>;
  setFilterStatut: (statut: string) => void;
  openTicketDrawer: (id: string) => Promise<void>;
  closeTicketDrawer: () => void;
  openReplyModal: () => void;
  closeReplyModal: () => void;
  replyTicket: (message: string, statut: string) => Promise<void>;
}

export const useAdminSupportStore = create<AdminSupportState>((set, get) => ({
  tickets: [],
  selectedTicketId: null,
  ticketDetail: null,
  filterStatut: 'tous',
  replyModalOpen: false,
  loading: false,

  loadTickets: async (filters) => {
    set({ loading: true });
    const token = useAdminStore.getState().token;
    const tickets = await adminService.getTickets(token, filters);
    set({ tickets, loading: false });
  },

  setFilterStatut: (statut) => set({ filterStatut: statut }),

  openTicketDrawer: async (id) => {
    set({ loading: true, selectedTicketId: id });
    const token = useAdminStore.getState().token;
    const ticketDetail = await adminService.getTicketDetail(token, id);
    set({ ticketDetail, loading: false });
  },

  closeTicketDrawer: () => set({ selectedTicketId: null, ticketDetail: null, replyModalOpen: false }),

  openReplyModal: () => set({ replyModalOpen: true }),

  closeReplyModal: () => set({ replyModalOpen: false }),

  replyTicket: async (message, statut) => {
    const id = get().selectedTicketId;
    if (!id) return;
    set({ loading: true });
    const token = useAdminStore.getState().token;
    await adminService.replyTicket(token, id, message, statut);
    const ticketDetail = await adminService.getTicketDetail(token, id);
    const tickets = await adminService.getTickets(token, {
      statut: get().filterStatut !== 'tous' ? get().filterStatut : undefined,
    });
    set({ ticketDetail, tickets, loading: false, replyModalOpen: false });
  },
}));
