import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fideleService } from '../services/fideleService';
import type { MockUser } from '../services/mockApi/data';

interface AuthState {
  user: MockUser | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  profileLoading: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<Pick<MockUser, 'nom' | 'prenom' | 'email' | 'telephone'>>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      profileLoading: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: async (email, password) => {
        const { token } = await fideleService.login(email, password);
        set({ token, user: null, isAuthenticated: true });
        await get().loadProfile();
      },
      loginWithGoogle: async (idToken) => {
        const { token } = await fideleService.loginWithGoogle(idToken);
        set({ token, user: null, isAuthenticated: true });
        await get().loadProfile();
      },
      register: async (data) => {
        const { token } = await fideleService.register(data);
        set({ token, user: null, isAuthenticated: true });
        await get().loadProfile();
      },
      logout: async () => {
        await fideleService.logout(get().token);
        set({ user: null, token: null, isAuthenticated: false, profileLoading: false });
      },
      loadProfile: async () => {
        const token = get().token;
        if (!token) {
          set({ user: null, isAuthenticated: false, profileLoading: false });
          return;
        }

        const showLoading = !get().user;
        if (showLoading) {
          set({ profileLoading: true });
        }

        try {
          const user = await fideleService.getProfile(token);
          if (user) {
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, token: null, isAuthenticated: false });
          }
        } finally {
          if (showLoading) {
            set({ profileLoading: false });
          }
        }
      },
      updateProfile: async (data) => {
        const user = await fideleService.updateProfile(get().token, data);
        set({ user });
      },
    }),
    {
      name: 'mc-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true;
          void state.loadProfile();
        }
      },
    },
  ),
);
