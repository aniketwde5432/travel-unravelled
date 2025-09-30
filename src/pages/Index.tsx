import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Sparkles } from 'lucide-react';
import { TripBoard } from '@/components/trip/TripBoard';
import { TripCard, Trip } from '@/types/trip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [trip, setTrip] = useState<Trip>({
    id: 'trip-1',
    name: 'Dream Vacation',
    destination: 'Paris & Tokyo',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    cards: [],
    budget: 5000,
  });

  const handleUpdateCards = (cards: TripCard[]) => {
    setTrip(prev => ({ ...prev, cards }));
  };

  const handleUpdateTrip = (field: keyof Trip, value: any) => {
    setTrip(prev => ({ ...prev, [field]: value }));
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
                    value={trip.name}
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
                    value={trip.destination}
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
                      value={trip.startDate}
                      onChange={(e) => handleUpdateTrip('startDate', e.target.value)}
                    />
                    <span className="self-center">-</span>
                    <Input
                      type="date"
                      value={trip.endDate}
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
                    value={trip.budget || ''}
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
          cards={trip.cards}
          onUpdateCards={handleUpdateCards}
          budget={trip.budget}
        />
      </main>
    </div>
  );
};

export default Index;
