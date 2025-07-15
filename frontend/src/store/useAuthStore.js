import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  logout: async () => {
    try {
      await fetch('http://localhost:5002/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch {}
    set({ user: null, isLoggedIn: false });
  },
  fetchCurrentUser: async () => {
    try {
      const res = await fetch('http://localhost:5002/api/me', { credentials: 'include' });
      if (res.ok) {
        const user = await res.json();
        set({ user, isLoggedIn: true });
      } else {
        set({ user: null, isLoggedIn: false });
      }
    } catch {
      set({ user: null, isLoggedIn: false });
    }
  },
}));

export default useAuthStore;
