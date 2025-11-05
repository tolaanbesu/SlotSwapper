// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// export const api = axios.create({
//   baseURL: API_BASE,
//   headers: { 'Content-Type': 'application/json' },
// });

// export function setAuthToken(token) {
//   if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   else delete api.defaults.headers.common['Authorization'];
// }


// src/api- This file sets up the Axios instance for API communication.
import axios from 'axios';

// --- Color Constants (Used for UI styling throughout the application) ---
export const PRIMARY_BLUE = 'bg-sky-600';
export const PRIMARY_GREEN = 'bg-lime-500';
export const PRIMARY_RED = 'bg-red-500';

export const LIGHT_BLUE_ACTIVE = 'bg-sky-100 text-sky-700';
export const LIGHT_GREEN_ACTIVE = 'bg-lime-100 text-lime-700';

// --- AXIOS API SETUP ---
// NOTE: Hardcoding the API_BASE URL to resolve the 'import.meta.env' compilation warning.
const API_BASE = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) {
    // Set token for real API calls
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Remove token
    delete api.defaults.headers.common['Authorization'];
  }
}

export const MOCK_COLORS = ['red', 'green', 'blue', 'yellow'];
