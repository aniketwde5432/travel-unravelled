import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, Clock } from 'lucide-react';
import { TripCard, ViewMode, TripCard as TripCardType, Position } from '@/types/trip';
import { TripCard as TripCardComponent } from './TripCard';
import { Button } from '@/components/ui/button';
import { BudgetDashboard } from './BudgetDashboard';
import { CreateCardDialog } from './CreateCardDialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TripBoardProps {
  cards: TripCard[];
  onUpdateCards: (cards: TripCard[]) => void;
  budget?: number;
}

export function TripBoard({ cards, onUpdateCards, budget }: TripBoardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleUpdateCard = (updatedCard: TripCardType) => {
    onUpdateCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const handleDeleteCard = (id: string) => {
    onUpdateCards(cards.filter(c => c.id !== id));
  };

  const handleConnect = (id: string) => {
    if (!connectingFrom) {
      setConnectingFrom(id);
    } else if (connectingFrom !== id) {
      const fromCard = cards.find(c => c.id === connectingFrom);
      if (fromCard) {
        const updatedCard = {
          ...fromCard,
          connections: [...(fromCard.connections || []), id]
        };
        handleUpdateCard(updatedCard);
      }
      setConnectingFrom(null);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedCard(id);
  };

  const handleDragEnd = (id: string, newPosition: Position) => {
    const card = cards.find(c => c.id === id);
    if (card) {
      handleUpdateCard({ ...card, position: newPosition });
    }
    setDraggedCard(null);
  };

  const handleCreateCard = (card: TripCardType) => {
    onUpdateCards([...cards, card]);
    setIsCreateDialogOpen(false);
  };

  const renderConnections = () => {
    return cards.flatMap(card => 
      (card.connections || []).map(targetId => {
        const target = cards.find(c => c.id === targetId);
        if (!target) return null;

        const startX = card.position.x + 112; // Half of card width (224px / 2)
        const startY = card.position.y + 100;  // Approximate card center
        const endX = target.position.x + 112;
        const endY = target.position.y + 100;

        // Create smooth bezier curve
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const controlOffset = Math.abs(endX - startX) * 0.3;
        
        const pathData = `M ${startX} ${startY} Q ${midX} ${midY - controlOffset}, ${endX} ${endY}`;

        return (
          <g key={`${card.id}-${targetId}`}>
            <motion.path
              d={pathData}
              stroke="hsl(var(--thread-red))"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ 
                duration: 0.8,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              style={{
                filter: 'drop-shadow(0 0 6px hsl(var(--thread-glow))) drop-shadow(0 0 12px hsl(var(--thread-glow)/0.3))',
              }}
            />
            <motion.circle
              cx={startX}
              cy={startY}
              r="5"
              fill="hsl(var(--thread-red))"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{
                filter: 'drop-shadow(0 0 6px hsl(var(--thread-glow)))',
              }}
            />
            <motion.circle
              cx={endX}
              cy={endY}
              r="5"
              fill="hsl(var(--thread-red))"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              style={{
                filter: 'drop-shadow(0 0 6px hsl(var(--thread-glow)))',
              }}
            />
          </g>
        );
      })
    );
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Main Board Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
              Trip Planning Board
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Drag cards freely, connect them with investigation threads
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList>
                <TabsTrigger value="board" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Board
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {connectingFrom && (
              <div className="px-3 py-1 rounded-md bg-primary/20 text-sm animate-pulse">
                Select another card to connect
              </div>
            )}
            
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          </div>
        </div>

        {/* Zoom Controls for Board Mode */}
        {viewMode === 'board' && (
          <div className="absolute top-4 right-4 z-10 flex gap-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 border shadow-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <span className="px-2 text-sm font-medium self-center min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        )}

        {/* Board/Timeline View Container */}
        <div
          className={cn(
            'flex-1 rounded-2xl relative overflow-hidden border-2',
            viewMode === 'board' 
              ? 'bg-gradient-to-br from-[hsl(220,30%,12%)] to-[hsl(220,35%,18%)] border-primary/30' 
              : 'bg-background border-border overflow-auto'
          )}
        >
          {viewMode === 'board' && (
            <div className="absolute inset-0 overflow-auto">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  width: '2000px',
                  height: '1500px',
                  backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.1) 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                  position: 'relative',
                }}
              >
                {/* SVG for connections */}
                <svg 
                  className="absolute inset-0 pointer-events-none" 
                  style={{ 
                    width: '2000px', 
                    height: '1500px',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  {renderConnections()}
                </svg>

                {/* Cards */}
                <AnimatePresence>
                  {cards.map(card => (
                    <motion.div
                      key={card.id}
                      drag
                      dragMomentum={false}
                      dragElastic={0}
                      onDragStart={() => handleDragStart(card.id)}
                      onDragEnd={(_, info) => {
                        const newX = card.position.x + info.offset.x / zoom;
                        const newY = card.position.y + info.offset.y / zoom;
                        handleDragEnd(card.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
                      }}
                      style={{
                        position: 'absolute',
                        left: card.position.x,
                        top: card.position.y,
                        cursor: draggedCard === card.id ? 'grabbing' : 'grab',
                      }}
                      whileDrag={{ scale: 1.05, zIndex: 1000 }}
                    >
                      <TripCardComponent
                        card={card}
                        onUpdate={handleUpdateCard}
                        onDelete={handleDeleteCard}
                        onConnect={handleConnect}
                        isSelected={selectedCard === card.id || connectingFrom === card.id}
                        onSelect={setSelectedCard}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {cards.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plus className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Start Your Journey</h3>
                      <p className="text-gray-400 mb-6">
                        Create your first card to begin planning your trip. Add flights, stays, activities, and more!
                      </p>
                      <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
                        Create First Card
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
          {viewMode === 'timeline' && (
            <div className="p-6">
              <div className="space-y-4">
                {cards
                  .sort((a, b) => {
                    // Simple timeline sorting - you can enhance this
                    return a.position.y - b.position.y;
                  })
                  .map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative pl-8 border-l-2 border-primary/30"
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                      <TripCardComponent
                        card={card}
                        onUpdate={handleUpdateCard}
                        onDelete={handleDeleteCard}
                        onConnect={handleConnect}
                        isSelected={selectedCard === card.id}
                        onSelect={setSelectedCard}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Budget Dashboard */}
      <div className="w-80 space-y-4">
        <BudgetDashboard cards={cards} budget={budget} />
      </div>

      {/* Create Card Dialog */}
      <CreateCardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateCard={handleCreateCard}
      />
    </div>
  );
}
