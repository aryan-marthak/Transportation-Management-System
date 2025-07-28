import { create } from 'zustand';
import { API_ENDPOINTS } from '../utils/config.js';

const useTripRequestStore = create((set) => ({
  tripRequests: [],
  loading: false,
  error: null,

  fetchTripRequests: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.TRIP_REQUESTS, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch trip requests');
      const data = await res.json();
      set({ tripRequests: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addTripRequest: async (tripRequest) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.TRIP_REQUESTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(tripRequest),
      });
      if (!res.ok) throw new Error('Failed to add trip request');
      const newTripRequest = await res.json();
      set((state) => ({
        tripRequests: [newTripRequest, ...state.tripRequests],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  approveTripRequest: async (requestId, { vehicleId, driverId, remarks, isOutside, outsideVehicle, outsideDriver }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.TRIP_REQUEST_APPROVE(requestId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ vehicleId, driverId, remarks, isOutside, outsideVehicle, outsideDriver }),
      });
      if (!res.ok) throw new Error('Failed to approve trip request');
      set({ loading: false });
      // Optionally, refetch or update state
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  rejectTripRequest: async (requestId, remarks) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.TRIP_REQUEST_REJECT(requestId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ remarks }),
      });
      if (!res.ok) throw new Error('Failed to reject trip request');
      set({ loading: false });
      // Optionally, refetch or update state
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  completeTripRequest: async (requestId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_ENDPOINTS.TRIP_REQUEST_COMPLETE(requestId), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to complete trip request');
      set({ loading: false });
      // Optionally, refetch or update state
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Add deleteTripRequest, updateTripRequest, etc. as needed
}));

export default useTripRequestStore; 