import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { USE_MOCK_API } from '../config/env';
import { fideleApi } from '../services/api/fidele';
import type { ApiMoyenPaiement, ApiTypeOffrande } from '../services/api/mappers/fideleDemande';
import { fideleService } from '../services/fideleService';
import type { MockMesse } from '../services/mockApi/data';

interface DemandeFlowState {
  messesByParoisse: Record<string, MockMesse[]>;
  typesByParoisse: Record<string, ApiTypeOffrande[]>;
  moyensByParoisse: Record<string, ApiMoyenPaiement[]>;
  setMesses: (paroisseId: string, items: MockMesse[]) => void;
  setTypes: (paroisseId: string, items: ApiTypeOffrande[]) => void;
  setMoyens: (paroisseId: string, items: ApiMoyenPaiement[]) => void;
  prefetchForParoisse: (paroisseId: string, token?: string | null) => Promise<void>;
}

export const useDemandeFlowStore = create<DemandeFlowState>()(
  persist(
    (set, get) => ({
      messesByParoisse: {},
      typesByParoisse: {},
      moyensByParoisse: {},

      setMesses: (paroisseId, items) =>
        set((state) => ({
          messesByParoisse: { ...state.messesByParoisse, [paroisseId]: items },
        })),

      setTypes: (paroisseId, items) =>
        set((state) => ({
          typesByParoisse: { ...state.typesByParoisse, [paroisseId]: items },
        })),

      setMoyens: (paroisseId, items) =>
        set((state) => ({
          moyensByParoisse: { ...state.moyensByParoisse, [paroisseId]: items },
        })),

      prefetchForParoisse: async (paroisseId, token) => {
        const tasks: Promise<void>[] = [];

        tasks.push(
          fideleService.getMesses(paroisseId, undefined, token).then((items) => {
            get().setMesses(paroisseId, items);
          }),
        );

        if (USE_MOCK_API) {
          await Promise.allSettled(tasks);
          return;
        }

        tasks.push(
          fideleService.getTypeOffrandes(paroisseId, token)?.then((types) => {
            if (types) get().setTypes(paroisseId, types);
          }) ?? Promise.resolve(),
        );

        tasks.push(
          fideleApi.getMoyenPaiements(paroisseId, token).then((moyens) => {
            get().setMoyens(paroisseId, moyens.filter((m) => m.actif));
          }),
        );

        await Promise.allSettled(tasks);
      },
    }),
    {
      name: 'mc-fidele-demande-flow',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        messesByParoisse: state.messesByParoisse,
        typesByParoisse: state.typesByParoisse,
        moyensByParoisse: state.moyensByParoisse,
      }),
    },
  ),
);
