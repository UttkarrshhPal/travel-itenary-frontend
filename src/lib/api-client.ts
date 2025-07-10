// lib/api-client.ts
import axios, { AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { handleApiError } from './api-middleware';
import { ItineraryCreate, Location } from '@/types/types';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  const res = await fetch("http://localhost:8000/login", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Login failed");
  }
  return res.json();
}

export async function logout() {
  const res = await fetch("http://localhost:8000/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch("http://localhost:8000/me", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function getProtectedMessage() {
  const res = await fetch("http://localhost:8000/protected", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Not authorized");
  }
  return res.json();
}
