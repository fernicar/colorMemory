import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { hsbToHex, getTextColor } from '../utils/color';
import { motion } from 'motion/react';
import { FastForward } from 'lucide-react';

export function MemorizeScreen() {
  const { setScreen, currentHsb, hardMode } = useGameStore();
  const duration = hardMode ? 2000 : 5000;
  const [timeLeft, setTimeLeft] = useState(duration);
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  const bgColor = hsbToHex(...currentHsb);
  const textColor = getTextColor(...currentHsb);

  useEffect(() => {
    const animate = (time: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = time;
      }
      const elapsed = time - startTimeRef.current;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining > 0) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        handleSkip();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [duration]);

  const handleSkip = () => {
    sound.click();
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setScreen('picker');
  };

  const seconds = Math.floor(timeLeft / 1000);
  const hundredths = Math.floor((timeLeft % 1000) / 10);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {hardMode && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: [0, -10, 10, -10, 10, 0],
            y: [0, 10, -10, 10, -10, 0],
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      <div className="flex flex-col items-center justify-center flex-1 z-10">
        <h2 className="text-sm font-bold tracking-widest uppercase opacity-70 mb-4">Memorize</h2>
        <div className="font-mono text-8xl font-black tracking-tighter tabular-nums flex items-baseline">
          {seconds}.{hundredths.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="absolute bottom-8 z-10 w-full px-8 flex justify-center">
        <button
          onClick={handleSkip}
          className="group flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: textColor, color: bgColor }}
        >
          <FastForward className="w-4 h-4" />
          Skip
        </button>
      </div>
    </motion.div>
  );
}
