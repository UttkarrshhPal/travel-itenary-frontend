import { Itinerary } from "@/types/types";

// Basic itinerary form data type
export interface ItineraryFormData {
  name: string;
  duration_nights: number;
  region: 'Phuket' | 'Krabi';
  description: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getRecommendedItineraries(nights: number, region?: string): Promise<Itinerary[]> {
  const params = new URLSearchParams();
  params.append('nights', nights.toString());
  if (region) {
    params.append('region', region);
  }
  
  const response = await fetch(`${API_BASE_URL}/mcp/recommended-itineraries/?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recommended itineraries');
  }
  return response.json();
}

export async function getItinerary(id: number) {
  const response = await fetch(`${API_BASE_URL}/itineraries/${id}`);
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

  const response = await fetch(`${API_BASE_URL}/itineraries/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itineraryData),
  });
  if (!response.ok) throw new Error('Failed to create itinerary');
  return response.json();
}