import { create } from 'zustand';
import { paroisseService } from '../services/paroisseService';
import type { ParoisseMesse } from '../services/mockApi/paroisse/data';
import { useParoisseAppStore } from './paroisseAppStore';

interface CalendarState {
  messes: ParoisseMesse[];
  selectedMesseId: string | null;
  scheduleDrawerOpen: boolean;
  loadMesses: () => Promise<void>;
  setSelectedMesseId: (id: string | null) => void;
  openScheduleDrawer: () => void;
  closeScheduleDrawer: () => void;
  scheduleMesse: (data: {
    titre: string;
    date: string;
    heure: string;
    pretre: string;
    lieu: string;
  }) => Promise<void>;
  scheduleRecurringMesses: (data: {
    titre: string;
    jour_semaine: number;
    heure: string;
    semaines: number;
    capacite_max?: number;
    pretre?: string;
    lieu?: string;
  }) => Promise<number>;
}

async function refreshCalendarViews(get: () => CalendarState) {
  await get().loadMesses();
  await useParoisseAppStore.getState().loadDashboard();
  await useParoisseAppStore.getState().loadPlanningIntentions();
  const range = useParoisseAppStore.getState().lastCalendarRange;
  if (range) {
    await useParoisseAppStore.getState().loadCalendarPlanning(range.from, range.to);
  }
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  messes: [],
  selectedMesseId: null,
  scheduleDrawerOpen: false,

  loadMesses: async () => {
    const token = useParoisseAppStore.getState().token;
    set({ messes: await paroisseService.getMesses(token) });
  },

  setSelectedMesseId: (id) => set({ selectedMesseId: id }),

  openScheduleDrawer: () => set({ scheduleDrawerOpen: true }),

  closeScheduleDrawer: () => set({ scheduleDrawerOpen: false }),

  scheduleMesse: async (data) => {
    const token = useParoisseAppStore.getState().token;
    await paroisseService.addMesse(token, { ...data });
    set({ scheduleDrawerOpen: false });
    await refreshCalendarViews(get);
  },

  scheduleRecurringMesses: async (data) => {
    const token = useParoisseAppStore.getState().token;
    const created = await paroisseService.scheduleRecurringMesses(token, data);
    set({ scheduleDrawerOpen: false });
    await refreshCalendarViews(get);
    return created;
  },
}));
