import { create } from 'zustand';
import { paroisseService } from '../services/paroisseService';
import type { TicketSupport } from '../services/mockApi/paroisse/data';
import { useParoisseAppStore } from './paroisseAppStore';

interface SupportState {
  tickets: TicketSupport[];
  allTickets: TicketSupport[];
  loading: boolean;
  filterStatut: string;
  newTicketModalOpen: boolean;
  lastSubmittedRef: string | null;
  loadTickets: (statut?: string) => Promise<void>;
  setFilterStatut: (statut: string) => void;
  openNewTicketModal: () => void;
  closeNewTicketModal: () => void;
  addTicket: (data: { titre: string; categorie: string; description: string }) => Promise<void>;
}

export const useSupportStore = create<SupportState>((set, get) => ({
  tickets: [],
  allTickets: [],
  loading: false,
  filterStatut: 'tous',
  newTicketModalOpen: false,
  lastSubmittedRef: null,

  loadTickets: async (statut) => {
    set({ loading: true });
    try {
      const s = statut ?? get().filterStatut;
      const token = useParoisseAppStore.getState().token;
      const allTickets = await paroisseService.getTickets(token);
      const tickets = s && s !== 'tous' ? allTickets.filter((t) => t.statut === s) : allTickets;
      set({ allTickets, tickets });
    } finally {
      set({ loading: false });
    }
  },

  setFilterStatut: (statut) => {
    set({ filterStatut: statut });
    void get().loadTickets(statut);
  },

  openNewTicketModal: () => set({ newTicketModalOpen: true }),

  closeNewTicketModal: () => set({ newTicketModalOpen: false }),

  addTicket: async (data) => {
    const token = useParoisseAppStore.getState().token;
    const created = await paroisseService.addTicket(token, data);
    set({
      newTicketModalOpen: false,
      lastSubmittedRef: created?.reference ?? null,
    });
    await get().loadTickets();
  },
}));
