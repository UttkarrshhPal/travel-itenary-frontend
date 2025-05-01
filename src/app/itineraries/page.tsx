'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ItinerariesPage() {
  const [itineraryId, setItineraryId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (itineraryId) {
      router.push(`/itineraries/${itineraryId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Find Itinerary</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="number"
            value={itineraryId}
            onChange={(e) => setItineraryId(e.target.value)}
            placeholder="Enter itinerary ID"
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
      </Card>
    </div>
  );
}