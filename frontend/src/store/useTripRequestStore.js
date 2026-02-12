import { create } from 'zustand';
import { API_ENDPOINTS } from '../utils/config.js';
import socket from '../utils/socket.js';

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
      // Socket will handle adding to state
      set({ loading: false });
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
      // Socket will handle updating state
      set({ loading: false });
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
      // Socket will handle updating state
      set({ loading: false });
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
      // Socket will handle updating state
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Add deleteTripRequest, updateTripRequest, etc. as needed
}));

// Socket event listeners
socket.on('tripRequest:created', (tripRequest) => {
  useTripRequestStore.setState((state) => ({
    tripRequests: [tripRequest, ...state.tripRequests],
  }));
});

socket.on('tripRequest:updated', (updatedTripRequest) => {
  useTripRequestStore.setState((state) => ({
    tripRequests: state.tripRequests.map((tr) =>
      tr._id === updatedTripRequest._id ? updatedTripRequest : tr
    ),
  }));
});

export default useTripRequestStore; 