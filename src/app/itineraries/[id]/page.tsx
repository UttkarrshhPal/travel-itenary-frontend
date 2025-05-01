// app/itineraries/[id]/page.tsx
import ItineraryView from "@/components/ItineraryView";

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  return <ItineraryView id={resolvedParams.id} />;
}
