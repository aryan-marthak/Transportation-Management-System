import { create } from 'zustand';

const useVehicleStore = create((set) => ({
  vehicles: [],
  loading: false,
  error: null,

  fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('http://localhost:5002/api/vehicles');
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
      const res = await fetch('http://localhost:5002/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`http://localhost:5002/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
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

export default useVehicleStore; 