// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/login`,
  SIGNUP: `${API_BASE_URL}/api/signup`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
  VERIFY_OTP: `${API_BASE_URL}/api/verify-otp`,
  ME: `${API_BASE_URL}/api/me`,
  
  // Trip request endpoints
  TRIP_REQUESTS: `${API_BASE_URL}/api/tripRequest`,
  TRIP_REQUEST_APPROVE: (id) => `${API_BASE_URL}/api/tripRequest/${id}/approve`,
  TRIP_REQUEST_REJECT: (id) => `${API_BASE_URL}/api/tripRequest/${id}/reject`,
  TRIP_REQUEST_COMPLETE: (id) => `${API_BASE_URL}/api/tripRequest/${id}/complete`,
  
  // Vehicle endpoints
  VEHICLES: `${API_BASE_URL}/api/vehicles`,
  VEHICLE_TOGGLE_STATUS: (id) => `${API_BASE_URL}/api/vehicles/${id}/toggleStatus`,
  
  // Driver endpoints
  DRIVERS: `${API_BASE_URL}/api/drivers`,
  DRIVER_TOGGLE_UNAVAILABLE: (id) => `${API_BASE_URL}/api/drivers/${id}/toggleUnavailable`,
};

// Environment configuration
export const config = {
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',
  appName: import.meta.env.VITE_APP_NAME || 'Transportation Management System',
}; 