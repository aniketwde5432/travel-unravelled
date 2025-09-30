import { useState } from 'react';
import { CardType, TripCard, Position } from '@/types/trip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Hotel, UtensilsCrossed, Map, StickyNote } from 'lucide-react';

interface CreateCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCard: (card: TripCard) => void;
}

export function CreateCardDialog({ open, onOpenChange, onCreateCard }: CreateCardDialogProps) {
  const [cardType, setCardType] = useState<CardType>('flight');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleCreate = () => {
    const baseCard = {
      id: `card-${Date.now()}`,
      type: cardType,
      position: { x: 100, y: 100 } as Position,
      title: formData.title || 'Untitled',
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
    };

    let card: TripCard;

    switch (cardType) {
      case 'flight':
        card = {
          ...baseCard,
          type: 'flight',
          departure: formData.departure || '',
          arrival: formData.arrival || '',
          departureTime: formData.departureTime,
          arrivalTime: formData.arrivalTime,
        };
        break;
      case 'stay':
        card = {
          ...baseCard,
          type: 'stay',
          checkIn: formData.checkIn || '',
          checkOut: formData.checkOut || '',
          location: formData.location || '',
        };
        break;
      case 'food':
        card = {
          ...baseCard,
          type: 'food',
          location: formData.location || '',
          cuisine: formData.cuisine,
          time: formData.time,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
        };
        break;
      case 'activity':
        card = {
          ...baseCard,
          type: 'activity',
          location: formData.location || '',
          time: formData.time,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          category: formData.category,
        };
        break;
      case 'note':
        card = {
          ...baseCard,
          type: 'note',
          content: formData.content || '',
        };
        break;
    }

    onCreateCard(card);
    setFormData({});
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
          <DialogDescription>
            Add a new item to your trip planning board
          </DialogDescription>
        </DialogHeader>

        <Tabs value={cardType} onValueChange={(v) => setCardType(v as CardType)}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="flight" className="gap-2">
              <Plane className="h-4 w-4" />
              Flight
            </TabsTrigger>
            <TabsTrigger value="stay" className="gap-2">
              <Hotel className="h-4 w-4" />
              Stay
            </TabsTrigger>
            <TabsTrigger value="food" className="gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Food
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Map className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="note" className="gap-2">
              <StickyNote className="h-4 w-4" />
              Note
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-4">
            {/* Common Fields */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter title"
                value={formData.title || ''}
                onChange={(e) => updateFormData('title', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0.00"
                value={formData.cost || ''}
                onChange={(e) => updateFormData('cost', e.target.value)}
              />
            </div>

            {/* Flight Fields */}
            <TabsContent value="flight" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure">Departure *</Label>
                  <Input
                    id="departure"
                    placeholder="e.g., JFK"
                    value={formData.departure || ''}
                    onChange={(e) => updateFormData('departure', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="arrival">Arrival *</Label>
                  <Input
                    id="arrival"
                    placeholder="e.g., CDG"
                    value={formData.arrival || ''}
                    onChange={(e) => updateFormData('arrival', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime || ''}
                    onChange={(e) => updateFormData('departureTime', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.arrivalTime || ''}
                    onChange={(e) => updateFormData('arrivalTime', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Stay Fields */}
            <TabsContent value="stay" className="space-y-4 mt-0">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Hotel name or address"
                  value={formData.location || ''}
                  onChange={(e) => updateFormData('location', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in *</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn || ''}
                    onChange={(e) => updateFormData('checkIn', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out *</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut || ''}
                    onChange={(e) => updateFormData('checkOut', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Food Fields */}
            <TabsContent value="food" className="space-y-4 mt-0">
              <div>
                <Label htmlFor="location">Restaurant/Location *</Label>
                <Input
                  id="location"
                  placeholder="Restaurant name"
                  value={formData.location || ''}
                  onChange={(e) => updateFormData('location', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cuisine">Cuisine</Label>
                  <Input
                    id="cuisine"
                    placeholder="e.g., Italian"
                    value={formData.cuisine || ''}
                    onChange={(e) => updateFormData('cuisine', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={formData.duration || ''}
                    onChange={(e) => updateFormData('duration', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Activity Fields */}
            <TabsContent value="activity" className="space-y-4 mt-0">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Activity location"
                  value={formData.location || ''}
                  onChange={(e) => updateFormData('location', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Museum"
                    value={formData.category || ''}
                    onChange={(e) => updateFormData('category', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="120"
                    value={formData.duration || ''}
                    onChange={(e) => updateFormData('duration', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Note Fields */}
            <TabsContent value="note" className="space-y-4 mt-0">
              <div>
                <Label htmlFor="content">Note Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your note here..."
                  rows={5}
                  value={formData.content || ''}
                  onChange={(e) => updateFormData('content', e.target.value)}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Card
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
