import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Package } from 'lucide-react';

interface PackingItem {
  id: string;
  text: string;
  checked: boolean;
}

interface PackingChecklistProps {
  tripDuration: number;
}

const generateDefaultItems = (duration: number): PackingItem[] => {
  const items = [
    'Passport & ID',
    'Travel tickets',
    'Hotel confirmations',
    'Travel insurance',
    'Phone & charger',
    'Medications',
    'Toiletries',
    'Comfortable shoes',
    'Weather-appropriate clothing',
    'Camera',
  ];

  if (duration > 7) {
    items.push('Laundry supplies', 'Extra bags', 'Travel adapter');
  }

  return items.map((text, idx) => ({
    id: `item-${idx}`,
    text,
    checked: false,
  }));
};

export function PackingChecklist({ tripDuration }: PackingChecklistProps) {
  const [items, setItems] = useState<PackingItem[]>(generateDefaultItems(tripDuration));
  const [newItemText, setNewItemText] = useState('');

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addItem = () => {
    if (newItemText.trim()) {
      setItems([...items, {
        id: `item-${Date.now()}`,
        text: newItemText,
        checked: false
      }]);
      setNewItemText('');
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const progress = items.length > 0 
    ? Math.round((items.filter(i => i.checked).length / items.length) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Packing Checklist</CardTitle>
          </div>
          <div className="text-sm font-medium text-primary">
            {progress}% Complete
          </div>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 group"
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
                className="data-[state=checked]:animate-scale-in"
              />
              <span className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                {item.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex gap-2 pt-3 border-t">
          <Input
            placeholder="Add new item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <Button onClick={addItem} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
