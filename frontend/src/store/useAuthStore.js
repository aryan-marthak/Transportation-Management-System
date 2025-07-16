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
  signup: async (employeeId, name, email, password, department) => {
    try {
      const response = await fetch('http://localhost:5002/api/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ employeeId, name, email, password, department }),
      });
      const data = await response.json();
      if (response.ok) {
        set({ user: data.user, isLoggedIn: true });
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
}));

export default useAuthStore;
