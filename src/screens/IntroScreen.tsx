import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { motion } from 'motion/react';
import { Play, Users, Volume2, VolumeX, Zap } from 'lucide-react';

export function IntroScreen() {
  const { setScreen, setHardMode, hardMode, startGame } = useGameStore();
  const [muted, setMuted] = useState(sound.isMuted());

  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    sound.setMuted(newMuted);
    sound.click();
  };

  const handleSinglePlayer = () => {
    sound.click();
    startGame(false);
  };

  const handleMultiplayer = () => {
    sound.click();
    setScreen('challenge-setup');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-full w-full p-8 text-white relative"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <h1 className="text-6xl font-black tracking-tighter mb-4">color</h1>
        <p className="text-zinc-400 text-center mb-12 leading-relaxed">
          Test your memory. See a color, remember it, and recreate it.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handleSinglePlayer}
            onMouseEnter={() => sound.hover()}
            className="group relative flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Play className="w-5 h-5 fill-current" />
            Single Player
          </button>

          <button
            onClick={handleMultiplayer}
            onMouseEnter={() => sound.hover()}
            className="group relative flex items-center justify-center gap-3 w-full py-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl font-bold text-lg hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Users className="w-5 h-5" />
            Multiplayer
          </button>
        </div>

        <div className="mt-12 flex items-center gap-3 bg-zinc-900/50 p-2 rounded-full border border-zinc-800/50">
          <button
            onClick={() => { sound.click(); setHardMode(false); }}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${!hardMode ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Easy
          </button>
          <button
            onClick={() => { sound.click(); setHardMode(true); }}
            className={`flex items-center gap-1 px-6 py-2 rounded-full font-medium text-sm transition-all ${hardMode ? 'bg-red-500 text-white shadow-sm shadow-red-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Zap className="w-4 h-4" />
            Hard
          </button>
        </div>
      </div>

      <button
        onClick={handleMuteToggle}
        className="absolute bottom-6 right-6 p-3 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </motion.div>
  );
}
