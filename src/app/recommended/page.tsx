// app/recommended/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getRecommendedItineraries } from '@/lib/api';
import { Itinerary } from '@/types/types';
import ItineraryCard from '@/components/ItineraryCard';
import { Card } from '@/components/ui/card';

export default function RecommendedItineraries() {
  const [nights, setNights] = useState<number>(3);
  const [region, setRegion] = useState<string | undefined>();
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isLoading, error } = useQuery<Itinerary[]>({
    queryKey: ['recommended', nights, region, shouldFetch],
    queryFn: () => getRecommendedItineraries(nights, region),
    enabled: shouldFetch && Boolean(nights >= 2 && nights <= 8)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recommended Itineraries</h1>
      
      <Card className="p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <div className="w-48">
            <Select
              value={nights.toString()}
              onValueChange={(value) => {
                setNights(parseInt(value));
                setShouldFetch(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select nights" />
              </SelectTrigger>
              <SelectContent>
                {[2,3,4,5,6,7,8].map(n => (
                  <SelectItem key={n} value={n.toString()}>{n} Nights</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select
              value={region || "all"}
              onValueChange={(value) => {
                setRegion(value === "all" ? undefined : value);
                setShouldFetch(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Phuket">Phuket</SelectItem>
                <SelectItem value="Krabi">Krabi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit">
            Find Itineraries
          </Button>
        </form>
      </Card>

      {isLoading && (
        <div className="text-center py-8">Loading recommendations...</div>
      )}

      {error && (
        <div className="text-red-500 text-center py-8">
          Error loading recommendations. Please try again.
        </div>
      )}

      {data && data.length === 0 && (
        <div className="text-center py-8">
          No recommendations found for the selected criteria.
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((itinerary) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} />
          ))}
        </div>
      )}
    </div>
  );
}