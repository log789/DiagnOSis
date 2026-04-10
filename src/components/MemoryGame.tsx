import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Trophy, 
  RotateCcw, 
  Play, 
  History, 
  TrendingUp, 
  Clock, 
  Target, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Flame,
  Zap,
  Star
} from 'lucide-react';

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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [streak, setStreak] = useState(3); // Mock streak

  const initGame = useCallback((lvl: number) => {
    // Level 1: 2 pairs (4 cards), Level 2: 3 pairs (6 cards), Level 3: 4 pairs (8 cards)
    const pairCount = lvl === 1 ? 2 : lvl === 2 ? 3 : 4;
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
    const cognitiveScore = Math.min(100, Math.round((accuracy * level) / (totalTime / 5 + 1)));
    
    onGameComplete(cognitiveScore, level, totalTime * 1000);
  };

  const nextLevel = () => {
    const nextLvl = Math.min(3, level + 1);
    setLevel(nextLvl);
    initGame(nextLvl);
  };

  const restartLevel = () => {
    initGame(level);
  };

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const cognitiveScore = useMemo(() => {
    if (status !== 'complete') return 0;
    const accuracy = Math.round(((cards.length / 2) / moves) * 100);
    return Math.min(100, Math.round((accuracy * level) / (elapsedTime / 5 + 1)));
  }, [status, cards.length, moves, level, elapsedTime]);

  const aiInsight = useMemo(() => {
    if (cognitiveScore >= 90) return { text: "Exceptional performance. Memory recall is highly efficient.", status: "Improving" };
    if (cognitiveScore >= 75) return { text: "Memory performance stable. Consistency is excellent.", status: "Stable" };
    return { text: "Slight delay in recall. Recommend daily practice.", status: "Declining" };
  }, [cognitiveScore]);

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Cognitive Check</h2>
          <p className="text-slate-500 font-bold">Daily memory exercise for brain health.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-black text-slate-700">{streak}-Day Streak</span>
          </div>
          <div className="px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 shadow-sm">
            <Star className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-black text-emerald-700">Daily Challenge</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar: Stats */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] shadow-card border border-slate-100 p-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Session Metrics
            </h3>
            <div className="space-y-6">
              <StatItem icon={<Target className="w-5 h-5 text-accent" />} label="Level" value={level.toString()} color="bg-blue-50" />
              <StatItem icon={<Clock className="w-5 h-5 text-emerald-600" />} label="Timer" value={`${elapsedTime}s`} color="bg-emerald-50" />
              <StatItem icon={<RotateCcw className="w-5 h-5 text-amber-500" />} label="Moves" value={moves.toString()} color="bg-amber-50" />
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-card border border-slate-100 p-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <History className="w-4 h-4 text-accent" />
              Recent History
            </h3>
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="py-8 text-center opacity-40">
                  <Brain className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No history yet</p>
                </div>
              ) : (
                history.slice(-3).reverse().map((h, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(h.date).toLocaleDateString()}</p>
                      <p className="text-xs font-bold text-slate-700">Level {h.level}</p>
                    </div>
                    <span className="text-sm font-black text-accent">Score: {h.score}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center: Game Board */}
        <div className="lg:col-span-3 bg-white rounded-[48px] p-12 border border-slate-100 shadow-card flex flex-col items-center justify-center min-h-[650px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {status === 'idle' ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-10 max-w-md"
              >
                <div className="w-28 h-28 bg-blue-50 rounded-[40px] shadow-xl shadow-blue-100 flex items-center justify-center mx-auto mb-8">
                  <Brain className="w-14 h-14 text-accent" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Cognitive Training</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Improve your memory recall and attention span with our clinically-designed matching exercise.
                  </p>
                </div>
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-4 text-left">
                  <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
                  <p className="text-xs font-bold text-amber-800">
                    Daily Challenge: Match 4 pairs in under 30 seconds to earn a streak bonus!
                  </p>
                </div>
                <button 
                  onClick={() => initGame(1)}
                  className="w-full py-6 bg-accent text-white rounded-[32px] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95"
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
                <div className="mb-12 flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progress</span>
                    <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(matches / (cards.length / 2)) * 100}%` }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-100" />
                  <div className="text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Matches</span>
                    <p className="text-xl font-black text-slate-900">{matches} / {cards.length / 2}</p>
                  </div>
                </div>

                <div className={`grid gap-8 w-full max-w-3xl ${
                  cards.length <= 4 ? 'grid-cols-2 max-w-md' : 
                  cards.length <= 6 ? 'grid-cols-3 max-w-2xl' : 
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
                className="text-center space-y-10 w-full max-w-2xl"
              >
                <div className="w-28 h-28 bg-emerald-100 rounded-[40px] flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-14 h-14 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900">Training Complete!</h2>
                  <p className="text-slate-500 font-bold">Excellent focus. Your cognitive performance is stable.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ResultCard label="Cognitive Score" value={cognitiveScore.toString()} subValue={aiInsight.status} color="text-accent" />
                  <ResultCard label="Accuracy" value={`${Math.round(((cards.length / 2) / moves) * 100)}%`} subValue="Excellent" color="text-emerald-500" />
                  <ResultCard label="Time" value={`${elapsedTime}s`} subValue="Fast Recall" color="text-amber-500" />
                </div>

                <div className="p-8 bg-slate-900 rounded-[40px] text-left relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <Sparkles className="w-20 h-20 text-amber-400" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Clinical Insight</h4>
                    </div>
                    <p className="text-white font-bold leading-relaxed">
                      {aiInsight.text}
                    </p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-4">
                      Based on: accuracy, time, and consistency
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button 
                    onClick={nextLevel}
                    className="flex-1 py-5 bg-accent text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95"
                  >
                    {level < 3 ? 'Next Challenge' : 'Play Again'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={restartLevel}
                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[24px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Restart Level
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
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="aspect-square relative perspective-1000 w-full"
  >
    <motion.div
      initial={false}
      animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      className="w-full h-full relative preserve-3d"
    >
      {/* Front of card (Hidden) */}
      <div className="absolute inset-0 backface-hidden bg-white rounded-[32px] shadow-lg border border-slate-100 flex items-center justify-center group">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          <Brain className="w-8 h-8 text-slate-200 group-hover:text-accent/30 transition-colors" />
        </div>
      </div>

      {/* Back of card (Revealed) */}
      <div 
        className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[32px] shadow-xl flex items-center justify-center text-6xl ${
          card.isMatched ? 'bg-emerald-50 border-4 border-emerald-100' : 'bg-white border-4 border-accent/10'
        }`}
      >
        {card.icon}
      </div>
    </motion.div>
  </motion.button>
);

const StatItem = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
        {icon}
      </div>
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-lg font-black text-slate-900">{value}</span>
  </div>
);

const ResultCard = ({ label, value, subValue, color }: { label: string, value: string, subValue: string, color: string }) => (
  <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-4xl font-black mb-1 ${color}`}>{value}</p>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">{subValue}</p>
  </div>
);
