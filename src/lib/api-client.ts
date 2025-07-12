// lib/api-client.ts
import axios, { AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { handleApiError } from './api-middleware';
import { ItineraryCreate, Location } from '@/types/types';
import { authStorage } from './auth-storage';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  // Itineraries
  async getRecommendedItineraries(nights: number, region?: string) {
    try {
      const params = new URLSearchParams();
      params.append('nights', nights.toString());
      if (region) params.append('region', region);
      const response = await apiClient.get(`/mcp/recommended-itineraries/?${params}`);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async getItinerary(id: number) {
    try {
      const response = await apiClient.get(`/itineraries/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async createItinerary(data: ItineraryCreate) {
    try {
      const response = await apiClient.post('/itineraries/', data);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async getLocations() {
    try {
      const response = await apiClient.get('/locations/');
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async getTransferLocations(region: string) {
    try {
      const locations = await this.getLocations();
      return locations.filter((loc: Location) => 
        loc.region === region.toUpperCase() && 
        (loc.type === 'hotel' || loc.type === 'airport' || loc.type === 'attraction')
      );
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async getHotels(region: string) {
    try {
      const locations = await this.getLocations();
      return locations.filter(
        (loc: Location) => loc.type === 'hotel' && loc.region === region.toUpperCase()
      );
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async getActivities(region?: string) {
    try {
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      const response = await apiClient.get(`/activities/?${params}`);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  }
};

export async function login(username: string, password: string) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  
  const res = await fetch(`${API_CONFIG.BASE_URL}/login`, {
    method: "POST",
    body: formData,
  });
  
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Login failed");
  }
  
  const data = await res.json();
  authStorage.setToken(data.access_token);
  authStorage.setUser(data.user);
  return data;
}

export async function logout() {
  authStorage.clear();
  // Optionally call backend logout endpoint
  try {
    const token = authStorage.getToken();
    await fetch(`${API_CONFIG.BASE_URL}/logout`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch {
    // Ignore logout errors
  }
}

export async function getCurrentUser() {
  const token = authStorage.getToken();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Not authenticated');
    }
    throw new Error(`Failed to get current user: ${response.status}`);
  }

  const userData = await response.json();
  return userData;
}

export async function getProtectedMessage() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/protected`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Not authorized");
  }
  return res.json();
}