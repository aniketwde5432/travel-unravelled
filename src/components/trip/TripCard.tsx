import { motion } from 'framer-motion';
import { Plane, Hotel, UtensilsCrossed, Map, StickyNote, Clock, DollarSign, MapPin, X, Link } from 'lucide-react';
import { TripCard as TripCardType } from '@/types/trip';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TripCardProps {
  card: TripCardType;
  onUpdate: (card: TripCardType) => void;
  onDelete: (id: string) => void;
  onConnect: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const iconMap = {
  flight: Plane,
  stay: Hotel,
  food: UtensilsCrossed,
  activity: Map,
  note: StickyNote,
};

const colorMap = {
  flight: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800',
  stay: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800',
  food: 'from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800',
  activity: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800',
  note: 'from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800',
};

export function TripCard({ card, onUpdate, onDelete, onConnect, isSelected, onSelect }: TripCardProps) {
  const Icon = iconMap[card.type];
  
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateFlightDuration = (departureTime?: string, arrivalTime?: string) => {
    if (!departureTime || !arrivalTime) return null;
    const start = new Date(`2000-01-01 ${departureTime}`);
    const end = new Date(`2000-01-01 ${arrivalTime}`);
    const diffMinutes = Math.abs((end.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = Math.floor(diffMinutes % 60);
    return `${hours}h ${minutes}m`;
  };

  const renderCardContent = () => {
    switch (card.type) {
      case 'flight':
        const duration = calculateFlightDuration(card.departureTime, card.arrivalTime);
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{card.departure}</span>
              <Plane className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{card.arrival}</span>
            </div>
            {duration && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{duration}</span>
              </div>
            )}
          </div>
        );
      
      case 'stay':
        const nights = calculateNights(card.checkIn, card.checkOut);
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              <span className="font-medium">{card.location}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(card.checkIn).toLocaleDateString()} - {new Date(card.checkOut).toLocaleDateString()}
              <span className="ml-1">({nights} {nights === 1 ? 'night' : 'nights'})</span>
            </div>
          </div>
        );
      
      case 'food':
      case 'activity':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              <span className="font-medium">{card.location}</span>
            </div>
            {card.duration && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{card.duration} min</span>
              </div>
            )}
          </div>
        );
      
      case 'note':
        return (
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {card.content}
          </div>
        );
    }
  };

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return null;
    const startDate = new Date(`2000-01-01 ${start}`);
    const endDate = new Date(`2000-01-01 ${end}`);
    const diffMinutes = Math.abs((endDate.getTime() - startDate.getTime()) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = Math.floor(diffMinutes % 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-card-hover)' }}
      className={cn(
        'relative w-56 rounded-xl border-2 bg-gradient-to-br backdrop-blur-sm transition-all cursor-pointer overflow-hidden',
        colorMap[card.type],
        isSelected && 'ring-4 ring-[hsl(var(--thread-red))] ring-opacity-50'
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
      onClick={() => onSelect(card.id)}
    >
      {/* Image Header */}
      {card.imageUrl && (
        <div className="w-full h-24 overflow-hidden -mt-0 mb-2">
          <img 
            src={card.imageUrl} 
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className={`flex items-start justify-between mb-3 ${card.imageUrl ? '' : 'p-4 pb-0'} ${!card.imageUrl ? '' : 'px-4'}`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-background/50">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">{card.title}</h3>
            <span className="text-xs text-muted-foreground capitalize">{card.type}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-[hsl(var(--thread-red))]/10"
            onClick={(e) => {
              e.stopPropagation();
              onConnect(card.id);
            }}
          >
            <Link className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3 px-4">
        {renderCardContent()}
        
        {/* Custom Time Display */}
        {(card.startTime || card.endTime) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pt-2 border-t">
            <Clock className="h-3 w-3" />
            {card.startTime && <span>{card.startTime}</span>}
            {card.startTime && card.endTime && <span>→</span>}
            {card.endTime && <span>{card.endTime}</span>}
            {card.startTime && card.endTime && (
              <span className="ml-1">({calculateDuration(card.startTime, card.endTime)})</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {card.cost !== undefined && (
        <div className="flex items-center gap-1 text-sm font-medium text-primary pt-2 border-t px-4 pb-4">
          <DollarSign className="h-4 w-4" />
          <span>${card.cost.toLocaleString()}</span>
        </div>
      )}

      {/* Connection points */}
      {isSelected && (
        <>
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[hsl(var(--thread-red))] shadow-[0_0_10px_hsl(var(--thread-red))] animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[hsl(var(--thread-red))] shadow-[0_0_10px_hsl(var(--thread-red))] animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[hsl(var(--thread-red))] shadow-[0_0_10px_hsl(var(--thread-red))] animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-[hsl(var(--thread-red))] shadow-[0_0_10px_hsl(var(--thread-red))] animate-pulse" />
        </>
      )}
    </motion.div>
  );
}
