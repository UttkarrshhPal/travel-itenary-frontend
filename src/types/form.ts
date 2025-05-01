// types/form.ts
import { z } from 'zod';

export type Region = 'Phuket' | 'Krabi';
export type TransferType = 'car' | 'van' | 'boat' | 'bus';

export const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  duration_nights: z.number().min(2).max(8),
  region: z.enum(['Phuket', 'Krabi'] as const),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  is_recommended: z.boolean().default(false),
  accommodations: z.array(z.object({
    hotel_id: z.number(),
    day_number: z.number()
  })),
  transfers: z.array(z.object({
    day_number: z.number(),
    from_location: z.string(),
    to_location: z.string(),
    transfer_type: z.enum(['car', 'van', 'boat', 'bus'] as const),
    duration_hours: z.number()
  })),
  itinerary_activities: z.array(z.object({
    activity_id: z.number(),
    day_number: z.number()
  }))
});

export type ItineraryFormValues = z.infer<typeof formSchema>;