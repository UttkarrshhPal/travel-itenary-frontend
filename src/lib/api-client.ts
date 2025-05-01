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