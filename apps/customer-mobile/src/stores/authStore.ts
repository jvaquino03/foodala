import { create } from 'zustand';

// MOCK-ONLY auth. No provider, no backend — just local UI state that gates the
// app and drives the header. "Signing in" never validates credentials.
export type AuthStatus = 'loggedOut' | 'guest' | 'user';

type AuthState = {
  status: AuthStatus;
  email: string | null;
  signIn: (email: string) => void;
  continueAsGuest: () => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loggedOut',
  email: null,
  signIn: (email) => set({ status: 'user', email: email.trim() || null }),
  continueAsGuest: () => set({ status: 'guest', email: null }),
  signOut: () => set({ status: 'loggedOut', email: null }),
}));
