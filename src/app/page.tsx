// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        await api.getLocations();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        console.error("API connection failed:", error);
      }
    }
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {isConnected === false && (
        <div className="w-full bg-destructive/10 py-2">
          <div className="container mx-auto px-4">
            <Alert variant="destructive" className="border-none bg-transparent">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="ml-2">Error</AlertTitle>
              <AlertDescription className="ml-2">
                Unable to connect to the API server. Please check if the backend
                is running.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Travel Itinerary System</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Create New Itinerary
            </h2>
            <p className="mb-4">Plan your custom travel itinerary</p>
            <Link href="/create">
              <Button>Create Itinerary</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Recommended Itineraries
            </h2>
            <p className="mb-4">View our curated travel plans</p>
            <Link href="/recommended">
              <Button>View Recommendations</Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
