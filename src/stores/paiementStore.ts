import { create } from 'zustand';

interface PaiementState {
  methode: string;
  setMethode: (methode: string) => void;
  reset: () => void;
}

export const usePaiementStore = create<PaiementState>((set) => ({
  methode: 'orange',
  setMethode: (methode) => set({ methode }),
  reset: () => set({ methode: 'orange' }),
}));
