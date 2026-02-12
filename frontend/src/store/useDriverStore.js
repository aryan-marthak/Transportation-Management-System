import { create } from 'zustand';
import { API_ENDPOINTS } from '../utils/config.js';
import socket from '../utils/socket.js';

const useDriverStore = create((set) => ({
  drivers: [],
  loading: false,
  error: null,

  fetchDrivers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.DRIVERS, {
        credentials: 'include',
      });
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
        credentials: 'include',
        body: JSON.stringify(driver),
      });
      if (!res.ok) throw new Error('Failed to add driver');
      // Socket will handle adding to state
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteDriver: async (driverId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.DRIVERS}/${driverId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete driver');
      // Socket will handle removing from state
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Add updateDriver, etc. as needed
}));

// Socket event listeners
socket.on('driver:created', (driver) => {
  useDriverStore.setState((state) => ({
    drivers: [...state.drivers, driver],
  }));
});

socket.on('driver:updated', (updatedDriver) => {
  useDriverStore.setState((state) => ({
    drivers: state.drivers.map((d) =>
      d._id === updatedDriver._id ? updatedDriver : d
    ),
  }));
});

socket.on('driver:deleted', ({ _id }) => {
  useDriverStore.setState((state) => ({
    drivers: state.drivers.filter((d) => d._id !== _id),
  }));
});

// Add toggleDriverUnavailable method
useDriverStore.toggleDriverUnavailable = async (driverId, temporarilyUnavailable) => {
  useDriverStore.setState({ loading: true, error: null });
  try {
    const res = await fetch(API_ENDPOINTS.DRIVER_TOGGLE_UNAVAILABLE(driverId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ temporarilyUnavailable }),
    });
    if (!res.ok) throw new Error('Failed to update driver status');
    // Socket will handle updating state
    useDriverStore.setState({ loading: false });
  } catch (err) {
    useDriverStore.setState({ error: err.message, loading: false });
  }
};

export default useDriverStore; 