// lib/api.ts
import { Itinerary } from "@/types/types";
import { API_CONFIG } from "./config";

// Basic itinerary form data type
export interface ItineraryFormData {
  name: string;
  duration_nights: number;
  region: 'Phuket' | 'Krabi';
  description: string;
}

export async function getRecommendedItineraries(nights: number, region?: string): Promise<Itinerary[]> {
  const params = new URLSearchParams();
  params.append('nights', nights.toString());
  if (region) {
    params.append('region', region);
  }
  
  const response = await fetch(`${API_CONFIG.BASE_URL}/mcp/recommended-itineraries/?${params.toString()}`, {
    credentials: 'include', // Add this
  });
  if (!response.ok) {
    throw new Error('Failed to fetch recommended itineraries');
  }
  return response.json();
}

export async function getItinerary(id: number) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/itineraries/${id}`, {
    credentials: 'include', // Add this
  });
  if (!response.ok) throw new Error('Failed to fetch itinerary');
  return response.json();
}

export async function createItinerary(formData: ItineraryFormData) {
  const itineraryData: Itinerary = {
    ...formData,
    id: 0, // Backend will assign the actual ID
    is_recommended: false,
    accommodations: [],
    transfers: [],
    activities: []
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}/itineraries/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Add this
    body: JSON.stringify(itineraryData),
  });
  if (!response.ok) throw new Error('Failed to create itinerary');
  return response.json();
}