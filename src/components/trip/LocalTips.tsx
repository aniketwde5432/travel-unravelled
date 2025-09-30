import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Plus, X } from 'lucide-react';

interface Tip {
  id: string;
  content: string;
  isAuto: boolean;
}

const autoTips = [
  '🙏 Learn basic greetings in the local language',
  '💰 Always carry some local currency',
  '📱 Download offline maps before you go',
  '🚕 Research local transportation options',
  '🍽️ Try local street food (safely!)',
  '⏰ Be mindful of cultural customs and timing',
];

export function LocalTips({ destination }: { destination: string }) {
  const [tips, setTips] = useState<Tip[]>(
    autoTips.slice(0, 3).map((content, idx) => ({
      id: `auto-${idx}`,
      content,
      isAuto: true,
    }))
  );
  const [newTip, setNewTip] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addTip = () => {
    if (newTip.trim()) {
      setTips([...tips, {
        id: `tip-${Date.now()}`,
        content: newTip,
        isAuto: false,
      }]);
      setNewTip('');
      setIsAdding(false);
    }
  };

  const removeTip = (id: string) => {
    setTips(tips.filter(t => t.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Local Tips & Notes
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {tips.map((tip, idx) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group"
            >
              <div className={`p-3 rounded-lg text-sm ${
                tip.isAuto 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-muted'
              }`}>
                {tip.content}
              </div>
              {!tip.isAuto && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  onClick={() => removeTip(tip.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Textarea
              placeholder="Add your own tip or note..."
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addTip}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
