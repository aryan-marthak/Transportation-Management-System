import { create } from 'zustand';
import { API_ENDPOINTS } from '../utils/config.js';

const useVehicleStore = create((set) => ({
  vehicles: [],
  loading: false,
  error: null,

  fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.VEHICLES, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      const data = await res.json();
      set({ vehicles: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addVehicle: async (vehicle) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.VEHICLES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(vehicle),
      });
      if (!res.ok) throw new Error('Failed to add vehicle');
      const newVehicle = await res.json();
      set((state) => ({
        vehicles: [...state.vehicles, newVehicle],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteVehicle: async (vehicleId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.VEHICLES}/${vehicleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete vehicle');
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v._id !== vehicleId),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Add updateVehicle, etc. as needed
}));

useVehicleStore.toggleVehicleOutOfService = async (vehicleId, outOfService) => {
  useVehicleStore.setState({ loading: true, error: null });
  try {
    const res = await fetch(API_ENDPOINTS.VEHICLE_TOGGLE_STATUS(vehicleId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ outOfService }),
    });
    if (!res.ok) throw new Error('Failed to update vehicle status');
    const updatedVehicle = await res.json();
    useVehicleStore.setState((state) => ({
      vehicles: state.vehicles.map((v) => v._id === vehicleId ? updatedVehicle : v),
      loading: false,
    }));
  } catch (err) {
    useVehicleStore.setState({ error: err.message, loading: false });
  }
};

export default useVehicleStore; 