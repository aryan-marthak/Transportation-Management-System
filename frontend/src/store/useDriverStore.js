import { create } from 'zustand';

const useDriverStore = create((set) => ({
  drivers: [],
  loading: false,
  error: null,

  fetchDrivers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('http://localhost:5002/api/drivers');
      if (!res.ok) throw new Error('Failed to fetch drivers');
      const data = await res.json();
      set({ drivers: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addDriver: async (driver) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('http://localhost:5002/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driver),
      });
      if (!res.ok) throw new Error('Failed to add driver');
      const newDriver = await res.json();
      set((state) => ({
        drivers: [...state.drivers, newDriver],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteDriver: async (driverId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`http://localhost:5002/api/drivers/${driverId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete driver');
      set((state) => ({
        drivers: state.drivers.filter((d) => d._id !== driverId),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Add updateDriver, etc. as needed
}));

export default useDriverStore; 