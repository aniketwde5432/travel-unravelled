import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trip } from '@/types/trip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Calendar, Trash2, Plus } from 'lucide-react';

interface TripManagerProps {
  trips: Trip[];
  currentTripId: string;
  onSelectTrip: (tripId: string) => void;
  onCreateTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TripManager({
  trips,
  currentTripId,
  onSelectTrip,
  onCreateTrip,
  onDeleteTrip,
  open,
  onOpenChange,
}: TripManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTrip, setNewTrip] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
  });

  const handleCreateTrip = () => {
    if (newTrip.name && newTrip.destination) {
      const trip: Trip = {
        id: `trip-${Date.now()}`,
        name: newTrip.name,
        destination: newTrip.destination,
        startDate: newTrip.startDate || new Date().toISOString().split('T')[0],
        endDate: newTrip.endDate || new Date().toISOString().split('T')[0],
        cards: [],
        budget: 0,
      };
      onCreateTrip(trip);
      setNewTrip({ name: '', destination: '', startDate: '', endDate: '' });
      setIsCreating(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Trips</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4">
            <AnimatePresence>
              {trips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all group ${
                    trip.id === currentTripId
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => {
                    onSelectTrip(trip.id);
                    onOpenChange(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{trip.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {trip.destination}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {trip.cards.length} cards
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTrip(trip.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isCreating ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-lg border-2 border-dashed border-primary space-y-3"
              >
                <div>
                  <Label>Trip Name *</Label>
                  <Input
                    value={newTrip.name}
                    onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
                    placeholder="My Dream Vacation"
                  />
                </div>
                <div>
                  <Label>Destination *</Label>
                  <Input
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    placeholder="Paris, Tokyo..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newTrip.endDate}
                      onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateTrip}>Create Trip</Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Trip
              </Button>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
