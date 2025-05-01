// contexts/ItineraryContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { Itinerary } from '@/types/types';

interface ItineraryContextType {
  selectedItinerary: Itinerary | null;
  setSelectedItinerary: (itinerary: Itinerary | null) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ItineraryContext.Provider
      value={{
        selectedItinerary,
        setSelectedItinerary,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}