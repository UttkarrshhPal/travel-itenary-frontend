// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MapPin, Calendar, Users, Sparkles, ArrowRight, Shield, Clock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    async function checkConnection() {
      try {
        await api.getLocations();
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    }
    checkConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {isConnected === false && (
        <div className="w-full bg-destructive/10 py-2">
          <div className="container mx-auto px-4">
            <Alert variant="destructive" className="border-none bg-transparent">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="ml-2">Connection Error</AlertTitle>
              <AlertDescription className="ml-2">
                Unable to connect to the API server. Please check if the backend is running.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Travel Itinerary System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plan your perfect journey with our intelligent travel planning system. 
            Create custom itineraries or explore our curated recommendations.
          </p>
          {/* Welcome message for logged in users */}
          {user && (
            <div className="mt-6">
              <p className="text-lg">
                Welcome back, <span className="font-semibold text-primary">{user.full_name}</span>!
              </p>
            </div>
          )}
        </div>
        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="text-2xl">Create New Itinerary</CardTitle>
              <CardDescription className="text-base">
                Design your dream vacation with our intuitive planning tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  Plan day-by-day activities
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  Add multiple destinations
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  Share with travel companions
                </li>
              </ul>
              <Link href="/create">
                <Button className="w-full group-hover:shadow-md transition-all">
                  Start Planning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="text-2xl">Recommended Itineraries</CardTitle>
              <CardDescription className="text-base">
                Explore expertly crafted travel plans for popular destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 mr-2 text-primary" />
                  Verified by travel experts
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  Based on traveler reviews
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  Hidden gems included
                </li>
              </ul>
              <Link href="/recommended">
                <Button variant="outline" className="w-full group-hover:shadow-md transition-all">
                  Browse Recommendations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
