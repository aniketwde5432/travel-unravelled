import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, AlertCircle, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCard } from '@/types/trip';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BudgetDashboardProps {
  cards: TripCard[];
  budget?: number;
}

const COLORS = {
  flight: 'hsl(210, 45%, 65%)',
  stay: 'hsl(270, 50%, 65%)',
  food: 'hsl(25, 70%, 60%)',
  activity: 'hsl(160, 50%, 55%)',
  note: 'hsl(45, 70%, 65%)',
};

export function BudgetDashboard({ cards, budget }: BudgetDashboardProps) {
  const totalSpent = cards.reduce((sum, card) => sum + (card.cost || 0), 0);
  
  const categoryBreakdown = cards.reduce((acc, card) => {
    if (card.cost) {
      acc[card.type] = (acc[card.type] || 0) + card.cost;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: COLORS[name as keyof typeof COLORS],
  }));

  const isOverBudget = budget ? totalSpent > budget : false;
  const percentageUsed = budget ? (totalSpent / budget) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Total Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={isOverBudget ? 'border-destructive animate-pulse' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">${totalSpent.toLocaleString()}</span>
                {budget && (
                  <span className="text-sm text-muted-foreground">of ${budget.toLocaleString()}</span>
                )}
              </div>
              
              {budget && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        isOverBudget ? 'bg-destructive' : 'bg-primary'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  
                  {isOverBudget && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-sm text-destructive"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Over budget by ${(totalSpent - budget).toLocaleString()}</span>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg">
                              <p className="text-sm font-medium">{payload[0].name}</p>
                              <p className="text-sm text-primary font-bold">
                                ${payload[0].value?.toLocaleString()}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Category List */}
              <div className="mt-4 space-y-2">
                {chartData.map((category) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="font-medium">${category.value.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Items</span>
              <span className="font-medium">{cards.filter(c => c.cost).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Cost</span>
              <span className="font-medium">
                ${Math.round(totalSpent / Math.max(cards.filter(c => c.cost).length, 1)).toLocaleString()}
              </span>
            </div>
            {budget && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className={cn('font-medium', isOverBudget && 'text-destructive')}>
                  ${Math.abs(budget - totalSpent).toLocaleString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
