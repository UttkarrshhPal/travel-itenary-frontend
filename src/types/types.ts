// Basic types
export interface Location {
  id: number;
  name: string;
  type: 'city' | 'attraction' | 'hotel' | 'airport';
  region: 'Phuket' | 'Krabi';
  description?: string;
  latitude?: number;
  longitude?: number;
}

export interface Activity {
  id: number;
  name: string;
  description?: string;
  region: 'Phuket' | 'Krabi';
  duration_hours: number;
  price?: number;
  location: Location;
}

// Types for creating a new itinerary
export interface AccommodationCreate {
  hotel_id: number;
  day_number: number;
}

export interface TransferCreate {
  day_number: number;
  from_location: string;
  to_location: string;
  transfer_type: 'car' | 'van' | 'boat' | 'bus';
  duration_hours: number;
}

export interface ItineraryActivityCreate {
  activity_id: number;
  day_number: number;
}

export interface ItineraryFormData {
  name: string;
  duration_nights: number;
  region: 'Phuket' | 'Krabi';
  description: string;
}

export interface ItineraryCreate extends ItineraryFormData {
  is_recommended?: boolean;
  accommodations: AccommodationCreate[];
  transfers: TransferCreate[];
  itinerary_activities: ItineraryActivityCreate[];
}

// Full itinerary type with all relationships
export interface Accommodation {
  day_number: number;
  hotel: Location;
}

export interface Transfer {
  day_number: number;
  from_location: string;
  to_location: string;
  transfer_type: 'car' | 'van' | 'boat' | 'bus';
  duration_hours: number;
}

export interface ItineraryActivity {
  day_number: number;
  activity: Activity;
}

export interface Itinerary extends ItineraryFormData {
  id: number;
  is_recommended: boolean;
  accommodations: Accommodation[];
  transfers: Transfer[];
  activities: ItineraryActivity[];
}

export interface User {
  username: string;
  full_name: string;
  role: string;
}