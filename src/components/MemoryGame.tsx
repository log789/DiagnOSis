import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Trophy, RotateCcw, Play, History, TrendingUp } from 'lucide-react';

interface MemoryGameProps {
  onGameComplete: (score: number, level: number, reactionTime: number) => void;
  history: { date: string; score: number; level: number }[];
}

const COLORS = [
  { id: 0, color: 'bg-blue-300', active: 'bg-blue-500', label: 'Blue' },
  { id: 1, color: 'bg-green-300', active: 'bg-green-500', label: 'Green' },
  { id: 2, color: 'bg-amber-300', active: 'bg-amber-500', label: 'Yellow' },
  { id: 3, color: 'bg-rose-300', active: 'bg-rose-500', label: 'Red' },
];

export const MemoryGame: React.FC<MemoryGameProps> = ({ onGameComplete, history }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState<'idle' | 'playing' | 'success' | 'fail'>('idle');
  const [startTime, setStartTime] = useState<number>(0);

  const startNewGame = () => {
    const firstStep = Math.floor(Math.random() * 4);
    setSequence([firstStep]);
    setUserSequence([]);
    setLevel(1);
    setStatus('playing');
    setIsPlaying(true);
    showSequence([firstStep]);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveIndex(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveIndex(null);
    }
    setIsShowingSequence(false);
    setStartTime(Date.now());
  };

  const handleButtonClick = (id: number) => {
    if (isShowingSequence || status !== 'playing') return;

    const newUserSequence = [...userSequence, id];
    setUserSequence(newUserSequence);

    // Visual feedback
    setActiveIndex(id);
    setTimeout(() => setActiveIndex(null), 300);

    // Check correctness
    const currentStep = newUserSequence.length - 1;
    if (newUserSequence[currentStep] !== sequence[currentStep]) {
      setStatus('fail');
      setIsPlaying(false);
      const reactionTime = Date.now() - startTime;
      onGameComplete(level * 10, level, reactionTime);
      return;
    }

    // Check if level complete
    if (newUserSequence.length === sequence.length) {
      if (level >= 10) {
        setStatus('success');
        setIsPlaying(false);
        const reactionTime = Date.now() - startTime;
        onGameComplete(level * 10, level, reactionTime);
      } else {
        const nextStep = Math.floor(Math.random() * 4);
        const nextSequence = [...sequence, nextStep];
        setSequence(nextSequence);
        setUserSequence([]);
        setLevel(prev => prev + 1);
        setTimeout(() => showSequence(nextSequence), 1000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
              <Brain className="text-primary" />
              Memory Sequence
            </h2>
            <p className="text-slate-500 text-sm">Watch the pattern and repeat it back.</p>
          </div>

          {/* Level Indicator */}
          <div className="flex items-center gap-4">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i < level ? 'bg-primary scale-125' : 'bg-slate-200'
                }`} 
              />
            ))}
          </div>

          {/* Game Buttons */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
            {COLORS.map((btn) => (
              <motion.button
                key={btn.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleButtonClick(btn.id)}
                disabled={isShowingSequence || status !== 'playing'}
                className={`aspect-square rounded-3xl shadow-lg transition-colors duration-300 flex items-center justify-center text-white font-bold text-xl ${
                  activeIndex === btn.id ? btn.active : btn.color
                } ${isShowingSequence ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {/* Large accessible label for screen readers or visual aid */}
                <span className="sr-only">{btn.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="w-full pt-4">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.button
                  key="start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={startNewGame}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Daily Session
                </motion.button>
              )}
              {status === 'fail' && (
                <motion.div
                  key="fail"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
                    <p className="font-bold">Good effort!</p>
                    <p className="text-sm">You reached Level {level}. Let's try again tomorrow.</p>
                  </div>
                  <button
                    onClick={startNewGame}
                    className="flex items-center gap-2 mx-auto text-primary font-bold hover:underline"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                    <Trophy className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold">Excellent!</p>
                    <p className="text-sm">You completed all levels today. Your memory is sharp!</p>
                  </div>
                  <button
                    onClick={startNewGame}
                    className="flex items-center gap-2 mx-auto text-primary font-bold hover:underline"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats & History */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Cognitive Trends
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Level</p>
                <p className="text-2xl font-black text-slate-800">{level}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Accuracy</p>
                <p className="text-2xl font-black text-slate-800">
                  {status === 'playing' ? Math.round((userSequence.length / sequence.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Scores
            </h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No games played yet.</p>
              ) : (
                history.slice(-5).reverse().map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-500">{new Date(h.date).toLocaleDateString()}</p>
                      <p className="text-sm font-medium text-slate-700">Level {h.level}</p>
                    </div>
                    <div className="text-primary font-black">+{h.score}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
