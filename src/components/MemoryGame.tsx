import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Trophy, RotateCcw, Play, History, TrendingUp, Clock, Target } from 'lucide-react';

interface MemoryGameProps {
  onGameComplete: (score: number, level: number, reactionTime: number) => void;
  history: { date: string; score: number; level: number }[];
}

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = ['🍎', '🍌', '🍇', '🍓', '🍒', '🥝', '🫐', '🍑', '🍊', '🍋', '🍍', '🍉'];

export const MemoryGame: React.FC<MemoryGameProps> = ({ onGameComplete, history }) => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [status, setStatus] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const initGame = useCallback((lvl: number) => {
    const pairCount = Math.min(lvl + 1, ICONS.length); // Level 1: 2 pairs (4 cards), Level 2: 3 pairs (6 cards), etc.
    const selectedIcons = ICONS.slice(0, pairCount);
    const gameIcons = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5);

    const newCards: Card[] = gameIcons.map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setStatus('playing');
    setStartTime(Date.now());
    setElapsedTime(0);

    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  }, [timerInterval]);

  const handleCardClick = (id: number) => {
    if (status !== 'playing' || flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;

      if (cards[firstId].icon === cards[secondId].icon) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstId].isMatched = true;
          matchedCards[secondId].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(prev => prev + 1);

          if (matches + 1 === cards.length / 2) {
            handleGameWin();
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstId].isFlipped = false;
          resetCards[secondId].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameWin = () => {
    setStatus('complete');
    if (timerInterval) clearInterval(timerInterval);
    
    const totalTime = elapsedTime;
    const accuracy = Math.round(((cards.length / 2) / moves) * 100);
    const cognitiveScore = Math.round((accuracy * level) / (totalTime / 10));
    
    onGameComplete(cognitiveScore, level, totalTime * 1000);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    initGame(level + 1);
  };

  const restartLevel = () => {
    initGame(level);
  };

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Live Stats
            </h3>
            <div className="space-y-4">
              <StatItem icon={<Target className="w-4 h-4 text-primary" />} label="Level" value={level.toString()} />
              <StatItem icon={<Clock className="w-4 h-4 text-secondary" />} label="Time" value={`${elapsedTime}s`} />
              <StatItem icon={<RotateCcw className="w-4 h-4 text-amber-500" />} label="Moves" value={moves.toString()} />
              <StatItem icon={<Trophy className="w-4 h-4 text-emerald-500" />} label="Matches" value={`${matches}/${cards.length / 2}`} />
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              History
            </h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Play your first game to see history!</p>
              ) : (
                history.slice(-3).reverse().map((h, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(h.date).toLocaleDateString()}</span>
                    <span className="text-xs font-black text-primary">Score: {h.score}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center: Game Board */}
        <div className="lg:col-span-3 bg-slate-50 rounded-[40px] p-8 border border-slate-100 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {status === 'idle' ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-blue-100 flex items-center justify-center mx-auto">
                  <Brain className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900">Memory Match</h2>
                  <p className="text-slate-500 font-medium">Find all matching pairs to boost your cognitive score.</p>
                </div>
                <button 
                  onClick={() => initGame(1)}
                  className="px-12 py-5 bg-primary text-white rounded-[24px] font-black text-xl shadow-2xl shadow-blue-200 hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Start Training
                </button>
              </motion.div>
            ) : status === 'playing' ? (
              <motion.div 
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center"
              >
                <div className={`grid gap-6 w-full max-w-2xl ${
                  cards.length <= 4 ? 'grid-cols-2' : 
                  cards.length <= 8 ? 'grid-cols-4' : 
                  'grid-cols-4'
                }`}>
                  {cards.map((card) => (
                    <CardComponent 
                      key={card.id} 
                      card={card} 
                      onClick={() => handleCardClick(card.id)} 
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto">
                  <Trophy className="w-12 h-12 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900">Level {level} Complete!</h2>
                  <p className="text-slate-500 font-medium">Your memory is performing exceptionally well.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cognitive Score</p>
                    <p className="text-3xl font-black text-primary">
                      {Math.round((Math.round(((cards.length / 2) / moves) * 100) * level) / (elapsedTime / 10))}
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-3xl font-black text-secondary">
                      {Math.round(((cards.length / 2) / moves) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={nextLevel}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
                  >
                    Next Level
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={restartLevel}
                    className="px-8 py-4 bg-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-300 transition-colors flex items-center gap-2 justify-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const CardComponent = ({ card, onClick }: { card: Card, onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="aspect-square relative perspective-1000"
  >
    <motion.div
      initial={false}
      animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      className="w-full h-full relative preserve-3d"
    >
      {/* Front of card (Hidden) */}
      <div className="absolute inset-0 backface-hidden bg-white rounded-[32px] shadow-lg border-4 border-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary/30" />
        </div>
      </div>

      {/* Back of card (Revealed) */}
      <div 
        className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[32px] shadow-xl flex items-center justify-center text-6xl ${
          card.isMatched ? 'bg-emerald-50 border-4 border-emerald-100' : 'bg-white border-4 border-primary/10'
        }`}
      >
        {card.icon}
      </div>
    </motion.div>
  </motion.button>
);

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-xl shadow-sm">
        {icon}
      </div>
      <span className="text-xs font-bold text-slate-500">{label}</span>
    </div>
    <span className="text-sm font-black text-slate-800">{value}</span>
  </div>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
