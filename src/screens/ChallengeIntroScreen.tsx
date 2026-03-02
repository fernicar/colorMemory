import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { isSpicy } from '../utils/spicy';
import { SpicyOverlay } from '../components/SpicyOverlay';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

export function ChallengeIntroScreen() {
  const { setPlayerName, startGame, challenge } = useGameStore();
  const [name, setName] = useState('');
  const [showSpicy, setShowSpicy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleStart = () => {
    sound.click();
    if (!name.trim()) return;
    
    if (isSpicy(name)) {
      setShowSpicy(true);
      return;
    }
    
    proceed();
  };

  const proceed = () => {
    setPlayerName(name.trim());
    startGame(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col h-full w-full p-8 text-white relative"
    >
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <h2 className="text-4xl font-black tracking-tighter mb-4 text-center leading-tight">
          <span className="text-emerald-400">{challenge.challengerName}</span> challenged you.
        </h2>
        <p className="text-zinc-400 text-center mb-12">
          They scored <span className="font-bold text-white">{challenge.scores[0]?.score.toFixed(2)}</span>. Can you beat them?
        </p>

        <div className="relative w-full mb-12">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => {
              sound.tick();
              setName(e.target.value.slice(0, 12));
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            className="w-full bg-transparent text-center text-5xl font-black tracking-tighter outline-none placeholder-zinc-800"
            placeholder="YOUR NAME"
            spellCheck={false}
          />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${(name.length / 12) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="group relative flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold text-lg hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          <Play className="w-5 h-5 fill-current" />
          Accept Challenge
        </button>
      </div>

      <SpicyOverlay 
        isOpen={showSpicy} 
        onChange={() => {
          sound.click();
          setShowSpicy(false);
          setName('');
          inputRef.current?.focus();
        }}
        onKeep={() => {
          sound.click();
          setShowSpicy(false);
          proceed();
        }}
      />
    </motion.div>
  );
}
