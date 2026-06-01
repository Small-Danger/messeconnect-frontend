import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { MockCampagne, MockDemande, MockPaiement, MockParoisse } from '../services/mockApi/data';

interface ParoisseState {
  paroisses: MockParoisse[];
  campagnes: MockCampagne[];
  favoris: MockParoisse[];
  demandes: MockDemande[];
  paiements: MockPaiement[];
  setParoisses: (items: MockParoisse[]) => void;
  setCampagnes: (items: MockCampagne[]) => void;
  setFavoris: (items: MockParoisse[]) => void;
  setDemandes: (items: MockDemande[]) => void;
  setPaiements: (items: MockPaiement[]) => void;
  updateParoisse: (paroisse: MockParoisse) => void;
}

export const useParoisseStore = create<ParoisseState>()(
  persist(
    (set) => ({
      paroisses: [],
      campagnes: [],
      favoris: [],
      demandes: [],
      paiements: [],
      setParoisses: (items) => set({ paroisses: items }),
      setCampagnes: (items) => set({ campagnes: items }),
      setFavoris: (items) => set({ favoris: items }),
      setDemandes: (items) => set({ demandes: items }),
      setPaiements: (items) => set({ paiements: items }),
      updateParoisse: (paroisse) =>
        set((state) => ({
          paroisses: state.paroisses.map((p) => (p.id === paroisse.id ? paroisse : p)),
          favoris: state.favoris.map((p) => (p.id === paroisse.id ? paroisse : p)),
        })),
    }),
    {
      name: 'mc-fidele-content',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        paroisses: state.paroisses,
        campagnes: state.campagnes,
        favoris: state.favoris,
        demandes: state.demandes,
        paiements: state.paiements,
      }),
    },
  ),
);
