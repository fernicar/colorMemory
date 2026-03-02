import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { hsbToHex, getTextColor } from '../utils/color';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const getFeedback = (s: number) => {
  if (s === 10) return "Are you a robot? Perfect match.";
  if (s >= 9.5) return "Scary accurate. Do you have a colorimeter in your eye?";
  if (s >= 9.0) return "Excellent. You actually paid attention.";
  if (s >= 8.0) return "Not bad, but not great either. Just okay.";
  if (s >= 7.0) return "You were in the right neighborhood, but wrong house.";
  if (s >= 5.0) return "Did you even look at the color?";
  if (s >= 3.0) return "A blindfolded toddler smashing the screen would have outperformed you.";
  return "Are you colorblind? Seriously asking.";
};

export function ResultScreen() {
  const { currentHsb, pickerHsb, roundScores, nextRound } = useGameStore();
  const score = roundScores[roundScores.length - 1];
  const [displayScore, setDisplayScore] = useState(0);

  const targetHex = hsbToHex(...currentHsb);
  const guessHex = hsbToHex(...pickerHsb);
  const targetText = getTextColor(...currentHsb);
  const guessText = getTextColor(...pickerHsb);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 1500;
    let lastTick = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Quintic ease out
      const easeProgress = 1 - Math.pow(1 - progress, 5);
      const currentVal = easeProgress * score;
      
      setDisplayScore(currentVal);

      if (Math.floor(currentVal * 10) > lastTick) {
        sound.tick();
        lastTick = Math.floor(currentVal * 10);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayScore(score);
        sound.scoreLand();
        sound.speak(getFeedback(score));
      }
    };

    requestAnimationFrame(step);
  }, [score]);

  const intPart = Math.floor(displayScore);
  const decPart = (displayScore % 1).toFixed(2).substring(1);

  return (
    <motion.div 
      className="flex flex-col h-full w-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        className="flex-1 flex flex-col items-center justify-center p-8 relative transition-colors duration-500"
        style={{ backgroundColor: guessHex, color: guessText }}
      >
        <h3 className="text-xs font-bold tracking-widest uppercase opacity-50 mb-2">Your Guess</h3>
        <div className="flex items-baseline font-mono font-black tracking-tighter">
          <span className="text-8xl">{intPart}</span>
          <span className="text-5xl opacity-80">{decPart}</span>
        </div>
        <p className="mt-4 text-center font-medium max-w-xs opacity-90">
          {displayScore === score ? getFeedback(score) : "..."}
        </p>
      </div>

      <div 
        className="flex-1 flex flex-col items-center justify-center p-8 relative transition-colors duration-500"
        style={{ backgroundColor: targetHex, color: targetText }}
      >
        <h3 className="text-xs font-bold tracking-widest uppercase opacity-50 mb-2">Target Color</h3>
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-10 pointer-events-none">
        <div className="w-12 h-1 bg-white/20 rounded-full backdrop-blur-md shadow-lg" />
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8 z-20">
        <button
          onClick={() => { sound.click(); nextRound(); }}
          className="group flex items-center justify-center gap-2 w-full max-w-xs py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-2xl bg-white text-black"
        >
          Next Round
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
