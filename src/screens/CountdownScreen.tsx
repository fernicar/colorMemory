import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { hsbToHex, generateRandomColor } from '../utils/color';
import { motion, AnimatePresence } from 'motion/react';

export function CountdownScreen() {
  const { setScreen, currentHsb, hardMode } = useGameStore();
  const [step, setStep] = useState(0); // 0: ready, 1: set, 2: go
  const [bgColor, setBgColor] = useState('#000000');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runSequence = async () => {
      // Ready
      sound.tick();
      setStep(0);
      await new Promise(r => setTimeout(r, 800));

      // Set
      sound.tick();
      setStep(1);
      await new Promise(r => setTimeout(r, 800));

      // Go
      if (hardMode) {
        sound.hardOn();
      } else {
        sound.click();
      }
      setStep(2);
      setBgColor(hsbToHex(...currentHsb));
      
      await new Promise(r => setTimeout(r, 600));
      setScreen('memorize');
    };

    runSequence();

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (hardMode && step < 2) {
      const interval = setInterval(() => {
        setBgColor(hsbToHex(...generateRandomColor()));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [hardMode, step]);

  const texts = ['Ready', 'Set', 'Go!'];

  return (
    <motion.div 
      className="flex items-center justify-center h-full w-full relative overflow-hidden"
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: step === 2 && !hardMode ? 0.4 : 0 }}
    >
      {hardMode && step === 2 && (
        <motion.div 
          className="absolute inset-0 bg-white mix-blend-difference z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      
      <AnimatePresence mode="wait">
        <motion.h1
          key={step}
          initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className={`text-7xl font-black tracking-tighter z-20 ${step === 2 ? 'text-white mix-blend-difference' : 'text-white'}`}
        >
          {texts[step]}
        </motion.h1>
      </AnimatePresence>
    </motion.div>
  );
}
