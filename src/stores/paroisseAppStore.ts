import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiError } from '../services/api/client';
import { paroisseService } from '../services/paroisseService';
import type { ParoisseDashboardData } from '../services/api/paroisse';
import type {
  CreneauIntentions,
  GuichetIntentionInput,
  HistoriqueFilters,
  PaiementEspecesEnAttente,
  PlanningFilters,
} from '../types/paroisseIntentions';
import { buildUpcomingPlanningFilters } from '../utils/intentionsGrouping';
import type {
  CampagneParoisse,
  MoyenPaiementParoisse,
  ParoisseDemande,
  ParoisseProfile,
  PublicationParoisse,
  TypeOffrandeParoisse,
} from '../services/mockApi/paroisse/data';

interface ParoisseAppState {
  token: string | null;
  isAuthenticated: boolean;
  profile: ParoisseProfile | null;
  dashboard: ParoisseDashboardData | null;
  dashboardLoading: boolean;
  dashboardRefreshing: boolean;
  demandes: ParoisseDemande[];
  demandesLoading: boolean;
  demandesRefreshing: boolean;
  moyensPaiement: MoyenPaiementParoisse[];
  typesOffrandes: TypeOffrandeParoisse[];
  publications: PublicationParoisse[];
  campagnes: CampagneParoisse[];
  selectedDemandeId: string | null;
  lastDemandesFilters?: { q?: string; statut?: string; date?: string; messeId?: string };
  planningCreneaux: CreneauIntentions[];
  calendarCreneaux: CreneauIntentions[];
  historiqueDemandes: ParoisseDemande[];
  cashPending: PaiementEspecesEnAttente[];
  planningLoading: boolean;
  planningRefreshing: boolean;
  calendarPlanningLoading: boolean;
  historiqueLoading: boolean;
  historiqueRefreshing: boolean;
  cashLoading: boolean;
  cashRefreshing: boolean;
  planningFilters?: PlanningFilters;
  historiqueFilters?: HistoriqueFilters;
  lastCalendarRange?: { from: string; to: string };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  loadDashboard: () => Promise<void>;
  updateProfile: (data: Partial<ParoisseProfile>) => Promise<void>;
  loadDemandes: (filters?: { q?: string; statut?: string; date?: string; messeId?: string }) => Promise<void>;
  loadPaymentAndOfferings: () => Promise<void>;
  loadPublicationsAndCampaigns: () => Promise<void>;
  setSelectedDemandeId: (id: string | null) => void;
  validerDemande: (id: string) => Promise<void>;
  rejeterDemande: (id: string, motif: string) => Promise<void>;
  celebrerDemande: (id: string) => Promise<void>;
  celebrerMesse: (messeId: string) => Promise<void>;
  loadPlanningIntentions: (filters?: PlanningFilters) => Promise<void>;
  loadCalendarPlanning: (from: string, to: string) => Promise<void>;
  loadHistoriqueDemandes: (filters?: HistoriqueFilters) => Promise<void>;
  loadCashPending: () => Promise<void>;
  confirmCashPayment: (paiementId: string) => Promise<void>;
  cancelCashPayment: (paiementId: string) => Promise<void>;
  createGuichetIntention: (data: GuichetIntentionInput) => Promise<void>;
  addMoyenPaiement: (data: Omit<MoyenPaiementParoisse, 'id'>) => Promise<void>;
  updateMoyenPaiement: (id: string, data: Partial<Omit<MoyenPaiementParoisse, 'id'>>) => Promise<void>;
  deleteMoyenPaiement: (id: string) => Promise<void>;
  addTypeOffrande: (data: Omit<TypeOffrandeParoisse, 'id' | 'actif'>) => Promise<void>;
  updateTypeOffrande: (id: string, data: Partial<Omit<TypeOffrandeParoisse, 'id'>>) => Promise<void>;
  deleteTypeOffrande: (id: string) => Promise<void>;
  addPublication: (data: Omit<PublicationParoisse, 'id'>) => Promise<void>;
  updatePublication: (id: string, data: Partial<Omit<PublicationParoisse, 'id'>>) => Promise<void>;
  deletePublication: (id: string) => Promise<void>;
  addCampagne: (data: Omit<CampagneParoisse, 'id' | 'collecte'>) => Promise<void>;
  updateCampagne: (id: string, data: Partial<Omit<CampagneParoisse, 'id'>>) => Promise<void>;
  deleteCampagne: (id: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

function handleUnauthorized(error: unknown, clearLocalSession: () => void): boolean {
  if (error instanceof ApiError && error.status === 401) {
    clearLocalSession();
    return true;
  }
  return false;
}

function createClearedSessionState(): Partial<ParoisseAppState> {
  return {
    token: null,
    isAuthenticated: false,
    profile: null,
    dashboard: null,
    dashboardLoading: false,
    dashboardRefreshing: false,
    planningCreneaux: [],
    calendarCreneaux: [],
    historiqueDemandes: [],
    cashPending: [],
    planningLoading: false,
    planningRefreshing: false,
    calendarPlanningLoading: false,
    historiqueLoading: false,
    historiqueRefreshing: false,
    cashLoading: false,
    cashRefreshing: false,
    planningFilters: buildUpcomingPlanningFilters('all'),
    historiqueFilters: undefined,
    demandes: [],
    demandesLoading: false,
    demandesRefreshing: false,
    selectedDemandeId: null,
  };
}

/** Store principal module Paroisse */
export const useParoisseAppStore = create<ParoisseAppState>()(
  persist(
    (set, get) => {
      const clearLocalSession = () => set(createClearedSessionState());

      return {
      token: null,
      isAuthenticated: false,
      profile: null,
      dashboard: null,
      dashboardLoading: false,
      dashboardRefreshing: false,
      demandes: [],
      demandesLoading: false,
      demandesRefreshing: false,
      moyensPaiement: [],
      typesOffrandes: [],
      publications: [],
      campagnes: [],
      selectedDemandeId: null,
      lastDemandesFilters: undefined,
      planningCreneaux: [],
      calendarCreneaux: [],
      historiqueDemandes: [],
      cashPending: [],
      planningLoading: false,
      planningRefreshing: false,
      calendarPlanningLoading: false,
      historiqueLoading: false,
      historiqueRefreshing: false,
      cashLoading: false,
      cashRefreshing: false,
      planningFilters: buildUpcomingPlanningFilters('all'),
      historiqueFilters: undefined,

      login: async (email, password) => {
        const { token } = await paroisseService.login(email, password);
        set({ token, isAuthenticated: true });
        await Promise.all([
          get().loadProfile(),
          get().loadDashboard(),
          get().loadPlanningIntentions(),
          get().loadCashPending(),
        ]);
      },

      logout: () => {
        const token = get().token;
        clearLocalSession();
        void paroisseService.logout(token);
      },

      loadProfile: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const profile = await paroisseService.getProfile(token);
          if (profile) set({ profile });
        } catch (error) {
          handleUnauthorized(error, clearLocalSession);
        }
      },

      loadDashboard: async () => {
        const token = get().token;
        if (!token) return;

        const hasCache = get().dashboard !== null;
        set({
          dashboardLoading: !hasCache,
          dashboardRefreshing: hasCache,
        });

        try {
          const dashboard = await paroisseService.getDashboard(token);
          if (dashboard) set({ dashboard });
        } catch (error) {
          if (!handleUnauthorized(error, clearLocalSession)) {
            console.error('Impossible de charger le tableau de bord paroisse', error);
          }
        } finally {
          set({ dashboardLoading: false, dashboardRefreshing: false });
        }
      },

      updateProfile: async (data) => {
        const profile = await paroisseService.updateProfile(get().token, data);
        set({ profile });
      },

      loadDemandes: async (filters) => {
        const activeFilters = filters ?? get().lastDemandesFilters;
        if (filters) set({ lastDemandesFilters: filters });

        const hasCache = get().demandes.length > 0 && !activeFilters?.q && !activeFilters?.date && !activeFilters?.messeId;
        set({
          demandesLoading: !hasCache,
          demandesRefreshing: hasCache,
        });

        try {
          const demandes = await paroisseService.getDemandes(get().token, activeFilters);
          set({ demandes });
        } finally {
          set({ demandesLoading: false, demandesRefreshing: false });
        }
      },

      loadPaymentAndOfferings: async () => {
        const token = get().token;
        const [moyensPaiement, typesOffrandes] = await Promise.all([
          paroisseService.getMoyensPaiement(token),
          paroisseService.getTypesOffrandes(token),
        ]);
        set({ moyensPaiement, typesOffrandes });
      },

      loadPublicationsAndCampaigns: async () => {
        const token = get().token;
        const [publications, campagnes] = await Promise.all([
          paroisseService.getPublications(token),
          paroisseService.getCampagnes(token),
        ]);
        set({ publications, campagnes });
      },

      setSelectedDemandeId: (id) => set({ selectedDemandeId: id }),

      validerDemande: async (id) => {
        await paroisseService.validerDemande(get().token, id);
        await Promise.all([get().loadDemandes(), get().loadDashboard()]);
      },

      rejeterDemande: async (id, motif) => {
        await paroisseService.rejeterDemande(get().token, id, motif);
        await Promise.all([get().loadDemandes(), get().loadDashboard()]);
      },

      celebrerDemande: async (id) => {
        await paroisseService.celebrerDemande(get().token, id);
        await Promise.all([get().loadDemandes(), get().loadDashboard()]);
      },

      celebrerMesse: async (messeId) => {
        await paroisseService.celebrerMesse(get().token, messeId);
        await Promise.all([get().loadPlanningIntentions(), get().loadDashboard(), get().loadCashPending()]);
      },

      loadPlanningIntentions: async (filters) => {
        const token = get().token;
        if (!token) return;

        const activeFilters = filters ?? get().planningFilters ?? buildUpcomingPlanningFilters('all');
        if (filters) set({ planningFilters: activeFilters });

        const hasCache = get().planningCreneaux.length > 0 && !filters;
        set({ planningLoading: !hasCache, planningRefreshing: hasCache });
        try {
          const planningCreneaux = await paroisseService.getPlanningIntentions(token, activeFilters);
          set({ planningCreneaux });
        } catch (error) {
          if (!handleUnauthorized(error, clearLocalSession)) {
            console.error('Impossible de charger le planning paroisse', error);
          }
        } finally {
          set({ planningLoading: false, planningRefreshing: false });
        }
      },

      loadCalendarPlanning: async (from, to) => {
        const token = get().token;
        if (!token) return;

        set({ calendarPlanningLoading: true, lastCalendarRange: { from, to } });
        try {
          const calendarCreneaux = await paroisseService.getPlanningIntentions(token, {
            scope: 'range',
            from,
            to,
          });
          set({ calendarCreneaux });
        } catch (error) {
          if (!handleUnauthorized(error, clearLocalSession)) {
            console.error('Impossible de charger le calendrier paroisse', error);
          }
        } finally {
          set({ calendarPlanningLoading: false });
        }
      },

      loadHistoriqueDemandes: async (filters) => {
        const activeFilters = filters ?? get().historiqueFilters;
        if (filters) set({ historiqueFilters: filters });

        const hasCache = get().historiqueDemandes.length > 0 && !filters;
        set({ historiqueLoading: !hasCache, historiqueRefreshing: hasCache });
        try {
          const historiqueDemandes = await paroisseService.getHistoriqueDemandes(get().token, activeFilters);
          set({ historiqueDemandes });
        } finally {
          set({ historiqueLoading: false, historiqueRefreshing: false });
        }
      },

      loadCashPending: async () => {
        const token = get().token;
        if (!token) return;

        const hasCache = get().cashPending.length > 0;
        set({ cashLoading: !hasCache, cashRefreshing: hasCache });
        try {
          const cashPending = await paroisseService.getCashPendingPayments(token);
          set({ cashPending });
        } catch (error) {
          if (!handleUnauthorized(error, clearLocalSession)) {
            console.error('Impossible de charger les paiements espèces', error);
          }
        } finally {
          set({ cashLoading: false, cashRefreshing: false });
        }
      },

      confirmCashPayment: async (paiementId) => {
        await paroisseService.confirmCashPayment(get().token, paiementId);
        await Promise.all([get().loadCashPending(), get().loadPlanningIntentions(), get().loadDashboard()]);
      },

      cancelCashPayment: async (paiementId) => {
        await paroisseService.cancelCashPayment(get().token, paiementId);
        await Promise.all([get().loadCashPending(), get().loadPlanningIntentions(), get().loadDashboard()]);
      },

      createGuichetIntention: async (data) => {
        await paroisseService.createGuichetIntention(get().token, data);
        await Promise.all([get().loadPlanningIntentions(), get().loadCashPending(), get().loadDashboard()]);
      },

      addMoyenPaiement: async (data) => {
        await paroisseService.addMoyenPaiement(get().token, data);
        await get().loadPaymentAndOfferings();
      },

      updateMoyenPaiement: async (id, data) => {
        await paroisseService.updateMoyenPaiement(get().token, id, data);
        await get().loadPaymentAndOfferings();
      },

      deleteMoyenPaiement: async (id) => {
        await paroisseService.deleteMoyenPaiement(get().token, id);
        await get().loadPaymentAndOfferings();
      },

      addTypeOffrande: async (data) => {
        await paroisseService.addTypeOffrande(get().token, data);
        await get().loadPaymentAndOfferings();
      },

      updateTypeOffrande: async (id, data) => {
        await paroisseService.updateTypeOffrande(get().token, id, data);
        await get().loadPaymentAndOfferings();
      },

      deleteTypeOffrande: async (id) => {
        await paroisseService.deleteTypeOffrande(get().token, id);
        await get().loadPaymentAndOfferings();
      },

      addPublication: async (data) => {
        await paroisseService.addPublication(get().token, data);
        await get().loadPublicationsAndCampaigns();
      },

      updatePublication: async (id, data) => {
        await paroisseService.updatePublication(get().token, id, data);
        await get().loadPublicationsAndCampaigns();
      },

      deletePublication: async (id) => {
        await paroisseService.deletePublication(get().token, id);
        await get().loadPublicationsAndCampaigns();
      },

      addCampagne: async (data) => {
        await paroisseService.addCampagne(get().token, data);
        await get().loadPublicationsAndCampaigns();
      },

      updateCampagne: async (id, data) => {
        await paroisseService.updateCampagne(get().token, id, data);
        await get().loadPublicationsAndCampaigns();
      },

      deleteCampagne: async (id) => {
        await paroisseService.deleteCampagne(get().token, id);
        await get().loadPublicationsAndCampaigns();
      },

      refreshSession: async () => {
        const token = get().token;
        if (!token) return;

        try {
          await get().loadProfile();
          if (!get().token) return;

          await Promise.all([
            get().loadDashboard(),
            get().loadPlanningIntentions(),
            get().loadCashPending(),
          ]);
        } catch (error) {
          if (!handleUnauthorized(error, clearLocalSession)) {
            console.error('Impossible de rafraîchir la session paroisse', error);
          }
        }
      },
    };
    },
    {
      name: 'mc-paroisse-app',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
        dashboard: state.dashboard,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true;
          void state.refreshSession();
        }
      },
    },
  ),
);
