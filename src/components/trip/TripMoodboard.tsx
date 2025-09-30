import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Plus, X, ExternalLink } from 'lucide-react';

interface MoodboardItem {
  id: string;
  type: 'image' | 'link';
  url: string;
  title?: string;
}

export function TripMoodboard() {
  const [items, setItems] = useState<MoodboardItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addItem = () => {
    if (newUrl.trim()) {
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(newUrl);
      setItems([...items, {
        id: `mood-${Date.now()}`,
        type: isImage ? 'image' : 'link',
        url: newUrl,
      }]);
      setNewUrl('');
      setIsAdding(false);
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            Trip Moodboard
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
      <CardContent className="space-y-4">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Input
              placeholder="Image URL or link..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addItem}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt="Moodboard item"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <ExternalLink className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {items.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Add images and links for inspiration</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
