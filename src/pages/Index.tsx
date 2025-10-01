import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Sparkles, FolderOpen } from 'lucide-react';
import { TripBoard } from '@/components/trip/TripBoard';
import { TripCard, Trip } from '@/types/trip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TripManager } from '@/components/trip/TripManager';
import { PackingChecklist } from '@/components/trip/PackingChecklist';
import { DayBalanceMeter } from '@/components/trip/DayBalanceMeter';
import { DocumentHub } from '@/components/trip/DocumentHub';
import { LocalTips } from '@/components/trip/LocalTips';
import { TripMoodboard } from '@/components/trip/TripMoodboard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [trips, setTrips] = useState<Trip[]>([{
    id: 'trip-1',
    name: 'Dream Vacation',
    destination: 'Paris & Tokyo',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    cards: [],
    budget: 5000,
  }]);
  const [currentTripId, setCurrentTripId] = useState('trip-1');
  const [isTripManagerOpen, setIsTripManagerOpen] = useState(false);

  const currentTrip = trips.find(t => t.id === currentTripId) || trips[0];

  const handleUpdateCards = (cards: TripCard[]) => {
    setTrips(prev => prev.map(t => 
      t.id === currentTripId ? { ...t, cards } : t
    ));
  };

  const handleUpdateTrip = (field: keyof Trip, value: any) => {
    setTrips(prev => prev.map(t => 
      t.id === currentTripId ? { ...t, [field]: value } : t
    ));
  };

  const handleCreateTrip = (trip: Trip) => {
    setTrips(prev => [...prev, trip]);
    setCurrentTripId(trip.id);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (trips.length > 1) {
      setTrips(prev => prev.filter(t => t.id !== tripId));
      if (currentTripId === tripId) {
        setCurrentTripId(trips.find(t => t.id !== tripId)?.id || trips[0].id);
      }
    }
  };

  const getTripDuration = () => {
    const start = new Date(currentTrip.startDate);
    const end = new Date(currentTrip.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] shadow-[var(--shadow-glow)]">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
                  TripCanvas
                </h1>
                <p className="text-xs text-muted-foreground">
                  Visual Trip Planning & Storytelling
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsTripManagerOpen(true)}
              className="gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Manage Trips ({trips.length})
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Trip Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b bg-card"
      >
        <div className="container mx-auto px-6 py-4">
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="tripName" className="text-xs text-muted-foreground mb-1">
                    Trip Name
                  </Label>
                  <Input
                    id="tripName"
                    value={currentTrip.name}
                    onChange={(e) => handleUpdateTrip('name', e.target.value)}
                    className="font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Destination
                  </Label>
                  <Input
                    value={currentTrip.destination}
                    onChange={(e) => handleUpdateTrip('destination', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Dates
                  </Label>
                  <div className="flex gap-2 text-sm">
                    <Input
                      type="date"
                      value={currentTrip.startDate}
                      onChange={(e) => handleUpdateTrip('startDate', e.target.value)}
                    />
                    <span className="self-center">-</span>
                    <Input
                      type="date"
                      value={currentTrip.endDate}
                      onChange={(e) => handleUpdateTrip('endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget" className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Budget
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={currentTrip.budget || ''}
                    onChange={(e) => handleUpdateTrip('budget', parseFloat(e.target.value) || undefined)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <TripBoard
          cards={currentTrip.cards}
          onUpdateCards={handleUpdateCards}
          budget={currentTrip.budget}
        />

        {/* Floating Tools Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="fixed right-6 bottom-6 z-50 shadow-lg"
            >
              Tools & Planning
            </Button>
          </SheetTrigger>
            <SheetContent className="w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Trip Tools</SheetTitle>
              </SheetHeader>
              <Tabs defaultValue="planning" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="planning">Planning</TabsTrigger>
                  <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="planning" className="space-y-4 mt-4">
                  <DayBalanceMeter cards={currentTrip.cards} />
                  <PackingChecklist tripDuration={getTripDuration()} />
                  <LocalTips destination={currentTrip.destination} />
                  <DocumentHub />
                </TabsContent>
                
                <TabsContent value="inspiration" className="space-y-4 mt-4">
                  <TripMoodboard />
                </TabsContent>
              </Tabs>
            </SheetContent>
        </Sheet>
      </main>

      {/* Trip Manager Dialog */}
      <TripManager
        trips={trips}
        currentTripId={currentTripId}
        onSelectTrip={setCurrentTripId}
        onCreateTrip={handleCreateTrip}
        onDeleteTrip={handleDeleteTrip}
        open={isTripManagerOpen}
        onOpenChange={setIsTripManagerOpen}
      />
    </div>
  );
};

export default Index;
