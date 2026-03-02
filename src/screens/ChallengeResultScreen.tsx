import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { hsbToHex } from '../utils/color';
import { motion } from 'motion/react';
import { Share2, RotateCcw, Trophy } from 'lucide-react';

export function ChallengeResultScreen() {
  const { totalScore, roundScores, playerColors, challengeColors, hardMode, playerName, challenge, resetGame } = useGameStore();
  const [copied, setCopied] = useState(false);

  const challenger = challenge.scores[0];
  const isWinner = totalScore > challenger.score;

  const handleShare = async () => {
    sound.click();
    const payload = {
      n: playerName || 'ANON',
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
        <h2 className="text-sm font-bold tracking-widest uppercase opacity-50 mb-2">Challenge Result</h2>
        <div className="flex items-center gap-4 mb-12">
          <Trophy className={`w-12 h-12 ${isWinner ? 'text-emerald-400' : 'text-zinc-600'}`} />
          <div className="font-mono text-5xl font-black tracking-tighter">
            {isWinner ? 'You Win' : 'You Lose'}
          </div>
        </div>

        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-widest uppercase opacity-50">You</span>
              <span className="font-mono text-3xl font-black">{totalScore.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold tracking-widest uppercase opacity-50">{challenger.name}</span>
              <span className="font-mono text-3xl font-black text-zinc-400">{challenger.score.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 w-full">
            {roundScores.map((score, i) => {
              const targetHex = hsbToHex(...challengeColors[i]);
              const guessHex = hsbToHex(...playerColors[i]);
              const oppGuessHex = hsbToHex(...challenger.player_colors[i]);
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-full aspect-square rounded-xl overflow-hidden relative shadow-md"
                    style={{ background: `linear-gradient(135deg, ${targetHex} 50%, ${guessHex} 50%)` }}
                  />
                  <div className="text-xs font-mono font-bold text-white">{score.toFixed(1)}</div>
                  <div 
                    className="w-full aspect-square rounded-xl overflow-hidden relative shadow-md opacity-50"
                    style={{ background: `linear-gradient(135deg, ${targetHex} 50%, ${oppGuessHex} 50%)` }}
                  />
                  <div className="text-xs font-mono font-bold text-zinc-500">{challenger.round_scores[i].toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleShare}
          className="group relative flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold text-lg hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all mb-4"
        >
          <Share2 className="w-5 h-5" />
          {copied ? 'Copied to clipboard!' : 'Share Challenge'}
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
