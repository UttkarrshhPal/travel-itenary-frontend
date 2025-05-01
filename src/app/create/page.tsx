'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { ItineraryCreate, TransferCreate, ItineraryActivityCreate } from '@/types/types';
import { useRouter } from 'next/navigation';

export default function CreateItineraryPage() {
  const router = useRouter();
  
  // Hardcoded values from seed data
  const hotels = [
    { id: 2, name: "Marina Phuket Resort", region: "PHUKET" },
    { id: 3, name: "Krabi Resort", region: "KRABI" }
  ];
  
  const transferLocations = [
    // Phuket locations
    { id: 1, name: "Phuket Airport", type: "AIRPORT", region: "PHUKET" },
    { id: 2, name: "Marina Phuket Resort", type: "HOTEL", region: "PHUKET" },
    { id: 4, name: "Phi Phi Islands", type: "ATTRACTION", region: "PHUKET" },
    // Krabi locations
    { id: 5, name: "Krabi Airport", type: "AIRPORT", region: "KRABI" },
    { id: 3, name: "Krabi Resort", type: "HOTEL", region: "KRABI" },
    { id: 6, name: "Ao Nang Beach", type: "ATTRACTION", region: "KRABI" },
    { id: 7, name: "Railay Beach", type: "ATTRACTION", region: "KRABI" }
  ];
  
  const activities = [
    { 
      id: 1, 
      name: "Phi Phi Island Hopping", 
      duration_hours: 8, 
      price: 100.0,
      region: "PHUKET" 
    },
    {
      id: 2,
      name: "Railay Beach Rock Climbing",
      duration_hours: 4,
      price: 80.0,
      region: "KRABI"
    },
    {
      id: 3,
      name: "Four Islands Tour",
      duration_hours: 6,
      price: 90.0,
      region: "KRABI"
    }
  ];

  const [formData, setFormData] = useState<ItineraryCreate>({
    name: '',
    duration_nights: 3,
    region: 'Phuket',
    description: '',
    is_recommended: false,
    accommodations: Array.from({ length: 3 }, (_, i) => ({
      hotel_id: 2,
      day_number: i + 1
    })),
    transfers: [
      {
        day_number: 1,
        from_location: "Phuket Airport",
        to_location: "Marina Phuket Resort",
        transfer_type: "car",
        duration_hours: 1
      },
      {
        day_number: 4, // Initial duration (3) + 1
        from_location: "Marina Phuket Resort",
        to_location: "Phuket Airport",
        transfer_type: "car",
        duration_hours: 1
      }
    ],
    itinerary_activities: []
  });

  const handleDurationChange = (newDuration: number) => {
    // Update accommodations for each night
    const newAccommodations = Array.from(
      { length: newDuration },
      (_, i) => ({
        hotel_id: formData.accommodations[i]?.hotel_id || 2,
        day_number: i + 1
      })
    );

    // Keep arrival transfer on day 1, update departure transfer to the day after last night
    const newTransfers = [
      {
        ...formData.transfers[0],
        day_number: 1
      },
      {
        ...formData.transfers[1],
        day_number: newDuration + 1 // This makes departure day dynamic based on duration
      }
    ];

    // Update form data with new duration and updated arrays
    setFormData(prev => ({
      ...prev,
      duration_nights: newDuration,
      accommodations: newAccommodations,
      transfers: newTransfers
    }));
  };

  const handleRegionChange = (newRegion: 'Phuket' | 'Krabi') => {
    // Get the default hotel ID for the new region
    const defaultHotel = hotels.find(h => h.region === newRegion.toUpperCase());
    const defaultHotelId = defaultHotel?.id || (newRegion === 'Phuket' ? 2 : 3);
    
    // Get the default airport for the new region
    const airport = transferLocations.find(
      loc => loc.type === "AIRPORT" && loc.region === newRegion.toUpperCase()
    )?.name || `${newRegion} Airport`;

    // Update accommodations with the new default hotel
    const newAccommodations = Array.from(
      { length: formData.duration_nights },
      (_, i) => ({
        hotel_id: defaultHotelId,
        day_number: i + 1
      })
    );

    // Update transfers with the appropriate airport and hotel
    const newTransfers = [
      {
        ...formData.transfers[0],
        from_location: airport,
        to_location: defaultHotel?.name || "",
      },
      {
        ...formData.transfers[1],
        from_location: defaultHotel?.name || "",
        to_location: airport,
      }
    ];

    setFormData(prev => ({
      ...prev,
      region: newRegion,
      accommodations: newAccommodations,
      transfers: newTransfers,
      // Reset activities when changing region
      itinerary_activities: []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.createItinerary(formData);
      if (response?.id) {
        router.push(`/itineraries/${response.id}`);
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
    }
  };

  const updateAccommodation = (dayNumber: number, hotelId: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map(acc =>
        acc.day_number === dayNumber ? { ...acc, hotel_id: hotelId } : acc
      )
    }));
  };

  const updateTransfer = (index: number, field: keyof TransferCreate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      transfers: prev.transfers.map((transfer, i) =>
        i === index ? { ...transfer, [field]: value } : transfer
      )
    }));
  };

  const addActivity = () => {
    if (formData.duration_nights === 0) return;
    
    setFormData(prev => ({
      ...prev,
      itinerary_activities: [
        ...prev.itinerary_activities,
        {
          activity_id: activities[0]?.id || 0,
          day_number: 1
        }
      ]
    }));
  };

  const updateActivity = (index: number, field: keyof ItineraryActivityCreate, value: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary_activities: prev.itinerary_activities.map((activity, i) =>
        i === index ? { ...activity, [field]: value } : activity
      )
    }));
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary_activities: prev.itinerary_activities.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Itinerary</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Name</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter itinerary name"
            />
          </div>

          <div>
            <label className="block mb-2">Duration (Nights)</label>
            <Input
              type="number"
              required
              min={1}
              max={14}
              value={formData.duration_nights}
              onChange={(e) => handleDurationChange(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-2">Region</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.region}
              onChange={(e) => handleRegionChange(e.target.value as 'Phuket' | 'Krabi')}
            >
              <option value="Phuket">Phuket</option>
              <option value="Krabi">Krabi</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter itinerary description"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Accommodations</h2>
            {formData.accommodations.map((acc) => (
              <div key={acc.day_number} className="flex gap-4 items-center">
                <span className="w-24">Day {acc.day_number}:</span>
                <select
                  className="flex-1 p-2 border rounded"
                  value={acc.hotel_id}
                  onChange={(e) => updateAccommodation(acc.day_number, parseInt(e.target.value))}
                >
                  {hotels
                    .filter(hotel => hotel.region === formData.region.toUpperCase())
                    .map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Transfers</h2>
            {formData.transfers.map((transfer, index) => (
              <div key={index} className="space-y-2 p-4 border rounded">
                <div className="flex gap-2 items-center">
                  <span className="w-24">Day {transfer.day_number}:</span>
                  <select
                    className="flex-1 p-2 border rounded"
                    value={transfer.from_location}
                    onChange={(e) => updateTransfer(index, 'from_location', e.target.value)}
                  >
                    {transferLocations
                      .filter(loc => loc.region === formData.region.toUpperCase())
                      .map(loc => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                  </select>
                  <span className="mx-2">to</span>
                  <select
                    className="flex-1 p-2 border rounded"
                    value={transfer.to_location}
                    onChange={(e) => updateTransfer(index, 'to_location', e.target.value)}
                  >
                    {transferLocations
                      .filter(loc => loc.region === formData.region.toUpperCase())
                      .map(loc => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <select
                    className="p-2 border rounded"
                    value={transfer.transfer_type}
                    onChange={(e) => updateTransfer(index, 'transfer_type', e.target.value)}
                  >
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="boat">Boat</option>
                    <option value="bus">Bus</option>
                  </select>
                  <Input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={transfer.duration_hours}
                    onChange={(e) => updateTransfer(index, 'duration_hours', parseFloat(e.target.value))}
                    placeholder="Duration (hours)"
                    className="w-32"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Activities</h2>
              <Button type="button" onClick={addActivity} variant="outline">
                Add Activity
              </Button>
            </div>
            {formData.itinerary_activities.map((activity, index) => (
              <div key={index} className="flex gap-4 items-center p-4 border rounded">
                <select
                  className="flex-1 p-2 border rounded"
                  value={activity.day_number}
                  onChange={(e) => updateActivity(index, 'day_number', parseInt(e.target.value))}
                >
                  {Array.from({ length: formData.duration_nights }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Day {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  className="flex-1 p-2 border rounded"
                  value={activity.activity_id}
                  onChange={(e) => updateActivity(index, 'activity_id', parseInt(e.target.value))}
                >
                  {activities
                    .filter(act => act.region === formData.region.toUpperCase())
                    .map(act => (
                      <option key={act.id} value={act.id}>
                        {act.name} ({act.duration_hours}h)
                      </option>
                    ))}
                </select>
                <Button 
                  type="button"
                  variant="destructive"
                  onClick={() => removeActivity(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">
            Create Itinerary
          </Button>
        </form>
      </Card>
    </div>
  );
}