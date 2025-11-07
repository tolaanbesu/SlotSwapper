
import axios from 'axios';

export const PRIMARY_BLUE = 'bg-sky-600';
export const PRIMARY_GREEN = 'bg-lime-500';
export const PRIMARY_RED = 'bg-red-500';

export const LIGHT_BLUE_ACTIVE = 'bg-sky-100 text-sky-700';
export const LIGHT_GREEN_ACTIVE = 'bg-lime-100 text-lime-700';

const API_BASE = import.meta.env.VITE_API_URL || 'https://slot-swapper-backend-sand.vercel.app/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export const MOCK_COLORS = ['red', 'green', 'blue', 'yellow'];



