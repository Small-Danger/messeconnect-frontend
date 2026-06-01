import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultFideleSettings, type FideleSettings } from '../types/fidele';

interface FideleSettingsState extends FideleSettings {
  setSetting: <K extends keyof FideleSettings>(key: K, value: FideleSettings[K]) => void;
  resetSettings: () => void;
}

export const useFideleSettingsStore = create<FideleSettingsState>()(
  persist(
    (set) => ({
      ...defaultFideleSettings,
      setSetting: (key, value) => set({ [key]: value }),
      resetSettings: () => set(defaultFideleSettings),
    }),
    { name: 'mc-fidele-settings' },
  ),
);
