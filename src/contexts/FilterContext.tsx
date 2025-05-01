// contexts/FilterContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface FilterState {
  region: string | null;
  duration: number | null;
  priceRange: [number, number] | null;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilters: FilterState = {
  region: null,
  duration: null,
  priceRange: null,
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const resetFilters = () => setFilters(initialFilters);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}