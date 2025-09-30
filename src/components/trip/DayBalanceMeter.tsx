import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TripCard } from '@/types/trip';
import { Activity, Coffee } from 'lucide-react';

interface DayBalanceMeterProps {
  cards: TripCard[];
}

export function DayBalanceMeter({ cards }: DayBalanceMeterProps) {
  const balance = useMemo(() => {
    let totalMinutes = 0;
    let activityCount = 0;

    cards.forEach(card => {
      if (card.type === 'activity' || card.type === 'food') {
        activityCount++;
        if ('duration' in card && card.duration) {
          totalMinutes += card.duration;
        }
      }
    });

    // Calculate balance: 0 = relaxed, 100 = very busy
    const score = Math.min(100, (activityCount * 10) + (totalMinutes / 10));
    return score;
  }, [cards]);

  const getBalanceLabel = () => {
    if (balance < 30) return 'Relaxed';
    if (balance < 60) return 'Balanced';
    if (balance < 80) return 'Busy';
    return 'Very Busy';
  };

  const getBalanceColor = () => {
    if (balance < 30) return 'from-green-500 to-emerald-500';
    if (balance < 60) return 'from-blue-500 to-cyan-500';
    if (balance < 80) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Day Balance</span>
          <span className="font-bold">{getBalanceLabel()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-8 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getBalanceColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${balance}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-3">
            <Coffee className="h-4 w-4 text-white" />
            <Activity className="h-4 w-4 text-white" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {balance < 30 && 'Great! You have plenty of time to relax.'}
          {balance >= 30 && balance < 60 && 'Perfect balance between activities and rest.'}
          {balance >= 60 && balance < 80 && 'Packed schedule! Make sure to rest.'}
          {balance >= 80 && 'Very busy day! Consider spacing activities out.'}
        </p>
      </CardContent>
    </Card>
  );
}
