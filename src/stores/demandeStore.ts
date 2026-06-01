import { create } from 'zustand';
import type { MockDemande } from '../services/mockApi/data';

export interface DemandeDraft {
  paroisseId?: string;
  paroisseNom?: string;
  typeMesse?: string;
  typeOffrandeId?: string;
  messeId?: string;
  intention?: string;
  date?: string;
  creneau?: string;
  pretre?: string;
  montant?: number;
  estAnonyme?: boolean;
}

interface DemandeState {
  step: number;
  draft: DemandeDraft;
  currentDemande: MockDemande | null;
  setStep: (step: number) => void;
  setDraft: (patch: Partial<DemandeDraft>) => void;
  setCurrentDemande: (demande: MockDemande | null) => void;
  reset: () => void;
}

export const useDemandeStore = create<DemandeState>((set) => ({
  step: 1,
  draft: {},
  currentDemande: null,
  setStep: (step) => set({ step }),
  setDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
  setCurrentDemande: (demande) => set({ currentDemande: demande }),
  reset: () => set({ step: 1, draft: {}, currentDemande: null }),
}));
