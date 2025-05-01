// components/ItineraryCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Itinerary } from "@/types/types";

interface Props {
  itinerary: Itinerary;
}

export default function ItineraryCard({ itinerary }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{itinerary.name}</CardTitle>
          <Badge>{itinerary.region}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          {itinerary.duration_nights} nights - {itinerary.description}
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Accommodations:</h3>
            <ul className="list-disc list-inside text-sm">
              {itinerary.accommodations.map((acc) => (
                <li key={acc.day_number}>
                  Day {acc.day_number}: {acc.hotel.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Activities:</h3>
            <ul className="list-disc list-inside text-sm">
              {itinerary.activities.map((act) => (
                <li key={`${act.day_number}-${act.activity.id}`}>
                  Day {act.day_number}: {act.activity.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Transfers:</h3>
            <ul className="list-disc list-inside text-sm">
              {itinerary.transfers.map((transfer, index) => (
                <li key={index}>
                  Day {transfer.day_number}: {transfer.from_location} to{' '}
                  {transfer.to_location} ({transfer.transfer_type})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}