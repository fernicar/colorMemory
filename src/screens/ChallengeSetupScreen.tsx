import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { isSpicy } from '../utils/spicy';
import { SpicyOverlay } from '../components/SpicyOverlay';
import { motion } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';

export function ChallengeSetupScreen() {
  const { setScreen, setPlayerName, startGame } = useGameStore();
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
    startGame(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full w-full p-8 text-white relative"
    >
      <button 
        onClick={() => { sound.click(); setScreen('intro'); }}
        className="absolute top-8 left-8 p-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Challenge a friend</h2>
        <p className="text-zinc-400 text-center mb-12">
          Enter your name to start. You'll get a shareable link after 5 rounds.
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
            placeholder="NAME"
            spellCheck={false}
          />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${(name.length / 12) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="group relative flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          <Play className="w-5 h-5 fill-current" />
          Start playing
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
