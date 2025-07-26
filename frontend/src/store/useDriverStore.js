import { create } from 'zustand';
import { API_ENDPOINTS } from '../utils/config.js';

const useDriverStore = create((set) => ({
  drivers: [],
  loading: false,
  error: null,

  fetchDrivers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.DRIVERS);
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
      const res = await fetch(API_ENDPOINTS.DRIVERS, {
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
      const res = await fetch(`${API_ENDPOINTS.DRIVERS}/${driverId}`, {
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

// Add toggleDriverUnavailable method
useDriverStore.toggleDriverUnavailable = async (driverId, temporarilyUnavailable) => {
  useDriverStore.setState({ loading: true, error: null });
  try {
    const res = await fetch(API_ENDPOINTS.DRIVER_TOGGLE_UNAVAILABLE(driverId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temporarilyUnavailable }),
    });
    if (!res.ok) throw new Error('Failed to update driver status');
    const updatedDriver = await res.json();
    useDriverStore.setState((state) => ({
      drivers: state.drivers.map((d) => d._id === driverId ? updatedDriver : d),
      loading: false,
    }));
  } catch (err) {
    useDriverStore.setState({ error: err.message, loading: false });
  }
};

export default useDriverStore; 