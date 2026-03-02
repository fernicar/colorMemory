import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { hsbToHex } from '../utils/color';
import { motion } from 'motion/react';
import { Share2, RotateCcw } from 'lucide-react';

export function TotalScreen() {
  const { totalScore, roundScores, playerColors, challengeColors, hardMode, playerName, resetGame } = useGameStore();
  const [initials, setInitials] = useState(playerName.slice(0, 3).toUpperCase());
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    sound.click();
    const payload = {
      n: initials || 'ANON',
      c: challengeColors,
      m: hardMode ? 'hard' : 'easy',
      s: totalScore,
      rs: roundScores,
      pc: playerColors
    };
    const b64 = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}${window.location.pathname}?d=${b64}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'colorMemory Challenge',
          text: `I scored ${totalScore.toFixed(2)} in colorMemory. Can you beat me?`,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error('Share failed', e);
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full w-full p-8 text-white relative overflow-y-auto no-scrollbar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <h2 className="text-sm font-bold tracking-widest uppercase opacity-50 mb-2">Final Score</h2>
        <div className="font-mono text-7xl font-black tracking-tighter mb-1">
          {totalScore.toFixed(2)}
        </div>
        <div className="text-zinc-500 font-bold tracking-widest mb-12">/ 50.00</div>

        <div className="grid grid-cols-5 gap-2 w-full mb-12">
          {roundScores.map((score, i) => {
            const targetHex = hsbToHex(...challengeColors[i]);
            const guessHex = hsbToHex(...playerColors[i]);
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className="w-full aspect-square rounded-xl overflow-hidden relative shadow-md"
                  style={{ background: `linear-gradient(135deg, ${targetHex} 50%, ${guessHex} 50%)` }}
                />
                <div className="text-xs font-mono font-bold text-zinc-400">{score.toFixed(1)}</div>
              </div>
            );
          })}
        </div>

        <div className="w-full mb-8">
          <label className="block text-xs font-bold tracking-widest uppercase opacity-50 mb-2 text-center">
            Your Initials
          </label>
          <input
            type="text"
            value={initials}
            onChange={(e) => {
              sound.tick();
              setInitials(e.target.value.toUpperCase().slice(0, 3).replace(/[^A-Z]/g, ''));
            }}
            className="w-full bg-zinc-900 border border-zinc-800 text-center text-3xl font-black tracking-widest outline-none py-4 rounded-2xl focus:border-white transition-colors uppercase"
            placeholder="AAA"
          />
        </div>

        <button
          onClick={handleShare}
          className="group relative flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all mb-4"
        >
          <Share2 className="w-5 h-5" />
          {copied ? 'Copied to clipboard!' : 'Challenge a friend'}
        </button>

        <button
          onClick={() => { sound.click(); resetGame(); }}
          className="group relative flex items-center justify-center gap-3 w-full py-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl font-bold text-lg hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </motion.div>
  );
}
