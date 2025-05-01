'use client';

import { useQuery } from '@tanstack/react-query';
import { getItinerary } from '@/lib/api';
import { Itinerary } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ItineraryViewProps {
  id: string;
}

export default function ItineraryView({ id }: ItineraryViewProps) {
  const { data: itinerary, isLoading, error } = useQuery<Itinerary>({
    queryKey: ['itinerary', id],
    queryFn: () => getItinerary(parseInt(id)),
  });

  if (isLoading) return <ItineraryPageSkeleton />;
  if (error) return <div>Error loading itinerary</div>;
  if (!itinerary) return <div>Itinerary not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{itinerary.name}</h1>
          <p className="text-gray-600 mt-2">{itinerary.description}</p>
        </div>
        <Badge>{itinerary.region}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Accommodations</h2>
          <div className="space-y-2">
            {itinerary.accommodations.map((acc) => (
              <div key={acc.day_number} className="flex justify-between">
                <span>Day {acc.day_number}</span>
                <span>{acc.hotel.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Activities</h2>
          <div className="space-y-2">
            {itinerary.activities.map((act) => (
              <div key={`${act.day_number}-${act.activity.id}`}>
                <div className="flex justify-between">
                  <span>Day {act.day_number}</span>
                  <span>{act.activity.name}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {act.activity.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Transfers</h2>
          <div className="space-y-2">
            {itinerary.transfers.map((transfer, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>Day {transfer.day_number}</span>
                <div className="flex items-center space-x-2">
                  <span>{transfer.from_location}</span>
                  <span>→</span>
                  <span>{transfer.to_location}</span>
                </div>
                <Badge variant="secondary">
                  {transfer.transfer_type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ItineraryPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}